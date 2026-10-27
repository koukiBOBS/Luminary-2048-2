import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in 2048 app:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('luminary2048-theme');
      localStorage.removeItem('luminary2048-lang');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf8ef',
          fontFamily: "'Nunito', system-ui, sans-serif",
          padding: '24px',
          color: '#776e65',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '28px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 12px 0', color: '#e53e3e' }}>
              Oops!
            </h1>
            <p style={{ fontSize: '15px', lineHeight: 1.6, margin: '0 0 16px 0', color: '#4a5568' }}>
              游戏运行遇到异常错误。请尝试刷新或重置缓存恢复。
            </p>
            {this.state.error && (
              <pre style={{
                textAlign: 'left',
                backgroundColor: '#edf2f7',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '11px',
                overflowX: 'auto',
                marginBottom: '20px',
                color: '#2d3748'
              }}>
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#8f7a66',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                刷新重试
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#cbd5e0',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                清除缓存重置
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);