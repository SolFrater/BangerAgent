import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="mb-6 text-6xl opacity-20">⚠️</div>
            <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Oops!</h1>
            <p className="text-zinc-400 mb-6 text-sm">
              Something went wrong. Please refresh the page or contact support if the problem persists.
            </p>
            <details className="mb-6 text-left text-xs text-zinc-600">
              <summary className="cursor-pointer font-bold hover:text-zinc-400 mb-2">Error Details</summary>
              <pre className="bg-zinc-900/50 p-3 rounded overflow-auto border border-white/10">
                {this.state.error?.message}
              </pre>
            </details>
            <button
              onClick={this.reset}
              className="px-6 py-3 bg-white text-black rounded-lg font-black text-sm uppercase tracking-wider hover:bg-zinc-200 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
