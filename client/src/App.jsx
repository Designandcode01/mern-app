import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";

function Layout() {
  return (
    <>
      {/* <Navbar /> */}
      <Outlet />
    </>
  );
}
// doe5
// doe5@example.com
// Password125

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/product/:id", element: <ProductDetails /> },
      
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
  }
