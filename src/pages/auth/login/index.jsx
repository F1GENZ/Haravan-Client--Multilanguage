import { Spin } from 'antd';
import { useEffect } from 'react';
import { authService } from '../../../common/AuthService';
const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // Prioritize orgid from URL param
    const orgidParam = params.get('orgid') || sessionStorage.getItem("orgid");

    if (code) {
      // Callback from Haravan -> Verify with Backend
      authService.verifyLogin(code).then((response) => {
        if (response.data && response.data.url) {
          window.location.href = response.data.url;
        }
      }).catch(err => {
         console.error('Verify login error:', err);
      });
    } else {
      // Auto Login - with or without orgid
      // If no orgid, backend will return Haravan Install URL
      authService.login(orgidParam || '').then((response) => {
        if (response.status === 200 && response.data) window.location.href = response.data;
      }).catch(err => {
        console.error("Login failed", err);
      });
    }
  }, []);

  // Always show spinner - redirect will happen
  return <Spin size='large' fullscreen />;
};

export default Login;
