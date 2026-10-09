import { Analytics } from "@vercel/analytics/next"
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ReactLenis } from 'lenis/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '2rem', background: '#000', height: '100vh', zIndex: 99999, position: 'fixed', top: 0, left: 0, width: '100vw' }}>
          <h2>React Error Caught:</h2>
          <pre>{this.state.error.toString()}</pre>
          <pre style={{ color: '#ffaaaa' }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
        <App />
      </ReactLenis>
    </ErrorBoundary>
  </StrictMode>,
)
