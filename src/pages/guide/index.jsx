import React from 'react';
import { Card, Typography, Steps, Alert, Tag, Divider, Collapse, Space } from 'antd';
import { 
  BookOutlined, 
  SettingOutlined, 
  GlobalOutlined,
  TranslationOutlined,
  DollarOutlined,
  AppstoreOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const UserGuide = () => {
  return (
    <div className="p-6! bg-gray-50!" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div>
        
        {/* Header */}
        <div className="mb-8!">
          <Title level={2}>
            <BookOutlined className="mr-3!" />
            Hướng dẫn sử dụng
          </Title>
          <Paragraph className="text-lg! text-gray-600!">
            Hệ thống quản lý đa ngôn ngữ cho Haravan với dịch tự động bằng ChatGPT
          </Paragraph>
        </div>

        {/* Các bước sử dụng */}
        <Card className="mb-6! shadow-sm!">
          <Title level={3}>
            <CheckCircleOutlined className="mr-2! text-green-500!" />
            Các bước sử dụng nhanh
          </Title>
          <Steps
            current={-1}
            direction="vertical"
            className="mt-6!"
            items={[
              {
                title: 'Cấu hình ngôn ngữ',
                description: 'Thêm các ngôn ngữ bạn muốn hỗ trợ tại trang Cài đặt',
                icon: <GlobalOutlined />,
              },
              {
                title: 'Cấu hình trường tùy chỉnh (tùy chọn)',
                description: 'Thêm các trường bổ sung ngoài title/description nếu cần',
                icon: <AppstoreOutlined />,
              },
              {
                title: 'Dịch từng sản phẩm',
                description: 'Vào Products → chọn sản phẩm → tab ngôn ngữ → Dịch tự động',
                icon: <TranslationOutlined />,
              },
              {
                title: 'Dịch hàng loạt',
                description: 'Chọn nhiều sản phẩm → Dịch hàng loạt → Chọn ngôn ngữ và trường cần dịch',
                icon: <RocketOutlined />,
              },
            ]}
          />
        </Card>

        {/* Chi tiết tính năng */}
        <Card className="mb-6! shadow-sm!">
          <Title level={3}>
            <SettingOutlined className="mr-2! text-purple-500!" />
            Chi tiết tính năng
          </Title>
          
          <Collapse 
            defaultActiveKey={['1']} 
            className="mt-6!"
            expandIconPosition="end"
          >
            <Panel 
              header={
                <Space>
                  <GlobalOutlined className="text-blue-500!" />
                  <Text strong>1. Quản lý ngôn ngữ</Text>
                </Space>
              } 
              key="1"
            >
              <ul className="list-disc! pl-6! space-y-2!">
                <li><Text strong>Hỗ trợ 200+ ngôn ngữ</Text> theo chuẩn ISO 639-1</li>
                <li><Text strong>Thêm ngôn ngữ:</Text> Click "Thêm ngôn ngữ" → Chọn từ dropdown</li>
                <li><Text strong>Đặt mặc định:</Text> Click "Đặt mặc định" (ngôn ngữ đầu tiên tự động là mặc định)</li>
                <li><Text strong>Xóa ngôn ngữ:</Text> Click nút xóa (không thể xóa ngôn ngữ mặc định)</li>
              </ul>
              <Alert
                message="⚠️ LÚU Ý QUAN TRỌNG"
                description={
                  <div className="space-y-2!">
                    <div>
                      <Text strong className="text-red-600!">Sau khi thêm ngôn ngữ mới, bạn cần liên hệ đội ngũ phát triển để:</Text>
                    </div>
                    <ul className="list-disc! pl-6! space-y-1!">
                      <li>Gắn code hiển thị switcher ngôn ngữ trên website</li>
                      <li>Cấu hình đúng namespace metafield (hrvmultilang_&#123;language_code&#125;)</li>
                      <li>Tích hợp theme hiển thị nội dung đa ngôn ngữ</li>
                    </ul>
                    <Text className="text-blue-600!">
                      📧 Liên hệ: support@f1genz.com hoặc qua trang "Liên hệ hỗ trợ"
                    </Text>
                  </div>
                }
                type="warning"
                showIcon
                className="mt-4!"
              />
              <Alert
                message="💡 Lưu ý"
                description="Ngôn ngữ mặc định là ngôn ngữ nguồn cho việc dịch. Hãy chọn ngôn ngữ bạn thường dùng nhất làm mặc định."
                type="info"
                showIcon
                className="mt-4!"
              />
            </Panel>

            <Panel 
              header={
                <Space>
                  <AppstoreOutlined className="text-purple-500!" />
                  <Text strong>2. Quản lý trường tùy chỉnh</Text>
                </Space>
              } 
              key="2"
            >
              <div className="space-y-4!">
                <div>
                  <Text strong className="text-green-600!">Trường mặc định (Không thể xóa):</Text>
                  <ul className="list-disc! pl-6! mt-2! space-y-1!">
                    <li><Tag color="default">title</Tag> - Input Text - Tiêu đề</li>
                    <li><Tag color="default">description</Tag> - HTML Editor - Mô tả</li>
                  </ul>
                </div>

                <div>
                  <Text strong className="text-blue-600!">Trường tùy chỉnh (Có thể thêm/xóa):</Text>
                  <ul className="list-disc! pl-6! mt-2! space-y-1!">
                    <li><Text strong>String (Input):</Text> Cho văn bản ngắn (subtitle, banner_text...)</li>
                    <li><Text strong>HTML (Editor):</Text> Cho nội dung phức tạp với TinyMCE</li>
                  </ul>
                </div>

                <div>
                  <Text strong>Cách thêm trường:</Text>
                  <ol className="list-decimal! pl-6! mt-2! space-y-1!">
                    <li>Chọn tab Product hoặc Collection</li>
                    <li>Click "Thêm trường"</li>
                    <li>Nhập Key (VD: subtitle)</li>
                    <li>Chọn loại: String hoặc HTML</li>
                    <li>Nhập Tên trường (Label) - sẽ hiển thị trong form dịch</li>
                  </ol>
                </div>
              </div>
            </Panel>

            <Panel 
              header={
                <Space>
                  <ApiOutlined className="text-green-500!" />
                  <Text strong>3. Dịch thuật AI (Gemini)</Text>
                </Space>
              } 
              key="3"
            >
              <div className="space-y-4!">
                <Alert
                  message="✨ Không cần cấu hình API Key"
                  description="Hệ thống sử dụng Gemini AI được cung cấp bởi F1GENZ. Bạn chỉ cần chọn sản phẩm và bấm dịch!"
                  type="success"
                  showIcon
                />
                
                <div>
                  <Text strong>Quota dịch thuật:</Text>
                  <ul className="list-disc! pl-6! mt-2! space-y-1!">
                    <li>Mỗi cửa hàng được cấp <Tag color="blue">500 bản dịch miễn phí</Tag></li>
                    <li>Xem quota còn lại tại trang <Tag color="purple">Cài đặt</Tag></li>
                    <li>Liên hệ hỗ trợ để nâng cấp quota nếu cần</li>
                  </ul>
                </div>

                <div>
                  <Text strong>Các trường hỗ trợ dịch:</Text>
                  <ul className="list-disc! pl-6! mt-2! space-y-1!">
                    <li><Tag>Title</Tag> - Tiêu đề sản phẩm</li>
                    <li><Tag>Description</Tag> - Mô tả (giữ nguyên HTML)</li>
                    <li><Tag>Product Type</Tag> - Loại sản phẩm</li>
                    <li><Tag>Vendor</Tag> - Nhà cung cấp</li>
                    <li><Tag>Custom fields</Tag> - Các trường tùy chỉnh</li>
                  </ul>
                </div>
              </div>
            </Panel>

            <Panel 
              header={
                <Space>
                  <TranslationOutlined className="text-orange-500!" />
                  <Text strong>4. Dịch nội dung</Text>
                </Space>
              } 
              key="4"
            >
              <div className="space-y-4!">
                <div>
                  <Text strong>Cách dịch:</Text>
                  <ol className="list-decimal! pl-6! mt-2! space-y-2!">
                    <li>Vào trang <Tag color="green">Products</Tag> hoặc <Tag color="green">Collections</Tag></li>
                    <li>Chọn sản phẩm/bộ sưu tập cần dịch</li>
                    <li>Nhập nội dung vào tab ngôn ngữ mặc định</li>
                    <li>Chuyển sang tab ngôn ngữ đích (VD: English, Français)</li>
                    <li>Click <Tag color="blue">Dịch tự động</Tag></li>
                    <li>Chờ AI dịch và tự động điền vào các trường</li>
                    <li>Kiểm tra và chỉnh sửa nếu cần</li>
                    <li>Click "Lưu" để hoàn tất</li>
                  </ol>
                </div>

                <Alert
                  message="💡 Tips"
                  description={
                    <ul className="list-disc! pl-6! space-y-1!">
                      <li>Nội dung nguồn càng rõ ràng, bản dịch càng chất lượng</li>
                      <li>HTML Editor: AI giữ nguyên định dạng (bold, italic, links)</li>
                      <li>Có thể dịch từng trường riêng lẻ bằng nút "Dịch" bên cạnh</li>
                      <li>Chỉnh sửa bản dịch sau khi AI hoàn thành</li>
                    </ul>
                  }
                  type="info"
                  showIcon
                  className="mt-4!"
                />
              </div>
            </Panel>

            <Panel 
              header={
                <Space>
                  <DollarOutlined className="text-yellow-500!" />
                  <Text strong>5. Quản lý tiền tệ</Text>
                </Space>
              } 
              key="5"
            >
              <Paragraph>
                Cấu hình tính năng chuyển đổi tiền tệ tự động:
              </Paragraph>

              <div className="space-y-3!">
                <div>
                  <Tag color="blue">Bật chuyển đổi tiền tệ</Tag>
                  <Paragraph className="ml-4! mt-1!">
                    Bật/tắt toàn bộ tính năng trong ứng dụng
                  </Paragraph>
                </div>

                <div>
                  <Tag color="blue">Tự động phát hiện tiền tệ theo ngôn ngữ</Tag>
                  <Paragraph className="ml-4! mt-1!">
                    Tự động xác định đơn vị tiền tệ dựa trên ngôn ngữ đang sử dụng
                  </Paragraph>
                </div>

                <div>
                  <Tag color="blue">Hiển thị ký hiệu tiền tệ</Tag>
                  <Paragraph className="ml-4! mt-1!">
                    Chọn hiển thị: Ký hiệu ($, €, ¥) hoặc Mã (USD, EUR, JPY)
                  </Paragraph>
                </div>
              </div>

              <Alert
                message="🔧 Tích hợp sau này"
                description="Đây là cấu hình sẵn sàng. Để sử dụng thực tế, cần import file JS xử lý currency converter."
                type="info"
                showIcon
                className="mt-4!"
              />
            </Panel>
          </Collapse>
        </Card>

        {/* CTA */}
        <Card className="shadow-sm! bg-blue-50!">
          <div className="text-center!">
            <Title level={4} className="mb-2!">🎉 Bắt đầu ngay!</Title>
            <Paragraph>
              Vào <Tag color="blue">Cài đặt</Tag> để thiết lập ngôn ngữ và API ChatGPT, 
              sau đó bắt đầu dịch sản phẩm của bạn!
            </Paragraph>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default UserGuide;
