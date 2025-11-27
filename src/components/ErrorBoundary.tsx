import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Отправить на сервер логирование ошибки
    if (window.Telegram?.WebApp?.initData) {
      console.error('Error context:', { error: error.toString(), stack: error.stack });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-1">Что-то пошло не так</h2>
                  <p className="text-sm text-muted-foreground">
                    Приложение столкнулось с неожиданной ошибкой
                  </p>
                </div>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="w-full bg-muted p-3 rounded text-left max-h-32 overflow-y-auto">
                    <p className="text-xs font-mono text-destructive break-words">
                      {this.state.error.message}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                  <Button onClick={this.handleReset} className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Повторить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                    className="w-full"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    На главную
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
