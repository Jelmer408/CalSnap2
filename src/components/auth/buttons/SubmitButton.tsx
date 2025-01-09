import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
  isLogin: boolean;
}

export function SubmitButton({ loading, isLogin }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500 text-white rounded-lg py-2 font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        isLogin ? 'Sign In' : 'Sign Up'
      )}
    </button>
  );
}
