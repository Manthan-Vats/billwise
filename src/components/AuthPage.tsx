import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Users, TrendingUp, Shield, Zap, Globe, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle } = useAuth();

  const handleGoogleAuth = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign-in';
      if (errorMessage === 'Supabase not configured') {
        setError('Authentication is not configured. Please set up Supabase credentials to enable sign-in.');
      } else {
        setError(errorMessage);
      }
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Smart Group Management',
      description: 'Create and join groups with unique codes. Manage members effortlessly.',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Track spending patterns, category breakdowns, and budget insights.',
    },
    {
      icon: Zap,
      title: 'Debt Optimization',
      description: 'AI-powered debt simplification minimizes transactions needed.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely.',
    },
  ];

  return (
    <div className="min-h-screen bg-radial-cream flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-saffron via-sandy to-persian bg-clip-text text-transparent">
              BillWise
            </h1>
          </div>

          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Split expenses like a pro
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            The smartest way to manage group expenses with AI-powered debt optimization and beautiful analytics.
          </p>

          <div className="space-y-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-saffron via-sandy to-persian bg-clip-text text-transparent">
                BillWise
              </h1>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {isLogin ? 'Welcome back!' : 'Get started today'}
              </h2>
              <p className="text-slate-600">
                {isLogin 
                  ? 'Sign in to manage your group expenses' 
                  : 'Create an account to start splitting expenses'
                }
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Sign-in Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Google Auth Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleAuth}
              className="w-full bg-white border-2 border-persian hover:border-persian/80 text-slate-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md focus:border-persian focus:ring-2 focus:ring-persian/30"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="w-5 h-5"
              />
              <span>Continue with Google</span>
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>Global</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};