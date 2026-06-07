import { Component } from 'react';
import { useTranslation } from '../context/LanguageContext';

function ErrorBoundaryFallback({ error, onReset }) {
  const t = useTranslation();
  const message = error?.message || t('error.boundaryGeneric');
  return (
    <div role="alert" className="error-boundary">
      <div className="error-boundary-card">
        <h1>{t('error.boundaryTitle')}</h1>
        <p className="error-boundary-message">{message}</p>
        <p className="error-boundary-hint">{t('error.boundaryHint')}</p>
        <div className="error-boundary-actions">
          <button type="button" className="btn btn-primary" onClick={onReset}>
            {t('error.boundaryTry')}
          </button>
          <a className="btn btn-outline" href="/">
            {t('error.boundaryHome')}
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
          >
            {t('error.boundaryReload')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, errorInfo);
    } else if (typeof console !== 'undefined') {
      console.error('[ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof this.props.onReset === 'function') this.props.onReset();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <>
        <ErrorBoundaryFallback error={this.state.error} onReset={this.handleReset} />
        {import.meta.env.DEV && this.state.errorInfo?.componentStack && (
          <details className="error-boundary-stack">
            <summary>
              <ErrorBoundaryStackLabel />
            </summary>
            <pre>{this.state.errorInfo.componentStack}</pre>
          </details>
        )}
      </>
    );
  }
}

function ErrorBoundaryStackLabel() {
  const t = useTranslation();
  return <>{t('error.boundaryStack')}</>;
}
