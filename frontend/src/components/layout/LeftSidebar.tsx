import { motion } from "framer-motion";
import {
  MessageSquare,
  Layers,
  Users,
  Activity,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";
import { AIOrb } from "../ai/AIOrb";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface LeftSidebarProps {
  onChatOpen?: () => void;
  onStrategiesOpen?: () => void;
  onDelegationsOpen?: () => void;
  onActivityOpen?: () => void;
}

export const LeftSidebar = ({
  onChatOpen,
  onStrategiesOpen,
  onDelegationsOpen,
  onActivityOpen,
}: LeftSidebarProps) => {
  const menuItems = [
    {
      icon: MessageSquare,
      label: "Talk to DeleGator",
      description: "AI Assistant",
      gradient: "from-primary to-blue-500",
      onClick: onChatOpen,
    },
    {
      icon: Layers,
      label: "Strategies",
      description: "Templates & Custom",
      gradient: "from-accent to-pink-500",
      onClick: onStrategiesOpen,
    },
    {
      icon: Users,
      label: "Delegations",
      description: "Active Agents",
      gradient: "from-blue-500 to-primary",
      onClick: onDelegationsOpen,
    },
    {
      icon: Activity,
      label: "Activity Logs",
      description: "Transaction History",
      gradient: "from-green-500 to-emerald-500",
      onClick: onActivityOpen,
    },
  ];

  const quickActions = [
    { icon: TrendingUp, label: "Rebalance Portfolio", color: "text-primary" },
    { icon: Shield, label: "Risk Analysis", color: "text-accent" },
    { icon: Zap, label: "Quick Deploy", color: "text-blue-500" },
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-80 glass-heavy border-r border-primary/20 flex flex-col relative overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header with AI Orb */}
      <div className="p-6 border-b border-primary/20 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <AIOrb size="md" isThinking={false} />
          <div className="text-center">
            <h2 className="text-lg font-bold gradient-text-teal">
              AI Agent Panel
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your autonomous portfolio assistant
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <ScrollArea className="flex-1 p-4 relative z-10">
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-4 glass-card hover:shadow-teal-glow transition-glow group"
                onClick={item.onClick}
              >
                <div className="flex items-start gap-3 w-full">
                  {/* Icon with gradient background */}
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 shadow-teal-glow group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5 text-background" />
                  </div>
                  
                  {/* Text content */}
                  <div className="flex flex-col items-start text-left flex-1">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                  />
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3 px-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Quick Actions
            </h3>
          </div>
          
          <div className="space-y-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-primary/10 transition-glow"
                >
                  <action.icon className={`w-4 h-4 mr-2 ${action.color}`} />
                  <span className="text-xs">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integrations Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 p-4 glass-card rounded-xl border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">
              Live Integrations
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Envio", "Monad", "MetaMask", "Pyth"].map((integration) => (
              <span
                key={integration}
                className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {integration}
              </span>
            ))}
          </div>
        </motion.div>
      </ScrollArea>

      {/* Bottom Status Bar */}
      <div className="p-4 border-t border-primary/20 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">System Online</span>
          </div>
          <span className="text-muted-foreground">v2.0.0</span>
        </div>
      </div>
    </motion.div>
  );
};
