import { ErrorScreen } from '@ProcarefulApp/components/ErrorBoundary/components';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  isError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { isError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { isError: true };
  }

  public render(): ReactNode {
    if (this.state.isError) {
      return <ErrorScreen />;
    }

    return <>{this.props.children}</>;
  }
}
