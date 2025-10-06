import { Spin } from 'antd';
import { useEffect } from 'react';
import { authService } from '../../../common/AuthService';
const Login = () => {
  let orgid = sessionStorage.getItem("orgid") || 0;
  useEffect(() => {
    authService.login(orgid).then((response) => {
      if (response.status === 200 && response.data) window.location.href = response.data;
    })
  }, []);
  return <Spin size='large' fullscreen />;
};

export default Login;
