import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout, ProtectedRoute } from "../components";
import { ForgotPassword, OAuthCallback, ResetPassword } from "../pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import("../pages");
          return { Component: Home };
        },
      },
      {
        path: "explore",
        lazy: async () => {
          const { Explore } = await import("../pages");
          return { Component: Explore };
        },
      },
      {
        path: "recipes/:id",
        lazy: async () => {
          const { RecipeDetails } = await import("../pages");
          return { Component: RecipeDetails };
        },
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            lazy: async () => {
              const { Profile } = await import("../pages");
              return { Component: Profile };
            },
          },
          {
            path: "profile/:id",
            lazy: async () => {
              const { Profile } = await import("../pages");
              return { Component: Profile };
            },
          },
          {
            path: "create",
            lazy: async () => {
              const { CreateRecipe } = await import("../pages");
              return { Component: CreateRecipe };
            },
          },
        ],
      },
      {
        path: "about",
        lazy: async () => {
          const { About } = await import("../pages");
          return { Component: About };
        },
      },
      {
        path: "contact",
        lazy: async () => {
          const { Contact } = await import("../pages");
          return { Component: Contact };
        },
      },
      {
        path: "signin",
        lazy: async () => {
          const { SignIn } = await import("../pages");
          return { Component: SignIn };
        },
      },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "oauth/callback", element: <OAuthCallback /> },
      {
        path: "verify-email",
        lazy: async () => {
          const { VerifyEmail } = await import("../pages");
          return { Component: VerifyEmail };
        },
      },
    ],
  },
  { path: "*", element: <Navigate to={"/"} replace /> },
]);
