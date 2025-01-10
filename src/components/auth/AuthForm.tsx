import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../providers/AuthProvider';
import { AuthHeader } from './AuthHeader';
import { EmailInput } from './inputs/EmailInput';
import { PasswordInput } from './inputs/PasswordInput';
import { SubmitButton } from './buttons/SubmitButton';
import { ToggleAuthMode } from './buttons/ToggleAuthMode';
import { useToastContext } from '../../providers/ToastProvider';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  
  const { signIn, signUp } = useAuth();
  const { showToast } = useToastContext();

  useEffect(() => {
    // Check if we're in PWA mode and have stored credentials
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (isPWA) {
      const storedAuthState = localStorage.getItem('authState');
      if (storedAuthState) {
        const { isAuthenticated, timestamp } = JSON.parse(storedAuthState);
        const hoursSinceAuth = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        // If authenticated less than 24 hours ago, try to restore session
        if (isAuthenticated && hoursSinceAuth < 24) {
          const storedEmail = localStorage.getItem('lastEmail');
          if (storedEmail) {
            setEmail(storedEmail);
          }
        }
      }
    }
    setIsRestoring(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        // Store email for PWA persistence
        localStorage.setItem('lastEmail', email);
        showToast('Welcome back!');
      } else {
        await signUp(email, password);
        localStorage.setItem('lastEmail', email);
        showToast('Account created successfully!');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (isRestoring) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
          <AuthHeader isLogin={isLogin} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <EmailInput 
              value={email}
              onChange={setEmail}
            />

            <PasswordInput 
              value={password}
              onChange={setPassword}
            />

            <SubmitButton 
              loading={loading}
              isLogin={isLogin}
            />
          </form>

          <ToggleAuthMode 
            isLogin={isLogin}
            onToggle={() => setIsLogin(!isLogin)}
          />
        </div>
      </motion.div>
    </div>
  );
}
