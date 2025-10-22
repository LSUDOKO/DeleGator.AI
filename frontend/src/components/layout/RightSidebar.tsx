import { motion } from "framer-motion";
import {
  TrendingUp,
  Shield,
  Fuel,
  Play,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";

interface RightSidebarProps {
  onSimulate?: () => void;
  onDeploy?: () => void;
}

export const RightSidebar = ({ onSimulate, onDeploy }: RightSidebarProps) => {
  // Mock data - replace with real data
  const insights = {
    estimatedYield: 12.5,
    riskScore: 65,
    gasEstimate: 0.0042,
    successRate: 94,
  };

  const metrics = [
    {
      icon: TrendingUp,
      label: "Estimated Yield",
      value: `${insights.estimatedYield}%`,
      color: "text-green-500",
      bgColor: "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Shield,
      label: "Risk Score",
      value: `${insights.riskScore}/100`,
      color: insights.riskScore > 70 ? "text-yellow-500" : "text-green-500",
      bgColor: insights.riskScore > 70 ? "from-yellow-500/20 to-orange-500/20" : "from-green-500/20 to-emerald-500/20",
    },
    {
      icon: Fuel,
      label: "Gas Cost",
      value: `${insights.gasEstimate} ETH`,
      color: "text-blue-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: CheckCircle,
      label: "Success Rate",
      value: `${insights.successRate}%`,
      color: "text-primary",
      bgColor: "from-primary/20 to-accent/20",
    },
  ];

  const performanceData = [
    { label: "1D", value: "+2.3%" },
    { label: "1W", value: "+8.7%" },
    { label: "1M", value: "+15.2%" },
    { label: "3M", value: "+42.1%" },
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-96 glass-heavy border-l border-primary/20 flex flex-col relative overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-accent/5 opacity-50" />

      {/* Header */}
      <div className="p-6 border-b border-primary/20 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-teal-glow">
            <BarChart3 className="w-5 h-5 text-background" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text-teal">
              Strategy Insights
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time analysis
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6 relative z-10">
        {/* Key Metrics */}
        <div className="space-y-4 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 rounded-xl hover:shadow-teal-glow transition-glow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${metric.bgColor} flex items-center justify-center`}>
                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className={`text-xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress bar for risk score */}
              {metric.label === "Risk Score" && (
                <Progress 
                  value={insights.riskScore} 
                  className="h-2 bg-muted"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Performance Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Expected Performance
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {performanceData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                className="glass-card p-3 rounded-lg text-center hover:shadow-teal-glow transition-glow"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-green-500">
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Analysis */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-4 rounded-xl mb-8"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Risk Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Diversified Portfolio
                </p>
                <p className="text-xs text-muted-foreground">
                  Assets spread across 3+ tokens
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Automated Rebalancing
                </p>
                <p className="text-xs text-muted-foreground">
                  Maintains target allocation
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">
                  Market Volatility
                </p>
                <p className="text-xs text-muted-foreground">
                  Consider stop-loss conditions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gas Optimization */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="glass-card p-4 rounded-xl border border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-foreground">
              Gas Optimization
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Estimated gas cost is 23% lower than average
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network:</span>
            <span className="text-primary font-medium">Monad Testnet</span>
          </div>
        </motion.div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="p-6 border-t border-primary/20 space-y-3 relative z-10">
        <Button
          variant="outline"
          className="w-full glass-card border-primary/30 hover:border-primary hover:shadow-teal-glow transition-glow"
          onClick={onSimulate}
        >
          <Play className="w-4 h-4 mr-2" />
          Simulate Strategy
        </Button>
        
        <Button
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-teal-glow-lg transition-glow text-background font-semibold"
          onClick={onDeploy}
        >
          <Zap className="w-4 h-4 mr-2" />
          Delegate to MetaMask Smart Account
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Strategy will be deployed to your smart account
        </p>
      </div>
    </motion.div>
  );
};
