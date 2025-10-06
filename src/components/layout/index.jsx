import { Layout, Flex, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTrialInfo } from '../../common/TrialService';
const { Header, Footer, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // Get orgid from sessionStorage
  const orgid = sessionStorage.getItem("orgid");
  
  // Fetch trial info
  const { data: trialData, isLoading: trialLoading } = useTrialInfo(orgid);
  const daysRemaining = trialData?.data?.daysRemaining ?? 15; // Default to 15 if loading or error

  const menuItems = [
    { path: '/', label: '⭐ Giới thiệu' },
    { path: '/guide', label: '📑 Hướng dẫn sử dụng' },
    { path: '/settings', label: '🛠️ Cài đặt' },
    { path: '/support', label: '📩 Liên hệ hỗ trợ' },
  ];

  return (
    <Layout className='h-screen w-screen'>
      <Sider width="210">
        <Flex className='flex-col h-full bg-[#001529] space-y-2'>
          <Header className='bg-blue-300! h-fit! p-2!'>
            <Flex justify='between' align='center' gap={16}>
              <img src='/logo.png' alt='Logo' className='h-auto max-w-6' />
              <h1 className='text-xl font-bold'>F1GENZ</h1>
            </Flex>
          </Header>
          <div className='flex-1'>
            <ul className='*:py-1! *:px-1!'>
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`text-white! block text-base! px-4 py-2 rounded transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-blue-600!' 
                        : 'hover:bg-gray-700!'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Footer className='bg-transparent! h-fit! p-2! *:text-white text-xs! space-y-1'>
            <p>
              Bạn còn <strong className='text-red-500 text-!'>{daysRemaining} ngày</strong> dùng thử
            </p>
            <p>©{new Date().getFullYear()} F1GENZ. All rights reserved.</p>
          </Footer>
        </Flex>
      </Sider>
      <Content className='flex-1 px-4! my-2!'>
        <div className='w-full h-full'>
          <div className='bg-white shadow-md rounded-lg h-full overflow-y-auto'>
            {children}
          </div>
        </div>
      </Content>

    </Layout>
  );
};

export default MainLayout;
