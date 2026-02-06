import { Spin } from 'antd';
import { useEffect } from 'react';
import { authService } from '../../../common/AuthService';
const Login = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    // Prioritize orgid from URL param
    const orgidParam = params.get('orgid') || sessionStorage.getItem("orgid");

    console.log('🔍 Login page loaded');
    console.log('📍 Current URL:', window.location.href);
    console.log('🔑 Code from URL:', code);
    console.log('🏪 Orgid param:', orgidParam);
    console.log('💾 Session orgid:', sessionStorage.getItem("orgid"));

    if (code) {
      // Callback from Haravan -> Verify with Backend
      console.log('✅ Code found, calling verifyLogin...');
      authService.verifyLogin(code).then((response) => {
        console.log('📤 verifyLogin response:', response);
        if (response.data && response.data.url) {
          console.log('🚀 Redirecting to:', response.data.url);
          window.location.href = response.data.url;
        } else {
          console.warn('⚠️ No URL in response:', response);
        }
      }).catch(err => {
         console.error('❌ Verify login error:', err);
         console.error('❌ Error response:', err.response);
      });
    } else {
      // Auto Login - with or without orgid
      // If no orgid, backend will return Haravan Install URL
      console.log('📝 No code, calling login with orgid:', orgidParam || '(empty)');
      authService.login(orgidParam || '').then((response) => {
        console.log('📤 login response:', response);
        if (response.status === 200 && response.data) {
          console.log('🚀 Redirecting to:', response.data);
          window.location.href = response.data;
        }
      }).catch(err => {
        console.error("❌ Login failed", err);
      });
    }
  }, []);

  // Always show spinner - redirect will happen
  return <Spin size='large' fullscreen />;
};

export default Login;

