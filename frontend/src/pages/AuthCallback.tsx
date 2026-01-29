import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we have a session
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          // Successfully authenticated, redirect to home
          navigate('/', { replace: true });
        } else {
          // No session, redirect to home
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/', { replace: true });
      }
    };

    // Add a small delay to ensure session is established
    const timer = setTimeout(handleCallback, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <p className="text-white text-lg font-medium">Authenticating with X...</p>
        <p className="text-gray-400 text-sm mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
