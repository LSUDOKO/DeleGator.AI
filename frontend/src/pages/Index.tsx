import { useRef, useEffect, useState } from "react";
import { Canvas, CanvasHandle } from "@/components/canvas/Canvas";
import { FloatingChatPanel } from "@/components/ai-chat/FloatingChatPanel";
import { FloatingToolbar } from "@/components/toolbar/FloatingToolbar";
import { FloatingWorkflowPanel } from "@/components/workflow/FloatingWorkflowPanel";
import { LogoMarquee } from "@/components/layout/LogoMarquee";
import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { AICanvas } from "@/components/ai/AICanvas";
import { AIOrb } from "@/components/ai/AIOrb";
import { useCanvas } from "@/hooks/useCanvas";
import { useDelegation } from "@/hooks/useDelegation";
import { useStrategy } from "@/hooks/useStrategy";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { strategiesApi } from "@/lib/api/strategies";
import type { Strategy } from "@/lib/types/strategy";
import { BlockType, Block, AssetBlock, ConditionBlock, ActionBlock } from "@/lib/types/blocks";
import { AssetBlockEditModal } from "@/components/blocks/AssetBlockEditModal";
import { ConditionBlockEditModal } from "@/components/blocks/ConditionBlockEditModal";
import { ActionBlockEditModal } from "@/components/blocks/ActionBlockEditModal";
import { DelegationManagerModal } from "@/components/delegation/DelegationManagerModal";
import { StrategySetupWizard } from "@/components/wizard/StrategySetupWizard";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";
import { AnimatePresence, motion } from "framer-motion";
import { Target, Loader2, Brain, Shield, Zap, Play } from "lucide-react";

const Index = () => {
  const canvasRef = useRef<CanvasHandle>(null);
  const {
    strategy,
    selectedBlockId,
    setStrategy,
    handleBlockMove,
    handleStartBlockMove,
    handleEndBlockMove,
    handleBlockSelect,
    handleConnectionCreate,
    handleConnectionDelete,
    handleBlockDelete,
    handleBlockUpdate,
    createDemoStrategy,
    loadTemplate,
    addBlock,
    resetCanvas,
    autoLayout,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useCanvas();

  // Delegation hook - get chainId from strategy if available
  const strategyChainId = strategy?.blocks.find(b => b.type === BlockType.ASSET)?.data.chainId;
  const { activeDelegation, refreshDelegations } = useDelegation(strategyChainId);

  // Strategy hook for saving
  const { saveStrategy, saving } = useStrategy();
  const { toast } = useToast();

  // Auth hook - for blocking canvas access until authenticated
  const { isFullyAuthenticated, getBackendToken } = useAuth();

  // Control auth modal visibility with manual dismissal
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingActiveStrategy, setLoadingActiveStrategy] = useState(false);
  const hasAutoLoadedRef = useRef(false);

  useEffect(() => {
    // Show modal if we have a strategy and user is not authenticated
    if (strategy && !isFullyAuthenticated) {
      setShowAuthModal(true);
    }
  }, [strategy, isFullyAuthenticated]);

  // Handle manual dismissal after authentication completes
  const handleAuthComplete = () => {
    setShowAuthModal(false);
  };

  // Reset auto-load tracking when user logs out or canvas is cleared
  useEffect(() => {
    if (!isFullyAuthenticated || !strategy || (strategy.blocks && strategy.blocks.length === 0)) {
      hasAutoLoadedRef.current = false;
    }
  }, [isFullyAuthenticated, strategy]);

  // Auto-load active strategy if user has delegation
  useEffect(() => {
    const loadActiveStrategy = async () => {
      // Check if strategy has actual content blocks (not just empty canvas)
      const hasContentBlocks = strategy && strategy.blocks && strategy.blocks.length > 0;

      // Only load if:
      // 1. User is authenticated
      // 2. Active delegation exists with strategyId
      // 3. No content blocks on canvas (empty canvas is ok)
      // 4. Haven't already loaded this strategy
      if (!isFullyAuthenticated || !activeDelegation?.strategyId || hasContentBlocks || hasAutoLoadedRef.current) {
        return;
      }

      console.log('[Auto-load] Loading active strategy:', activeDelegation.strategyId);

      try {
        setLoadingActiveStrategy(true);
        hasAutoLoadedRef.current = true;

        const token = await getBackendToken();
        if (!token) {
          console.error('[Auto-load] No backend token available');
          hasAutoLoadedRef.current = false;
          return;
        }

        // Fetch strategy from backend
        const strategyData = await strategiesApi.getStrategy(activeDelegation.strategyId, token);
        console.log('[Auto-load] Strategy data fetched:', strategyData);

        // Convert backend format to canvas format
        const strategyLogic = (strategyData as any).strategyLogic;
        if (strategyLogic) {
          const canvasStrategy: Strategy = {
            id: strategyLogic.id,
            name: strategyLogic.name,
            description: strategyLogic.description,
            blocks: strategyLogic.blocks,
            connections: strategyLogic.connections,
            startBlockPosition: strategyLogic.startBlockPosition,
            endBlockPosition: strategyLogic.endBlockPosition,
            metadata: strategyLogic.metadata,
          };

          console.log('[Auto-load] Loading strategy onto canvas:', canvasStrategy.name);
          // Load strategy onto canvas
          setStrategy(canvasStrategy);
        } else {
          console.error('[Auto-load] No strategyLogic found in response');
          hasAutoLoadedRef.current = false;
        }
      } catch (error) {
        console.error('[Auto-load] Failed to load active strategy:', error);
        hasAutoLoadedRef.current = false;
      } finally {
        setLoadingActiveStrategy(false);
      }
    };

    loadActiveStrategy();
  }, [isFullyAuthenticated, activeDelegation?.strategyId]);

  // Editing state for AssetBlockEditModal
  const [editingAssetBlock, setEditingAssetBlock] = useState<AssetBlock | null>(null);
  const [isAssetEditModalOpen, setIsAssetEditModalOpen] = useState(false);

  // Editing state for ConditionBlockEditModal
  const [editingConditionBlock, setEditingConditionBlock] = useState<ConditionBlock | null>(null);
  const [isConditionEditModalOpen, setIsConditionEditModalOpen] = useState(false);

  // Editing state for ActionBlockEditModal
  const [editingActionBlock, setEditingActionBlock] = useState<ActionBlock | null>(null);
  const [isActionEditModalOpen, setIsActionEditModalOpen] = useState(false);

  // Delegation manager modal state
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);

  // Strategy setup wizard modal state
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState<'smart-account' | 'manage'>('smart-account');

  // Handle block edit
  const handleBlockEdit = (block: Block) => {
    if (block.type === BlockType.ASSET) {
      setEditingAssetBlock(block as AssetBlock);
      setIsAssetEditModalOpen(true);
    } else if (block.type === BlockType.CONDITION) {
      setEditingConditionBlock(block as ConditionBlock);
      setIsConditionEditModalOpen(true);
    } else if (block.type === BlockType.ACTION) {
      setEditingActionBlock(block as ActionBlock);
      setIsActionEditModalOpen(true);
    }
  };

  // Handle asset block save from edit modal
  const handleAssetBlockSave = (data: AssetBlock['data']) => {
    if (editingAssetBlock) {
      // Editing existing block
      handleBlockUpdate(editingAssetBlock.id, data);
    } else {
      // Creating new block
      const position = strategy ? calculateNewBlockPosition(strategy.blocks) : { x: 400, y: 150 };
      const newBlock: AssetBlock = {
        id: `block-${Date.now()}`,
        type: BlockType.ASSET,
        position,
        size: { width: 200, height: 150 },
        data,
        connections: { inputs: [], outputs: [] },
      };
      addBlock(newBlock);

      // Center viewport on the newly added block
      setTimeout(() => {
        canvasRef.current?.centerOnPosition(position.x + 100, position.y + 75);
      }, 50);
    }

    setIsAssetEditModalOpen(false);
    setEditingAssetBlock(null);
  };

  // Handle condition block save from edit modal
  const handleConditionBlockSave = (data: ConditionBlock['data']) => {
    if (editingConditionBlock) {
      // Editing existing block
      handleBlockUpdate(editingConditionBlock.id, data);
    } else {
      // Creating new block
      const position = strategy ? calculateNewBlockPosition(strategy.blocks) : { x: 400, y: 150 };
      const newBlock: ConditionBlock = {
        id: `block-${Date.now()}`,
        type: BlockType.CONDITION,
        position,
        size: { width: 200, height: 150 },
        data,
        connections: { inputs: [], outputs: [] },
      };
      addBlock(newBlock);

      // Center viewport on the newly added block
      setTimeout(() => {
        canvasRef.current?.centerOnPosition(position.x + 100, position.y + 75);
      }, 50);
    }

    setIsConditionEditModalOpen(false);
    setEditingConditionBlock(null);
  };

  // Handle action block save from edit modal
  const handleActionBlockSave = (data: ActionBlock['data']) => {
    if (editingActionBlock) {
      // Editing existing block
      handleBlockUpdate(editingActionBlock.id, data);
    } else {
      // Creating new block
      const position = strategy ? calculateNewBlockPosition(strategy.blocks) : { x: 400, y: 150 };
      const newBlock: ActionBlock = {
        id: `block-${Date.now()}`,
        type: BlockType.ACTION,
        position,
        size: { width: 200, height: 180 },
        data,
        connections: { inputs: [], outputs: [] },
      };
      addBlock(newBlock);

      // Center viewport on the newly added block
      setTimeout(() => {
        canvasRef.current?.centerOnPosition(position.x + 100, position.y + 90);
      }, 50);
    }

    setIsActionEditModalOpen(false);
    setEditingActionBlock(null);
  };

  // Helper function to calculate position for new block without overlaps
  const calculateNewBlockPosition = (existingBlocks: any[]) => {
    if (existingBlocks.length === 0) {
      return { x: 400, y: 150 };
    }

    // Constants for layout
    const BLOCK_WIDTH = 200;
    const BLOCK_HEIGHT = 150;
    const HORIZONTAL_SPACING = 50;
    const VERTICAL_SPACING = 50;
    const MAX_X = 1200; // Max x before starting new row
    const START_X = 400;
    const START_Y = 150;

    // Find the rightmost and bottommost blocks
    let maxX = 0;
    let maxY = 0;
    let rightmostInRow: any = null;

    existingBlocks.forEach(block => {
      const blockRight = block.position.x + BLOCK_WIDTH;
      const blockBottom = block.position.y + BLOCK_HEIGHT;

      if (blockBottom > maxY) {
        maxY = blockBottom;
      }

      if (blockRight > maxX) {
        maxX = blockRight;
        rightmostInRow = block;
      }
    });

    // Try to place to the right of the rightmost block
    if (rightmostInRow) {
      const newX = rightmostInRow.position.x + BLOCK_WIDTH + HORIZONTAL_SPACING;

      // If it fits in the current row, place it there
      if (newX + BLOCK_WIDTH <= MAX_X) {
        return { x: newX, y: rightmostInRow.position.y };
      }
    }

    // Otherwise, start a new row below
    return { x: START_X, y: maxY + VERTICAL_SPACING };
  };

  const handleBlockAdd = (type: BlockType) => {
    // Open appropriate edit modal based on block type
    if (type === BlockType.ASSET) {
      setIsAssetEditModalOpen(true);
      setEditingAssetBlock(null); // null means creating new, not editing
      return;
    }

    if (type === BlockType.CONDITION) {
      setIsConditionEditModalOpen(true);
      setEditingConditionBlock(null);
      return;
    }

    if (type === BlockType.ACTION) {
      setIsActionEditModalOpen(true);
      setEditingActionBlock(null);
      return;
    }
  };

  const handleAutoLayoutWithZoom = () => {
    autoLayout();
    // Reset zoom after a short delay to allow layout to complete
    setTimeout(() => {
      canvasRef.current?.resetZoom();
    }, 50);
  };

  // Handle strategy save
  const handleStrategySave = async () => {
    if (!strategy) {
      toast({
        title: 'No Strategy',
        description: 'Please create a strategy first',
        variant: 'destructive',
      });
      return;
    }

    // Validate strategy has asset blocks
    const assetBlocks = strategy.blocks.filter(b => b.type === BlockType.ASSET);
    if (assetBlocks.length === 0) {
      toast({
        title: 'Invalid Strategy',
        description: 'Strategy must have at least one asset block',
        variant: 'destructive',
      });
      return;
    }

    // Get chainId from first asset block
    const chainId = (assetBlocks[0] as AssetBlock).data.chainId;

    // Validate all assets are on the same chain
    const allSameChain = assetBlocks.every(
      b => (b as AssetBlock).data.chainId === chainId
    );
    if (!allSameChain) {
      toast({
        title: 'Invalid Strategy',
        description: 'All assets must be on the same chain',
        variant: 'destructive',
      });
      return;
    }

    // Save strategy
    await saveStrategy(strategy, chainId);
  };

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') {
        // Redo: Cmd+Shift+Z or Ctrl+Shift+Z
        e.preventDefault();
        handleRedo();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        // Undo: Cmd+Z or Ctrl+Z
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area with Sidebars */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - AI Agent Panel */}
        {strategy && (
          <div className="hidden lg:block">
            <LeftSidebar
              onChatOpen={() => {
                // Open chat panel
              }}
              onStrategiesOpen={() => {
                // Open strategies modal
              }}
              onDelegationsOpen={() => {
                setIsDelegationModalOpen(true);
              }}
              onActivityOpen={() => {
                // Open activity logs
              }}
            />
          </div>
        )}

        {/* Main Canvas Area */}
        <div
          className={`flex-1 relative ${showAuthModal ? 'pointer-events-none' : ''}`}
          style={{
            overscrollBehaviorX: 'none',
            overscrollBehaviorY: 'none',
            touchAction: 'none',
          }}
        >
          {strategy ? (
          <>
            <Canvas
              ref={canvasRef}
              blocks={strategy.blocks}
              connections={strategy.connections}
              selectedBlockId={selectedBlockId}
              startBlockPos={strategy.startBlockPosition}
              endBlockPos={strategy.endBlockPosition}
              onBlockMove={handleBlockMove}
              onStartBlockMove={handleStartBlockMove}
              onEndBlockMove={handleEndBlockMove}
              onBlockSelect={handleBlockSelect}
              onConnectionCreate={handleConnectionCreate}
              onConnectionDelete={handleConnectionDelete}
              onBlockDelete={handleBlockDelete}
              onBlockEdit={handleBlockEdit}
              activeDelegation={activeDelegation}
              onDelegationClick={async () => {
                // Show wizard for first-time setup or management
                if (!activeDelegation) {
                  // No delegation - start at step 1 (smart-account)
                  // Validate strategy before opening wizard
                  if (!strategy) {
                    toast({
                      title: 'No Strategy',
                      description: 'Please create a strategy first',
                      variant: 'destructive',
                    });
                    return;
                  }

                  const assetBlocks = strategy.blocks.filter(b => b.type === BlockType.ASSET);
                  if (assetBlocks.length === 0) {
                    toast({
                      title: 'Invalid Strategy',
                      description: 'Strategy must have at least one asset block',
                      variant: 'destructive',
                    });
                    return;
                  }

                  const chainId = (assetBlocks[0] as AssetBlock).data.chainId;
                  const allSameChain = assetBlocks.every(
                    b => (b as AssetBlock).data.chainId === chainId
                  );
                  if (!allSameChain) {
                    toast({
                      title: 'Invalid Strategy',
                      description: 'All assets must be on the same chain',
                      variant: 'destructive',
                    });
                    return;
                  }

                  // Open wizard at step 1 (full setup)
                  setWizardInitialStep('smart-account');
                  setIsSetupWizardOpen(true);
                } else {
                  // Delegation exists - jump to step 6 (management)
                  setWizardInitialStep('manage');
                  setIsSetupWizardOpen(true);
                }
              }}
            />

            {/* Floating Toolbar */}
            <FloatingToolbar
              strategy={strategy}
              onBlockAdd={handleBlockAdd}
              onStrategyLoad={setStrategy}
              onStrategySave={handleStrategySave}
              onTemplateLoad={loadTemplate}
              onReset={resetCanvas}
              onAutoLayout={handleAutoLayoutWithZoom}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={canUndo}
              canRedo={canRedo}
              isSaving={saving}
            />

            {/* Floating AI Chat Panel - also blocked when not authenticated */}
            <FloatingChatPanel
              onStrategyGenerated={setStrategy}
              currentStrategy={strategy}
            />

            {/* Floating Workflow Panel */}
            <FloatingWorkflowPanel strategy={strategy} />

            {/* Auth Required Modal - blocks canvas interaction until authenticated */}
            <AnimatePresence mode="wait">
              {showAuthModal && (
                <div key="auth-modal" className="pointer-events-auto">
                  <AuthRequiredModal onComplete={handleAuthComplete} />
                </div>
              )}
            </AnimatePresence>
          </>
        ) : loadingActiveStrategy ? (
          <div className="flex flex-col h-full bg-background relative overflow-hidden">
            {/* Futuristic Grid background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              style={{ zIndex: 0 }}
            >
              <defs>
                <pattern
                  id="landing-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="url(#grid-gradient)"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(174, 100%, 45%)" />
                  <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#landing-grid)" />
            </svg>
            
            {/* Animated glow orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Logo Marquee at the top */}
            <LogoMarquee />

            {/* Loading State */}
            <div className="flex-1 flex flex-col items-center justify-center relative" style={{ zIndex: 1 }}>
              <div className="text-center max-w-lg px-6">
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                <h2 className="text-2xl font-bold gradient-text-teal mb-3">
                  Loading Your Strategy
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We're loading your active strategy onto the canvas...
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-background relative overflow-hidden">
            {/* Futuristic Grid background */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              style={{ zIndex: 0 }}
            >
              <defs>
                <pattern
                  id="welcome-grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="url(#welcome-grid-gradient)"
                    strokeWidth="0.5"
                  />
                </pattern>
                <linearGradient id="welcome-grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(174, 100%, 45%)" />
                  <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#welcome-grid)" />
            </svg>
            
            {/* Animated glow orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Landing Content - centered vertically and horizontally */}
            <div className="flex items-center justify-center h-full relative" style={{ zIndex: 1 }}>
              <div className="text-center max-w-2xl px-6">
                {/* AI Orb */}
                <div className="flex justify-center mb-8">
                  <AIOrb size="lg" isThinking={false} />
                </div>
                
                <h2 className="text-5xl font-bold gradient-text-neon mb-4">
                  Welcome to DeleGator.AI
                </h2>
                <p className="text-xl gradient-text-teal-purple mb-3">
                  The Autonomous Portfolio Command Center
                </p>
                <p className="text-muted-foreground text-sm mb-10 leading-relaxed max-w-xl mx-auto">
                  Build intelligent portfolio strategies with AI-powered automation.
                  Delegate to smart agents and let them execute your vision 24/7.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={resetCanvas}
                    size="lg"
                    className="
                      bg-gradient-to-r from-primary to-accent
                      hover:shadow-teal-glow-lg
                      transition-glow
                      text-background font-semibold
                      px-8 py-6 text-base
                    "
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Start Building
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    className="
                      glass-card border-primary/30
                      hover:border-primary hover:shadow-teal-glow
                      transition-glow
                      px-8 py-6 text-base
                    "
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>

                {/* Feature highlights */}
                <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
                  {[
                    { icon: Brain, label: "AI-Powered", desc: "Natural language strategies" },
                    { icon: Shield, label: "Secure", desc: "ERC-7710 delegations" },
                    { icon: Zap, label: "Automated", desc: "24/7 execution" },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="glass-card p-4 rounded-xl hover:shadow-teal-glow transition-glow"
                    >
                      <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-teal-glow">
                        <feature.icon className="w-5 h-5 text-background" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {feature.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {feature.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Asset Block Edit Modal */}
        <AssetBlockEditModal
          open={isAssetEditModalOpen}
          onOpenChange={setIsAssetEditModalOpen}
          blockData={editingAssetBlock?.data}
          onSave={handleAssetBlockSave}
        />

        {/* Condition Block Edit Modal */}
        <ConditionBlockEditModal
          open={isConditionEditModalOpen}
          onOpenChange={setIsConditionEditModalOpen}
          blockData={editingConditionBlock?.data}
          onSave={handleConditionBlockSave}
        />

        {/* Action Block Edit Modal */}
        <ActionBlockEditModal
          open={isActionEditModalOpen}
          onOpenChange={setIsActionEditModalOpen}
          blockData={editingActionBlock?.data}
          onSave={handleActionBlockSave}
        />

        {/* Delegation Manager Modal */}
        <DelegationManagerModal
          open={isDelegationModalOpen}
          onOpenChange={setIsDelegationModalOpen}
        />

        {/* Strategy Setup Wizard */}
        <StrategySetupWizard
          open={isSetupWizardOpen}
          onOpenChange={setIsSetupWizardOpen}
          strategy={strategy}
          chainId={strategy?.blocks.find(b => b.type === BlockType.ASSET)?.data.chainId || strategyChainId || 10143}
          initialStep={wizardInitialStep}
          initialDelegatorAddress={activeDelegation?.delegationData.delegator}
          onComplete={async () => {
            // Refresh delegations to show new delegation on START block
            await refreshDelegations();
            // Show success toast
            toast({
              title: 'Setup Complete!',
              description: 'Your strategy is now active and delegated to the bot.',
            });
          }}
        />
        </div>

        {/* Right Sidebar - Strategy Insights */}
        {strategy && (
          <div className="hidden xl:block">
            <RightSidebar
              onSimulate={() => {
                toast({
                  title: 'Simulating Strategy',
                  description: 'Running virtual test of your strategy...',
                });
              }}
              onDeploy={handleStrategySave}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
