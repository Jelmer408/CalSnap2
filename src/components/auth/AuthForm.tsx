import { useState } from 'react';
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
  
  const { signIn, signUp } = useAuth();
  const { showToast } = useToastContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        showToast('Welcome back!');
      } else {
        await signUp(email, password);
        showToast('Account created successfully!');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

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
