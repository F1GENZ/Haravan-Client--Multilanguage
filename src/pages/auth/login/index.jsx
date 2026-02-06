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
    } else if (orgidParam) {
      // Has orgid -> Auto Login
      authService.login(orgidParam).then((response) => {
        if (response.status === 200 && response.data) window.location.href = response.data;
      }).catch(err => {
        console.error("Login failed", err);
        // If auto-login fails (e.g. invalid orgid), stay on page to allow manual input?
        // For now just log it.
      });
    }
  }, []);

  const handleManualLogin = (values) => {
    const { orgid } = values;
    if (orgid) {
      window.location.href = `/install/login?orgid=${orgid}`;
    }
  };

  // If no code and pending logic... 
  // Actually, we can just render the form. If useEffect redirects, it will unmount.
  
  const params = new URLSearchParams(window.location.search);
  const hasCodeOrOrgid = params.get('code') || params.get('orgid');

  if (hasCodeOrOrgid) {
     return <Spin size='large' fullscreen />;
  }

  // Fallback UI when OrgID is missing
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
       <h2>Vui lòng nhập Shop Domain (Org ID)</h2>
       <p>Ví dụ: myshop.myharavan.com hoặc ID cửa hàng</p>
       <form onSubmit={(e) => {
          e.preventDefault();
          const val = e.target.elements.orgid.value;
          handleManualLogin({ orgid: val });
       }}>
          <input name="orgid" placeholder="Nhập ID cửa hàng..." style={{ padding: '10px', width: '300px', marginBottom: '10px' }} required />
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Đăng nhập</button>
       </form>
    </div>
  );
};

export default Login;
