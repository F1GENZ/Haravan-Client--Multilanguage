import Metafields from "../pages/metafields/index";  
import Settings from "../pages/settings/index";
import Introduction from "../pages/introduction/index";
import UserGuide from "../pages/guide/index";
import Support from "../pages/support/index";
import Login from "../pages/auth/login/index";
import GrandService from "../pages/auth/grandservice/index";
import Products from "../pages/products/index";
import NotFound from "../pages/404/index";

export const routes = [
  {
    path: "/",
    layout: false,
    isPrivate: false,
    page: <Introduction />,
  },
  {
    path: "/products",
    layout: false,
    isPrivate: false,
    page: <Products />,
  },
  {
    path: "/translator/products",
    layout: false,
    isPrivate: false,
    page: <Metafields />,
  },
  {
    path: "/translator/collections",
    layout: false,
    isPrivate: false,
    page: <Metafields />,
  },
  {
    path: "/guide",
    layout: false,
    isPrivate: false,
    page: <UserGuide />,
  },
  {
    path: "/settings",
    layout: false,
    isPrivate: false,
    page: <Settings />,
  },
  {
    path: "/support",
    layout: false,
    isPrivate: false,
    page: <Support />,
  },
  {
    path: "/install/login",
    layout: false,
    isPrivate: false,
    page: <Login />,
  },
  {
    path: "/install/grandservice",
    layout: false,
    isPrivate: false,
    page: <GrandService />,
  },
  {
    path: "*",
    layout: false,
    isPrivate: false,
    page: <NotFound />,
  },
];

