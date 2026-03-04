import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const LoginPage = lazy(() =>
  import("@/pages/login/LoginPage.tsx").then((module) => ({
    default: module.LoginPage,
  }))
);

function PublicRouter() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { PublicRouter };
