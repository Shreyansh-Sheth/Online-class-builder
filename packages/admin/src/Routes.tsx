import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavbarWrapper from "./component/navbar";
import Auth from "./pages/auth";
import StoreFront from "./pages/storefront";
import Users from "./pages/user";
export default function Router() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "/dashboard",
      element: <NavbarWrapper />,
      children: [
        {
          index: true,
          element: <Users />,
        },
        {
          path: "storefront",
          element: <StoreFront />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}
