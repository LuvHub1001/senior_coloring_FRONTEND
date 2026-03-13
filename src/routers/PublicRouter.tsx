import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components";

const LoginPage = lazy(() =>
  import("@/pages/login/LoginPage.tsx").then((module) => ({
    default: module.LoginPage,
  }))
);

const HomePage = lazy(() =>
  import("@/pages/home/HomePage.tsx").then((module) => ({
    default: module.HomePage,
  }))
);

const ColoringBookPage = lazy(() =>
  import("@/pages/coloring/ColoringBookPage.tsx").then((module) => ({
    default: module.ColoringBookPage,
  }))
);

const ColoringPlayPage = lazy(() =>
  import("@/pages/coloringPlay/ColoringPlayPage.tsx").then((module) => ({
    default: module.ColoringPlayPage,
  }))
);

const CompletionPage = lazy(() =>
  import("@/pages/completion/CompletionPage.tsx").then((module) => ({
    default: module.CompletionPage,
  }))
);

const AuthCallbackPage = lazy(() =>
  import("@/pages/auth/AuthCallbackPage.tsx").then((module) => ({
    default: module.AuthCallbackPage,
  }))
);

function PublicRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/coloring" element={<ColoringBookPage />} />
          <Route path="/coloring/:id" element={<ColoringPlayPage />} />
          <Route path="/coloring/:id/complete" element={<CompletionPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { PublicRouter };
