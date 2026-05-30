import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../components";

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
      {
        path: "my-recipes",
        lazy: async () => {
          const { MyRecipes } = await import("../pages");
          return { Component: MyRecipes };
        },
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
    ],
  },
]);
