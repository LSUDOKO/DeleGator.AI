import {
  StrategyRegistry,
  DelegationManager,
  RebalanceExecutor,
  PythOracle,
  UniswapHelper,
} from "generated";

// Backend webhook configuration
const BACKEND_WEBHOOK_URL = process.env.BACKEND_WEBHOOK_URL || "http://localhost:3000/indexer/webhook";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "delegator-ai-secret-change-in-production";

/**
 * Send event to backend webhook for processing
 */
async function notifyBackend(payload: {
  chainId: number;
  eventName: string;
  blockNumber: bigint;
  transactionHash: string;
  logIndex: number;
  data: any;
}) {
  try {
    const response = await fetch(BACKEND_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Envio-Secret": WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        ...payload,
        blockNumber: payload.blockNumber.toString(), // Convert BigInt to string for JSON
      }),
    });

    if (!response.ok) {
      console.error(`Backend webhook failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to notify backend:`, error);
  }
}

/**
 * Get or create ChainStats entity
 */
async function getOrCreateChainStats(context: any, chainId: number, block: bigint, timestamp: bigint) {
  const id = chainId.toString();
  let stats = await context.ChainStats.get(id);
  
  if (!stats) {
    stats = {
      id,
      chainId,
      totalStrategies: 0,
      activeStrategies: 0,
      totalDelegations: 0,
      activeDelegations: 0,
      totalRebalances: 0,
      successfulRebalances: 0,
      failedRebalances: 0,
      totalGasUsed: 0n,
      lastUpdatedAt: timestamp,
      lastUpdatedAtBlock: block,
    };
  }
  
  return stats;
}

// ============================================
// STRATEGY REGISTRY HANDLERS
// ============================================

StrategyRegistry.StrategyCreated.handler(async ({ event, context }) => {
  const { strategyId, user, tokens, weights, rebalanceInterval } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Create Strategy entity
  const strategyEntityId = `${chainId}-${strategyId}`;
  const strategy = {
    id: strategyEntityId,
    chainId,
    strategyId,
    user: user.toLowerCase(),
    tokens: tokens.map((t: string) => t.toLowerCase()),
    weights: weights.map((w: bigint) => Number(w)),
    rebalanceInterval,
    isActive: true,
    createdAt: timestamp,
    createdAtBlock: block,
    updatedAt: timestamp,
    updatedAtBlock: block,
  };

  context.Strategy.set(strategy);

  // Update chain stats
  const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
  stats.totalStrategies += 1;
  stats.activeStrategies += 1;
  stats.lastUpdatedAt = timestamp;
  stats.lastUpdatedAtBlock = block;
  context.ChainStats.set(stats);

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "StrategyCreated",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { strategyId: strategyId.toString(), user, tokens, weights: weights.map(w => w.toString()), rebalanceInterval: rebalanceInterval.toString() },
  });
});

StrategyRegistry.StrategyUpdated.handler(async ({ event, context }) => {
  const { strategyId, weights, rebalanceInterval } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Update Strategy entity
  const strategyEntityId = `${chainId}-${strategyId}`;
  const strategy = await context.Strategy.get(strategyEntityId);

  if (strategy) {
    strategy.weights = weights.map((w: bigint) => Number(w));
    strategy.rebalanceInterval = rebalanceInterval;
    strategy.updatedAt = timestamp;
    strategy.updatedAtBlock = block;
    context.Strategy.set(strategy);
  }

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "StrategyUpdated",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { strategyId: strategyId.toString(), weights: weights.map(w => w.toString()), rebalanceInterval: rebalanceInterval.toString() },
  });
});

StrategyRegistry.StrategyDeactivated.handler(async ({ event, context }) => {
  const { strategyId } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Update Strategy entity
  const strategyEntityId = `${chainId}-${strategyId}`;
  const strategy = await context.Strategy.get(strategyEntityId);

  if (strategy) {
    strategy.isActive = false;
    strategy.updatedAt = timestamp;
    strategy.updatedAtBlock = block;
    context.Strategy.set(strategy);

    // Update chain stats
    const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
    stats.activeStrategies -= 1;
    stats.lastUpdatedAt = timestamp;
    stats.lastUpdatedAtBlock = block;
    context.ChainStats.set(stats);
  }

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "StrategyDeactivated",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { strategyId: strategyId.toString() },
  });
});

// ============================================
// DELEGATION MANAGER HANDLERS
// ============================================

DelegationManager.DelegationCreated.handler(async ({ event, context }) => {
  const { delegationHash, user, delegate, strategyId } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Create Delegation entity
  const delegation = {
    id: delegationHash,
    chainId,
    delegationHash,
    user: user.toLowerCase(),
    delegate: delegate.toLowerCase(),
    strategy_id: `${chainId}-${strategyId}`,
    isActive: true,
    createdAt: timestamp,
    createdAtBlock: block,
    revokedAt: undefined,
    revokedAtBlock: undefined,
  };

  context.Delegation.set(delegation);

  // Update chain stats
  const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
  stats.totalDelegations += 1;
  stats.activeDelegations += 1;
  stats.lastUpdatedAt = timestamp;
  stats.lastUpdatedAtBlock = block;
  context.ChainStats.set(stats);

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "DelegationCreated",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { delegationHash, user, delegate, strategyId: strategyId.toString() },
  });
});

DelegationManager.DelegationRevoked.handler(async ({ event, context }) => {
  const { delegationHash } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Update Delegation entity
  const delegation = await context.Delegation.get(delegationHash);

  if (delegation) {
    delegation.isActive = false;
    delegation.revokedAt = timestamp;
    delegation.revokedAtBlock = block;
    context.Delegation.set(delegation);

    // Update chain stats
    const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
    stats.activeDelegations -= 1;
    stats.lastUpdatedAt = timestamp;
    stats.lastUpdatedAtBlock = block;
    context.ChainStats.set(stats);
  }

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "DelegationRevoked",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { delegationHash },
  });
});

// ============================================
// REBALANCE EXECUTOR HANDLERS
// ============================================

RebalanceExecutor.RebalanceExecuted.handler(async ({ event, context }) => {
  const { strategyId, driftBps, gasUsed } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Create Rebalance entity
  const rebalanceId = `${txHash}-${logIndex}`;
  const rebalance = {
    id: rebalanceId,
    chainId,
    strategy_id: `${chainId}-${strategyId}`,
    txHash,
    driftBps,
    gasUsed,
    status: "SUCCESS" as const,
    errorReason: undefined,
    executedAt: timestamp,
    executedAtBlock: block,
  };

  context.Rebalance.set(rebalance);

  // Update chain stats
  const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
  stats.totalRebalances += 1;
  stats.successfulRebalances += 1;
  stats.totalGasUsed += gasUsed;
  stats.lastUpdatedAt = timestamp;
  stats.lastUpdatedAtBlock = block;
  context.ChainStats.set(stats);

  // Notify backend (triggers BotWorker)
  await notifyBackend({
    chainId,
    eventName: "RebalanceExecuted",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { strategyId: strategyId.toString(), driftBps: driftBps.toString(), gasUsed: gasUsed.toString() },
  });
});

RebalanceExecutor.RebalanceFailed.handler(async ({ event, context }) => {
  const { strategyId, reason } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Create Rebalance entity
  const rebalanceId = `${txHash}-${logIndex}`;
  const rebalance = {
    id: rebalanceId,
    chainId,
    strategy_id: `${chainId}-${strategyId}`,
    txHash,
    driftBps: 0n,
    gasUsed: 0n,
    status: "FAILED" as const,
    errorReason: reason,
    executedAt: timestamp,
    executedAtBlock: block,
  };

  context.Rebalance.set(rebalance);

  // Update chain stats
  const stats = await getOrCreateChainStats(context, chainId, block, timestamp);
  stats.totalRebalances += 1;
  stats.failedRebalances += 1;
  stats.lastUpdatedAt = timestamp;
  stats.lastUpdatedAtBlock = block;
  context.ChainStats.set(stats);

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "RebalanceFailed",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { strategyId: strategyId.toString(), reason },
  });
});

// ============================================
// PYTH ORACLE HANDLERS
// ============================================

PythOracle.PriceFeedUpdated.handler(async ({ event, context }) => {
  const { token, price, publishTime } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Update PriceFeed entity
  const priceFeedId = `${chainId}-${token.toLowerCase()}`;
  const priceFeed = {
    id: priceFeedId,
    chainId,
    token: token.toLowerCase(),
    price: BigInt(price),
    publishTime,
    updatedAt: timestamp,
    updatedAtBlock: block,
  };

  context.PriceFeed.set(priceFeed);

  // Notify backend (for drift calculation)
  await notifyBackend({
    chainId,
    eventName: "PriceFeedUpdated",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { token, price: price.toString(), publishTime: publishTime.toString() },
  });
});

// ============================================
// UNISWAP HELPER HANDLERS
// ============================================

UniswapHelper.SwapExecuted.handler(async ({ event, context }) => {
  const { tokenIn, tokenOut, amountIn, amountOut } = event.params;
  const chainId = event.chainId;
  const block = event.block.number;
  const timestamp = event.block.timestamp;
  const txHash = event.transaction.hash;
  const logIndex = event.logIndex;

  // Create Swap entity
  const swapId = `${txHash}-${logIndex}`;
  const swap = {
    id: swapId,
    chainId,
    txHash,
    tokenIn: tokenIn.toLowerCase(),
    tokenOut: tokenOut.toLowerCase(),
    amountIn,
    amountOut,
    executedAt: timestamp,
    executedAtBlock: block,
  };

  context.Swap.set(swap);

  // Notify backend
  await notifyBackend({
    chainId,
    eventName: "SwapExecuted",
    blockNumber: block,
    transactionHash: txHash,
    logIndex,
    data: { tokenIn, tokenOut, amountIn: amountIn.toString(), amountOut: amountOut.toString() },
  });
});
