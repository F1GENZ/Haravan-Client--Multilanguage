import { BrowserRouter, Routes, Route } from "react-router";
import { routes } from "./config/RouterConfig";
import MainLayout from "./components/layout/index";
function App() {
  const params = new URLSearchParams(window.location.search);
  const orgid = params.get("orgid") || sessionStorage.getItem("orgid");
  sessionStorage.setItem("orgid", orgid);
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.page} />
          ))}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
