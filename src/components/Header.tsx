import React from "react";
import { motion } from "framer-motion";
import { Calculator, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-persian text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white p-2.5 rounded-xl shadow">
              <Calculator className="w-6 h-6 text-persian" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-saffron via-sandy to-sienna bg-clip-text text-transparent">BillWise</h1>
              <p className="text-sm text-white/80">
                Effortless expense sharing and smart debt optimization
              </p>
            </div>
          </motion.div>

          {user && (
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center space-x-3">
                {(user as any)?.user_metadata?.avatar_url ? (
                  <img
                    src={(user as any).user_metadata.avatar_url}
                    alt={(user as any).user_metadata.full_name || user.email}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-surface">
                    {(user as any).user_metadata?.full_name || user.email}
                  </div>
                  <div className="text-xs text-white/80">{user.email}</div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="p-2 text-surface hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};
