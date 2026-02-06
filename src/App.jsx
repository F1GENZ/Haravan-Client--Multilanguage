import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { routes } from "./config/RouterConfig";
import MainLayout from "./components/layout/index";

function App() {
  // Check URL params first - crucial for redirect from login
  const params = new URLSearchParams(window.location.search);
  const urlOrgid = params.get("orgid");
  
  if (urlOrgid && urlOrgid !== 'null' && urlOrgid !== 'undefined') {
    sessionStorage.setItem("orgid", urlOrgid);
  }
  
  const currentOrgid = urlOrgid || sessionStorage.getItem("orgid");
  
  // Move redirect logic to useEffect
  useEffect(() => {
    // Re-check params inside effect to be sure
    const searchParams = new URLSearchParams(window.location.search);
    const pOrgid = searchParams.get("orgid");
    const sOrgid = sessionStorage.getItem("orgid");
    const validOrgid = pOrgid || sOrgid;

    const isAuthPage = window.location.pathname.startsWith('/install') || window.location.pathname.startsWith('/oauth');
    
    if (!validOrgid && !isAuthPage) {
       // Redirect to login - preserve orgid if present in URL
       window.location.href = pOrgid ? `/install/login?orgid=${pOrgid}` : '/install/login';
    }
  }, []); // Run once on mount is safer for redirect logic
  
  const isAuthPage = window.location.pathname.startsWith('/install') || window.location.pathname.startsWith('/oauth');
  
  // If we have orgid (either from URL or session), allow render. 
  // If not, and not on auth page, block render.
  if (!currentOrgid && !isAuthPage) {
     return null;
  }

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
