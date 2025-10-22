import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AIOrb } from "./AIOrb";
import { TrendingUp, DollarSign, Target, Zap, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface StrategyNode {
  id: string;
  type: "rebalance" | "buy" | "sell" | "condition";
  label: string;
  description: string;
  icon: any;
  position: { x: number; y: number };
  connections: string[];
}

interface AICanvasProps {
  onStrategyGenerated?: (nodes: StrategyNode[]) => void;
}

export const AICanvas = ({ onStrategyGenerated }: AICanvasProps) => {
  const [isThinking, setIsThinking] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [strategyNodes, setStrategyNodes] = useState<StrategyNode[]>([]);
  const [showNodes, setShowNodes] = useState(false);

  const handleGenerateStrategy = async () => {
    if (!userInput.trim()) return;

    setIsThinking(true);
    setShowNodes(false);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate example strategy nodes
    const nodes: StrategyNode[] = [
      {
        id: "node-1",
        type: "rebalance",
        label: "Rebalance Weekly",
        description: "Auto-rebalance portfolio every 7 days",
        icon: TrendingUp,
        position: { x: 200, y: 150 },
        connections: ["node-2"],
      },
      {
        id: "node-2",
        type: "buy",
        label: "Buy ETH on Dip",
        description: "Buy when price drops 10%",
        icon: DollarSign,
        position: { x: 450, y: 100 },
        connections: ["node-3"],
      },
      {
        id: "node-3",
        type: "sell",
        label: "Take Profit",
        description: "Sell at +25% gain",
        icon: Target,
        position: { x: 700, y: 150 },
        connections: [],
      },
    ];

    setStrategyNodes(nodes);
    setIsThinking(false);
    setShowNodes(true);
    onStrategyGenerated?.(nodes);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="ai-grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-grid)" />
        </svg>
      </div>

      {/* Central AI Agent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <AIOrb size="lg" isThinking={isThinking} />
        
        {!showNodes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <h3 className="text-xl font-bold gradient-text-teal mb-2">
              DeleGator Agent
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Tell me how you want to automate your portfolio
            </p>

            {/* Command Input */}
            <div className="flex gap-2 max-w-lg mx-auto">
              <Input
                placeholder="e.g., Rebalance my USDC portfolio weekly..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateStrategy()}
                className="glass-card border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleGenerateStrategy}
                disabled={isThinking || !userInput.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:shadow-teal-glow-lg transition-glow"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Strategy Nodes */}
      <AnimatePresence>
        {showNodes && strategyNodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.2, type: "spring" }}
            className="absolute glass-card p-4 rounded-xl shadow-teal-glow cursor-move hover:shadow-teal-glow-lg transition-glow group"
            style={{
              left: node.position.x,
              top: node.position.y,
              width: 200,
            }}
            drag
            dragMomentum={false}
          >
            {/* Node Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 shadow-teal-glow group-hover:scale-110 transition-transform">
              <node.icon className="w-5 h-5 text-background" />
            </div>

            {/* Node Content */}
            <h4 className="text-sm font-bold text-foreground mb-1">
              {node.label}
            </h4>
            <p className="text-xs text-muted-foreground">
              {node.description}
            </p>

            {/* Edit indicator */}
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 animate-pulse" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Connections between nodes */}
      {showNodes && (
        <svg className="absolute inset-0 pointer-events-none">
          {strategyNodes.map((node) =>
            node.connections.map((targetId) => {
              const target = strategyNodes.find((n) => n.id === targetId);
              if (!target) return null;

              return (
                <motion.line
                  key={`${node.id}-${targetId}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  x1={node.position.x + 200}
                  y1={node.position.y + 50}
                  x2={target.position.x}
                  y2={target.position.y + 50}
                  stroke="url(#line-gradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
              );
            })
          )}
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(174, 100%, 45%)" />
              <stop offset="100%" stopColor="hsl(270, 80%, 60%)" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Thinking Animation */}
      {isThinking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20"
        >
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent shadow-neon-glow"
            />
            <p className="text-lg font-semibold gradient-text-teal">
              AI is thinking...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing your strategy requirements
            </p>
          </div>
        </motion.div>
      )}

      {/* Strategy Actions (when nodes are shown) */}
      {showNodes && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3"
        >
          <Button
            variant="outline"
            className="glass-card border-primary/30 hover:border-primary"
            onClick={() => {
              setShowNodes(false);
              setStrategyNodes([]);
              setUserInput("");
            }}
          >
            Reset
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-teal-glow-lg transition-glow">
            Deploy Strategy
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};
