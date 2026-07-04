'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} retry={this.retry} />
      }

      return <DefaultErrorFallback error={this.state.error} retry={this.retry} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-accent-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-accent-orange" />
        </div>
        
        <h1 className="font-serif text-3xl font-light text-brown-dark mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-brown/70 mb-6">
          We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
        </p>
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <summary className="font-medium text-red-800 cursor-pointer">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 bg-brown-dark text-ivory px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-brown transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center gap-2 border border-brown-dark text-brown-dark px-6 py-3 text-sm font-medium uppercase tracking-wider hover:bg-brown-dark hover:text-ivory transition-colors"
          >
            Go Home
          </button>
        </div>
        
        <p className="text-xs text-brown/50 mt-6">
          If you continue to experience issues, please contact{' '}
          <a href="mailto:support@amapels.com" className="underline">
            support@amapels.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default ErrorBoundary