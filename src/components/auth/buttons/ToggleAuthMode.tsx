interface ToggleAuthModeProps {
  isLogin: boolean;
  onToggle: () => void;
}

export function ToggleAuthMode({ isLogin, onToggle }: ToggleAuthModeProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full mt-4 text-sm text-gray-400 hover:text-gray-300 transition-colors"
    >
      {isLogin 
        ? "Don't have an account? Sign up" 
        : 'Already have an account? Sign in'
      }
    </button>
  );
}
