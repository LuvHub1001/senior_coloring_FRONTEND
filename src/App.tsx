import "./App.css";
import { PublicRouter } from "@/routers";
import { ErrorBoundary, ErrorToast } from "@/components";
import { useErrorToast } from "@/hooks";

function App() {
  const { isErrorVisible, errorMessage } = useErrorToast();

  return (
    <ErrorBoundary>
      <PublicRouter />
      <ErrorToast
        isVisible={isErrorVisible}
        message={errorMessage ?? ""}
      />
    </ErrorBoundary>
  );
}

export default App;
