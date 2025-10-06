import React, { use } from 'react';
import { Spin } from 'antd';

const GrandService = () => {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const code = hashParams.get('code');
  }, []);
  return <Spin size='large' fullscreen />;
};

export default GrandService;
