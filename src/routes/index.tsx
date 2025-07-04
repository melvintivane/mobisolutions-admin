import BlogPosts from "@/pages/(admin)/blog/page";
import VacancyEdit from "@/pages/(admin)/blogPosts/edit/page";
import { lazy } from "react";
import { Navigate, type RouteProps } from "react-router-dom";



// Lazy-loaded components for routes
const VacanciesList = lazy(() => import("@/pages/(admin)/blogPosts/list/page"));
const VacanciesCreate = lazy(() => import("@/pages/(admin)/blogPosts/create/page"));
const VacancyDetails = lazy(() => import("@/pages/(admin)/blogPosts/details/page"));

// Dashboard Routes
const Analytics = lazy(() => import("@/pages/(admin)/dashboard/analytics/page"));

// Pages Routes
const Maintenance = lazy(() => import("@/pages/(other)/maintenance/page"));


// Not Found Routes
const NotFoundAdmin = lazy(() => import("@/pages/(admin)/not-found"));
const NotFound = lazy(() => import("@/pages/(other)/(error-pages)/error-404/page"));

// Auth Routes
const AuthSignIn2 = lazy(() => import("@/pages/(other)/auth/sign-in-2/page"));
const ResetPassword2 = lazy(() => import("@/pages/(other)/auth/reset-pass-2/page"));
const LockScreen2 = lazy(() => import("@/pages/(other)/auth/lock-screen-2/page"));

export type RoutesProps = {
  path: RouteProps["path"];
  name: string;
  element: RouteProps["element"];
  exact?: boolean;
};

const initialRoutes: RoutesProps[] = [
  {
    path: "/",
    name: "root",
    element: <Navigate to="/dashboard/analytics" />,
  },
];

const generalRoutes: RoutesProps[] = [
  {
    path: "/dashboard/analytics",
    name: "Analytics",
    element: <Analytics />,
  },
];

const appsRoutes: RoutesProps[] = [
  {
    name: "Blog Posts",
    path: "/blogs",
    element: <BlogPosts />,
  },
  {
    name: "Vacancies List",
    path: "/vacancies",
    element: <VacanciesList />,
  },
  {
    name: "Vacancy Create",
    path: "/vacancies/create",
    element: <VacanciesCreate />,
  },
  {
    name: "Vacancy Details",
    path: "/vacancies/:vacancyId",
    element: <VacancyDetails />,
  },
  {
    name: "Vacancy Edit",
    path: "/vacancies/edit/:vacancyId",
    element: <VacancyEdit />,
  }
];

const customRoutes: RoutesProps[] = [
  {
    name: "Error 404 Alt",
    path: "/pages/error-404-alt",
    element: <NotFoundAdmin />,
  },
];

export const authRoutes: RoutesProps[] = [
  {
    name: "Sign In",
    path: "/auth/sign-in",
    element: <AuthSignIn2 />,
  },
  {
    name: "Reset Password",
    path: "/auth/reset-pass",
    element: <ResetPassword2 />,
  },
  {
    name: "Lock Screen",
    path: "/auth/lock-screen",
    element: <LockScreen2 />,
  },
  {
    name: "404 Error",
    path: "/error-404",
    element: <NotFound />,
  },
  {
    path: "*",
    name: "not-found",
    element: <NotFound />,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    element: <Maintenance />,
  }
];

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...appsRoutes,
  ...customRoutes,
  ...authRoutes,
];
