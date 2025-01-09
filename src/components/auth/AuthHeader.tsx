interface AuthHeaderProps {
  isLogin: boolean;
}

export function AuthHeader({ isLogin }: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-gray-400">
        {isLogin 
          ? 'Sign in to continue tracking your progress'
          : 'Join us to start your fitness journey'
        }
      </p>
    </div>
  );
}
