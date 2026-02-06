import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, message, Modal, Progress, Space, Tag, Spin, Input, Checkbox, Alert, Radio } from 'antd';
import { TranslationOutlined, SearchOutlined, ReloadOutlined, WarningOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import httpClient from '../../config/AxiosConfig';
import { useLanguages } from '../../common/LanguageService';
import { dataService } from '../../common/DataServices';
import { metafieldsService } from '../../common/MetafieldsServices';

const { Option } = Select;

const TRANSLATABLE_FIELDS = [
  { key: 'title', label: 'Tiêu đề (Title)', type: 'text' },
  { key: 'product_type', label: 'Loại sản phẩm (Product Type)', type: 'text' },
  { key: 'vendor', label: 'Nhà cung cấp (Vendor)', type: 'text' },
  { key: 'description', label: 'Mô tả (Description)', type: 'html', sourceKey: 'body_html' },
];

// Helper function to format numbers with thousand separators
const formatNumber = (num) => {
  return num?.toLocaleString('vi-VN') || '0';
};

const ProductsPage = () => {
  // Use the same hook as metafields page
  const { languages, isLoading: languagesLoading } = useLanguages();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [searchText, setSearchText] = useState('');
  
  // Fields to translate (default all selected)
  const [selectedFields, setSelectedFields] = useState(TRANSLATABLE_FIELDS.map(f => f.key));
  
  // Translate mode: 'selected' or 'all'
  const [translateMode, setTranslateMode] = useState('selected');
  
  // Quota state
  const [quota, setQuota] = useState({ used: 0, total: 500, remaining: 500 });
  const [quotaLoading, setQuotaLoading] = useState(false);
  
  // Track translated products: { productId: [langCodes] }
  const [translatedProducts, setTranslatedProducts] = useState({});
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // Total products count (for "all" mode and pagination)
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch product count on page load
  useEffect(() => {
    fetchProductCount();
  }, []);

  // Fetch quota when modal opens
  useEffect(() => {
    if (bulkModalVisible) {
      fetchQuota();
    }
  }, [bulkModalVisible]);

  const fetchQuota = async () => {
    setQuotaLoading(true);
    try {
      const response = await httpClient.get('/api/translate/quota');
      if (response.data?.success) {
        setQuota(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setQuotaLoading(false);
    }
  };

  const fetchProductCount = async () => {
    try {
      const response = await httpClient.get('/api/data/products/count');
      if (response.data?.success && response.data.data?.count !== undefined) {
        setTotalProducts(response.data.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch product count:', error);
    }
  };

  // Fetch real products data
  const { data: productsData, isLoading: productsLoading, refetch } = dataService.useGetProducts({
    limit: pagination.pageSize,
    page: pagination.current,
  });

  // Extract products array from response
  const products = productsData?.products || [];
  
  // Filter products by search text
  const filteredProducts = products.filter(product => 
    !searchText || 
    product.title?.toLowerCase().includes(searchText.toLowerCase()) ||
    product.handle?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'image',
      width: 100,
      render: (images, record) => {
        // Check images array first, then image object
        let imgSrc = images?.[0]?.src || record.image?.src;
        // Add _medium suffix for smaller image size (faster load)
        if (imgSrc) {
          imgSrc = imgSrc.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '_medium.$1');
        }
        return imgSrc ? (
          <img src={imgSrc} alt="" className="w-16 h-16 object-cover rounded" loading="lazy" />
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No img
          </div>
        );
      },
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      render: (title, record) => {
        const orgid = sessionStorage.getItem('orgid') || '';
        return (
          <Link 
            to={`/translator/products?id=${record.id}&orgid=${orgid}&locale=vi`}
            className="hover:text-blue-600"
          >
            <div className="font-medium text-blue-600 hover:underline">{title}</div>
            <div className="text-xs text-gray-500">{record.handle}</div>
          </Link>
        );
      },
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Loại',
      dataIndex: 'product_type',
      key: 'product_type',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleBulkTranslate = () => {
    setBulkModalVisible(true);
  };

  const startBulkTranslation = async () => {
    if (!targetLanguage) {
      message.error('Vui lòng chọn ngôn ngữ đích!');
      return;
    }

    if (selectedFields.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 trường để dịch!');
      return;
    }

    const productsToTranslateCount = translateMode === 'all' ? totalProducts : selectedRowKeys.length;
    
    if (productsToTranslateCount === 0) {
      message.error('Không có sản phẩm nào để dịch!');
      return;
    }

    // Check quota before starting
    if (productsToTranslateCount > quota.remaining) {
      message.error(`Không đủ quota! Cần ${productsToTranslateCount}, còn lại ${quota.remaining}`);
      return;
    }

    setTranslating(true);

    try {
      let productsToTranslate = [];
      
      if (translateMode === 'all') {
        // Fetch ALL products (paginated)
        message.loading('Đang tải danh sách sản phẩm...', 0);
        
        let allProducts = [];
        let page = 1;
        const limit = 100;
        
        while (true) {
          const response = await httpClient.get(`/api/data/products?limit=${limit}&page=${page}`);
          const batch = response.data?.data?.products || [];
          allProducts = [...allProducts, ...batch];
          
          if (batch.length < limit) break;
          page++;
        }
        
        productsToTranslate = allProducts;
        message.destroy();
      } else {
        // Use selected products from current page
        productsToTranslate = products.filter(p => selectedRowKeys.includes(p.id));
      }
      
      setProgress({ current: 0, total: productsToTranslate.length });

      const namespace = `hrvmultilang_${targetLanguage}`;
      let successCount = 0;
      let failCount = 0;
      
      // Translate each product's fields in 1 API call (not N separate calls)
      for (let i = 0; i < productsToTranslate.length; i++) {
        const product = productsToTranslate[i];
        
        // Build fields array based on selected fields
        const fields = [];
        
        for (const fieldConfig of TRANSLATABLE_FIELDS) {
          if (!selectedFields.includes(fieldConfig.key)) continue;
          
          const sourceKey = fieldConfig.sourceKey || fieldConfig.key;
          const value = product[sourceKey];
          
          if (value) {
            fields.push({ key: fieldConfig.key, value, type: fieldConfig.type });
          }
        }

        try {
          // Batch translate all fields of this product in 1 API call
          const response = await httpClient.post('/api/translate/fields', {
            fields,
            targetLanguage
          });

          if (response.data.success && response.data.data) {
            // Save each translated field to metafield
            for (const result of response.data.data) {
              if (!result.success) continue;
              
              try {
                await httpClient.post('/api/metafields', {
                  type: 'product',
                  objectid: product.id,
                  namespace: namespace,
                  key: result.key,
                  value: result.translated,
                  value_type: 'string',
                  description: `Translated ${result.key}`
                });
              } catch (saveError) {
                console.error(`Failed to save ${result.key} for product ${product.id}:`, saveError);
              }
            }
            successCount++;
          } else {
            failCount++;
          }
        } catch (translateError) {
          console.error(`Failed to translate product ${product.id}:`, translateError);
          failCount++;
        }

        setProgress({ current: i + 1, total: productsToTranslate.length });
      }

      message.success({
        content: `Đã dịch ${successCount} sản phẩm thành công! (${failCount > 0 ? `${failCount} lỗi` : 'Không có lỗi'})`,
        duration: 5,
      });

      // Update translated products state
      const newTranslatedProducts = { ...translatedProducts };
      selectedRowKeys.forEach(productId => {
        const existing = newTranslatedProducts[productId] || [];
        if (!existing.includes(targetLanguage)) {
          newTranslatedProducts[productId] = [...existing, targetLanguage];
        }
      });
      setTranslatedProducts(newTranslatedProducts);

      setBulkModalVisible(false);
      setSelectedRowKeys([]);
      refetch();
    } catch (error) {
      message.error({
        content: `Lỗi khi dịch hàng loạt: ${error.message}`,
        duration: 5,
      });
    } finally {
      setTranslating(false);
    }
  };

  const handleTableChange = (pag) => {
    setPagination({
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex justify-between items-center flex-wrap gap-4">
            <span className="text-lg font-semibold">📦 Tất cả sản phẩm</span>
            <Space>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
                allowClear
              />
              <Button 
                icon={<ReloadOutlined />} 
                onClick={() => refetch()}
                loading={productsLoading}
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<TranslationOutlined />}
                onClick={handleBulkTranslate}
                disabled={selectedRowKeys.length === 0}
              >
                Dịch hàng loạt ({selectedRowKeys.length})
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={productsLoading}
          pagination={{
            ...pagination,
            total: totalProducts,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Bulk Translation Modal */}
      <Modal
        title="Dịch hàng loạt sản phẩm"
        open={bulkModalVisible}
        onCancel={() => !translating && setBulkModalVisible(false)}
        footer={(() => {
          const count = translateMode === 'all' ? totalProducts : selectedRowKeys.length;
          const exceedsQuota = count > quota.remaining;
          const noProducts = count === 0;
          const noFields = selectedFields.length === 0;
          const noLanguage = !targetLanguage;
          const isDisabled = exceedsQuota || noProducts || noFields || noLanguage || translating;
          
          return [
            <Button key="cancel" onClick={() => setBulkModalVisible(false)} disabled={translating}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={startBulkTranslation}
              loading={translating}
              disabled={isDisabled}
              icon={<TranslationOutlined />}
            >
              Bắt đầu dịch ({count} SP)
            </Button>,
          ];
        })()}
        width={600}
        closable={!translating}
        maskClosable={!translating}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Quota Warning */}
          <Alert
            type={quota.remaining < 50 ? 'warning' : 'info'}
            showIcon
            message={
              <span>
                Quota: <strong>{formatNumber(quota.remaining)}</strong> / {formatNumber(quota.total)} lượt dịch còn lại
                {quota.remaining < 50 && ' - Liên hệ hỗ trợ nếu cần nâng cấp'}
              </span>
            }
          />

          {/* Translate Mode */}
          <div>
            <label className="block mb-2 font-medium">Phạm vi dịch:</label>
            <Radio.Group 
              value={translateMode} 
              onChange={e => setTranslateMode(e.target.value)}
              disabled={translating}
            >
              <Space direction="vertical">
                <Radio value="selected">
                  Sản phẩm đã chọn ({selectedRowKeys.length} SP)
                </Radio>
                <Radio value="all">
                  <strong>Tất cả sản phẩm</strong> ({totalProducts} SP)
                </Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* Quota Exceeded Warning */}
          {(() => {
            const count = translateMode === 'all' ? totalProducts : selectedRowKeys.length;
            if (count > quota.remaining) {
              return (
                <Alert
                  type="error"
                  showIcon
                  icon={<WarningOutlined />}
                  message={`Vượt quota! Cần ${formatNumber(count)} lượt dịch, còn lại ${formatNumber(quota.remaining)}. Liên hệ hỗ trợ.`}
                />
              );
            }
            return null;
          })()}
          
          {/* Language Selector */}
          <div>
            <label className="block mb-2 font-medium">Ngôn ngữ đích:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn ngôn ngữ"
              value={targetLanguage}
              onChange={setTargetLanguage}
              disabled={translating}
              loading={languagesLoading}
            >
              {languages.map(lang => (
                <Option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.code})
                </Option>
              ))}
            </Select>
          </div>

          {/* Field Selection */}
          <div>
            <label className="block mb-2 font-medium">Các trường cần dịch:</label>
            <Checkbox.Group
              value={selectedFields}
              onChange={setSelectedFields}
              disabled={translating}
            >
              <Space direction="vertical">
                {TRANSLATABLE_FIELDS.map(field => (
                  <Checkbox key={field.key} value={field.key}>
                    {field.label}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>

          {/* Progress */}
          {translating && (
            <div>
              <p className="mb-2">Đang dịch...</p>
              <Progress
                percent={progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}
                status="active"
              />
              <p className="text-sm text-gray-500 mt-2">
                {progress.current} / {progress.total} sản phẩm
              </p>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default ProductsPage;
