import React from 'react';
import { Card, Typography, Timeline, Tag, Space, Row, Col } from 'antd';
import { 
  RocketOutlined, 
  StarOutlined, 
  CheckCircleOutlined, 
  GlobalOutlined,
  TranslationOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ApiOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Introduction = () => {
  return (
    <div className="p-6! bg-gray-50!" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <div>
        
        {/* Header */}
        <div className="mb-8!">
          <Title level={2}>
            <RocketOutlined className="mr-3!" />
            Chào mừng đến với F1GENZ Multi-Language
          </Title>
          <Paragraph className="text-lg! text-gray-600!">
            Giải pháp quản lý đa ngôn ngữ chuyên nghiệp cho Haravan với AI ChatGPT
          </Paragraph>
        </div>

        {/* Giới thiệu chính */}
        <Card className="mb-6! shadow-lg! border-0!">
          <div className="text-center! mb-6!">
            <Title level={2} className="mb-4!">
              <StarOutlined className="mr-2! text-yellow-500!" />
              Sức mạnh đa ngôn ngữ trong tầm tay bạn
            </Title>
            <Paragraph className="text-lg! max-w-3xl! mx-auto!">
              <strong>Haravan Multi Language</strong> là ứng dụng tiên phong tích hợp <Text strong className="text-green-600!">ChatGPT AI</Text> để 
              tự động dịch và quản lý nội dung sản phẩm, bộ sưu tập sang hơn 200 ngôn ngữ. 
              Giúp bạn tiếp cận thị trường toàn cầu chỉ với vài cú click!
            </Paragraph>
          </div>

          <Row gutter={[24, 24]} className="mt-8!">
            <Col xs={24} md={12} lg={6}>
              <div className="text-center! p-6! bg-blue-50! rounded-lg! h-full!">
                <GlobalOutlined className="text-5xl! text-blue-500! mb-3!" />
                <Title level={3} className="text-blue-600!">200+</Title>
                <Text className="text-gray-600!">Ngôn ngữ hỗ trợ</Text>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="text-center! p-6! bg-green-50! rounded-lg! h-full!">
                <TranslationOutlined className="text-5xl! text-green-500! mb-3!" />
                <Title level={3} className="text-green-600!">AI</Title>
                <Text className="text-gray-600!">Dịch tự động ChatGPT</Text>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="text-center! p-6! bg-purple-50! rounded-lg! h-full!">
                <AppstoreOutlined className="text-5xl! text-purple-500! mb-3!" />
                <Title level={3} className="text-purple-600!">∞</Title>
                <Text className="text-gray-600!">Trường tùy chỉnh không giới hạn</Text>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className="text-center! p-6! bg-yellow-50! rounded-lg! h-full!">
                <DollarOutlined className="text-5xl! text-yellow-500! mb-3!" />
                <Title level={3} className="text-yellow-600!">Multi</Title>
                <Text className="text-gray-600!">Hỗ trợ đa tiền tệ</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tính năng nổi bật */}
        <Card className="mb-6! shadow-sm!">
          <Title level={2} className="mb-6!">
            <CheckCircleOutlined className="mr-2! text-green-500!" />
            Tính năng nổi bật
          </Title>
          
          <Timeline
            className="mt-6!"
            items={[
              {
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      🤖 Dịch tự động bằng ChatGPT AI
                    </Title>
                    <Paragraph className="text-base!">
                      Tích hợp <Tag color="green">OpenAI GPT-3.5-turbo</Tag> để dịch nội dung tự động, 
                      giữ nguyên định dạng HTML, chất lượng dịch thuật chuyên nghiệp. 
                      Tùy chỉnh prompt để điều chỉnh phong cách dịch theo ý muốn.
                    </Paragraph>
                    <Space wrap>
                      <Tag color="blue">Dịch tức thì</Tag>
                      <Tag color="blue">Giữ nguyên format HTML</Tag>
                      <Tag color="blue">Custom prompt</Tag>
                    </Space>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      🌍 Quản lý 200+ ngôn ngữ
                    </Title>
                    <Paragraph className="text-base!">
                      Hỗ trợ toàn bộ ngôn ngữ theo chuẩn ISO 639-1. Dễ dàng thêm, xóa, đặt ngôn ngữ mặc định. 
                      Tabs động tự động tạo theo các ngôn ngữ bạn cấu hình.
                    </Paragraph>
                    <Space wrap>
                      <Tag color="purple">English</Tag>
                      <Tag color="purple">Français</Tag>
                      <Tag color="purple">日本語</Tag>
                      <Tag color="purple">한국어</Tag>
                      <Tag color="purple">+196 ngôn ngữ</Tag>
                    </Space>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      📦 Trường tùy chỉnh động với Label
                    </Title>
                    <Paragraph className="text-base!">
                      Tự do thêm các trường tùy chỉnh (String hoặc HTML) cho Products và Collections. 
                      Đặt <Tag color="gold">Label (Tên trường)</Tag> để hiển thị tên dễ hiểu trong form dịch. 
                      Trường mặc định <Tag>title</Tag> và <Tag>description</Tag> luôn có sẵn.
                    </Paragraph>
                    <Space wrap>
                      <Tag color="cyan">String Input</Tag>
                      <Tag color="cyan">HTML TinyMCE Editor</Tag>
                      <Tag color="cyan">Custom Label</Tag>
                    </Space>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      💰 Quản lý tiền tệ theo ngôn ngữ
                    </Title>
                    <Paragraph className="text-base!">
                      Cấu hình tính năng chuyển đổi tiền tệ tự động: bật/tắt, tự động phát hiện theo ngôn ngữ, 
                      hiển thị ký hiệu ($, €) hoặc mã (USD, EUR). Sẵn sàng tích hợp currency converter.
                    </Paragraph>
                    <Space wrap>
                      <Tag color="orange">Auto-detect</Tag>
                      <Tag color="orange">Symbol/Code toggle</Tag>
                      <Tag color="orange">Ready for JS integration</Tag>
                    </Space>
                  </div>
                ),
              },
              {
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      🔒 Bảo mật & Lưu trữ cục bộ
                    </Title>
                    <Paragraph className="text-base!">
                      OpenAI API Key chỉ được lưu trên máy tính của bạn, <Text strong className="text-red-600!">KHÔNG</Text> được đồng bộ lên server. 
                      Mỗi máy tính cần cấu hình riêng, đảm bảo an toàn tuyệt đối cho thông tin của bạn.
                    </Paragraph>
                    <Space wrap>
                      <Tag color="red">Chỉ lưu trên máy bạn</Tag>
                      <Tag color="red">Không gửi lên server</Tag>
                      <Tag color="red">Mỗi máy cấu hình riêng</Tag>
                    </Space>
                  </div>
                ),
              },
              {
                dot: <ApiOutlined className="text-cyan-500! text-lg!" />,
                children: (
                  <div>
                    <Title level={4} className="mb-2!">
                      🔗 Tích hợp Haravan Metafield
                    </Title>
                    <Paragraph className="text-base!">
                      Lưu trữ dữ liệu đa ngôn ngữ qua Haravan Metafield với namespace <Text code>hrvmultilang_*</Text>. 
                      Đồng bộ trực tiếp với Haravan API, an toàn và chính xác.
                    </Paragraph>
                    <Space wrap>
                      <Tag>hrvmultilang_vi</Tag>
                      <Tag>hrvmultilang_en</Tag>
                      <Tag>hrvmultilang_ja</Tag>
                    </Space>
                  </div>
                ),
              },
            ]}
          />
        </Card>

        {/* Lợi ích */}
        <Card className="mb-6! shadow-sm!">
          <Title level={2} className="mb-6!">
            <ThunderboltOutlined className="mr-2! text-orange-500!" />
            Lợi ích vượt trội
          </Title>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div className="p-6! bg-blue-50! rounded-lg! h-full!">
                <TeamOutlined className="text-3xl! text-blue-500! mb-3!" />
                <Title level={4} className="text-blue-600! mb-3!">🌍 Mở rộng thị trường toàn cầu</Title>
                <Paragraph>
                  Tiếp cận 200+ thị trường với ngôn ngữ bản địa. 
                  Khách hàng quốc tế dễ dàng hiểu và tin tưởng sản phẩm của bạn hơn.
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="p-6! bg-green-50! rounded-lg! h-full!">
                <ThunderboltOutlined className="text-3xl! text-green-500! mb-3!" />
                <Title level={4} className="text-green-600! mb-3!">⚡ Tiết kiệm thời gian 90%</Title>
                <Paragraph>
                  AI tự động dịch thay vì dịch thủ công. Quản lý tập trung tất cả ngôn ngữ ở một nơi. 
                  Cập nhật hàng loạt sản phẩm chỉ với vài phút.
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="p-6! bg-purple-50! rounded-lg! h-full!">
                <StarOutlined className="text-3xl! text-purple-500! mb-3!" />
                <Title level={4} className="text-purple-600! mb-3!">📈 Tăng doanh số 3-5 lần</Title>
                <Paragraph>
                  Trải nghiệm mua sắm tốt hơn với ngôn ngữ bản địa → Tăng tỷ lệ chuyển đổi. 
                  Đa tiền tệ giúp khách hàng dễ ra quyết định mua.
                </Paragraph>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div className="p-6! bg-orange-50! rounded-lg! h-full!">
                <CheckCircleOutlined className="text-3xl! text-orange-500! mb-3!" />
                <Title level={4} className="text-orange-600! mb-3!">🎯 Chuyên nghiệp & Nhất quán</Title>
                <Paragraph>
                  Nội dung được dịch bởi AI ChatGPT, đảm bảo chất lượng cao. 
                  Format HTML được giữ nguyên, giao diện đẹp trên mọi ngôn ngữ.
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

      </div>
    </div>
  );
};

export default Introduction;
