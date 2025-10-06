import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import App from './App'
import './App.css';
import './index.css'


import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './config/QueryClientConfig'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
) 
