import { usePrivy } from '@privy-io/react-auth';
import { LoginButton } from '../wallet/LoginButton';
import { WalletInfo } from '../wallet/WalletInfo';
import { NetworkSwitcher } from '../wallet/NetworkSwitcher';
import { Brain, Menu, Settings, History, HelpCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

/**
 * DeleGator.AI Futuristic Navbar
 *
 * Top navigation bar with:
 * - Animated DeleGator.AI logo
 * - Network switcher
 * - User menu
 * - Wallet connection
 */
export function Navbar() {
  const { authenticated } = usePrivy();

  return (
    <nav className="glass-heavy border-b border-primary/20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50" />
      
      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with circuit animation */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-accent opacity-50 blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Logo container */}
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-teal-glow">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Brain className="w-6 h-6 text-background" />
                </motion.div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text-teal-purple tracking-tight">
                DeleGator.AI
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Autonomous Command Center
              </span>
            </div>
          </motion.div>

          {/* Right side: Network switcher + User menu + Wallet */}
          <div className="flex items-center gap-4">
            {authenticated && (
              <>
                <NetworkSwitcher />
                
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative rounded-lg hover:bg-primary/10 transition-glow"
                    >
                      <User className="w-5 h-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-heavy w-56">
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                      <Settings className="w-4 h-4 mr-2 text-primary" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                      <History className="w-4 h-4 mr-2 text-primary" />
                      <span>Activity Logs</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem className="cursor-pointer hover:bg-primary/10">
                      <HelpCircle className="w-4 h-4 mr-2 text-primary" />
                      <span>Help & Docs</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Show either login button or wallet info */}
            {authenticated ? <WalletInfo /> : <LoginButton />}
          </div>
        </div>
      </div>
    </nav>
  );
}
