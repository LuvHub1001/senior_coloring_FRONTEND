import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function PublicRouter() {
  return (
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export { PublicRouter };
