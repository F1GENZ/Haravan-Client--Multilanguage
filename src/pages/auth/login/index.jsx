import { Spin } from 'antd';
import { useEffect } from 'react';
import { authService } from '../../../common/AuthService';
const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // Prioritize orgid from URL param (passed during 401 redirect)
    const orgid = params.get('orgid') || sessionStorage.getItem("orgid");

    if (code) {
      // Callback from Haravan -> Verify with Backend
      authService.verifyLogin(code).then((response) => {
        // Backend returns JSON { url: ... }
        if (response.data && response.data.url) {
          window.location.href = response.data.url;
        }
      }).catch(err => {
         console.error('Verify login error:', err);
         // Handle error (optional: show notification)
      });
    } else {
      // No code -> Start Login Flow
      authService.login(orgid).then((response) => {
        if (response.status === 200 && response.data) window.location.href = response.data;
      });
    }
  }, []);
  
  return <Spin size='large' fullscreen />;
};

export default Login;
