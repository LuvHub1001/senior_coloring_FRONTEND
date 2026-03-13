import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#F3F5F7] px-5">
          <p className="text-[19px] font-bold text-[#191F28]">
            문제가 발생했습니다
          </p>
          <p className="text-center text-[15px] text-[#6B7684]">
            잠시 후 다시 시도해 주세요
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="mt-2 rounded-xl bg-[#191F28] px-6 py-3 text-[15px] font-semibold text-white"
          >
            새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
