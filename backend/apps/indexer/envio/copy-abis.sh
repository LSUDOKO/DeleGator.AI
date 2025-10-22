#!/bin/bash

# Copy contract ABIs from Foundry output to Envio abis directory

set -e

echo "📋 Copying contract ABIs..."

# Create abis directory
mkdir -p abis

# Source directory (relative to envio folder)
CONTRACT_OUT="../../../../contract/out"

# Check if contracts are built
if [ ! -d "$CONTRACT_OUT" ]; then
    echo "❌ Contract output directory not found: $CONTRACT_OUT"
    echo ""
    echo "Building contracts first..."
    cd ../../../../contract
    forge build
    cd -
    echo "✅ Contracts built"
fi

# Check if ABI files exist
if [ ! -f "$CONTRACT_OUT/StrategyRegistry.sol/StrategyRegistry.json" ]; then
    echo "❌ Contract ABIs not found. Building contracts..."
    cd ../../../../contract
    forge build
    cd -
fi

# Copy ABIs
echo "Copying ABIs..."
cp "$CONTRACT_OUT/StrategyRegistry.sol/StrategyRegistry.json" abis/StrategyRegistry.json
cp "$CONTRACT_OUT/DelegationManager.sol/DelegationManager.json" abis/DelegationManager.json
cp "$CONTRACT_OUT/RebalanceExecutor.sol/RebalanceExecutor.json" abis/RebalanceExecutor.json
cp "$CONTRACT_OUT/PythOracle.sol/PythOracle.json" abis/PythOracle.json
cp "$CONTRACT_OUT/UniswapHelper.sol/UniswapHelper.json" abis/UniswapHelper.json

echo "✅ ABIs copied successfully!"
echo ""
echo "Files created:"
ls -lh abis/
