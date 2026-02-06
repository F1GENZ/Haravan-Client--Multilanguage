import React from 'react';
import { Card, Typography, Descriptions, Alert, Tag, Divider, Space, Button } from 'antd';
import { MailOutlined, PhoneOutlined, GlobalOutlined, CustomerServiceOutlined, ClockCircleOutlined, FacebookOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const Support = () => {
  return (
    <div className="p-6 bg-gray-50" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div>
        <div className="mb-8">
          <Title level={2}>
            <CustomerServiceOutlined className="mr-2" />
            Liên hệ hỗ trợ
          </Title>
          <Text type="secondary">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn!
          </Text>
        </div>

        <Alert
          message="Hỗ trợ nhanh chóng"
          description="Đội ngũ hỗ trợ của chúng tôi cam kết phản hồi trong vòng 24h làm việc."
          type="success"
          showIcon
          className="!mb-4"
        />

        <div className="grid !grid-cols-1 md:!grid-cols-2 !gap-6">
          <Card className="shadow-sm" style={{ minHeight: '400px' }}>
            <Title level={3}>
              <MailOutlined className="mr-2 text-blue-500" />
              Thông tin liên hệ
            </Title>
            <Descriptions column={1} bordered>
              <Descriptions.Item 
                label={
                  <span>
                    <MailOutlined className="mr-2" />
                    Email hỗ trợ
                  </span>
                }
              >
                <Link href="mailto:support@f1genz.com" strong>
                  support@f1genz.com
                </Link>
                <br />
                <Text type="secondary" className="text-sm">
                  Gửi email cho chúng tôi bất cứ lúc nào
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <span>
                    <img src="/zalo.png" alt="Zalo" className="w-4 h-4 inline mr-2" />
                    Zalo OA
                  </span>
                }
              >
                <Link href="https://zalo.me/f1genz" target="_blank" strong>
                  Zalo Official Account
                </Link>
                <br />
                <Text type="secondary" className="text-sm">
                  Chat trực tiếp qua Zalo
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <span>
                    <FacebookOutlined className="mr-2" />
                    Facebook
                  </span>
                }
              >
                <Link href="https://facebook.com/f1genz" target="_blank" strong>
                  fb.com/f1genz
                </Link>
                <br />
                <Text type="secondary" className="text-sm">
                  Theo dõi fanpage để cập nhật tin tức mới nhất
                </Text>
              </Descriptions.Item>

              <Descriptions.Item 
                label={
                  <span>
                    <GlobalOutlined className="mr-2" />
                    Website
                  </span>
                }
              >
                <Link href="https://f1genz.com" target="_blank" strong>
                  www.f1genz.com
                </Link>
                <br />
                <Text type="secondary" className="text-sm">
                  Trang web chính thức
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card className="shadow-sm" style={{ minHeight: '400px' }}>
            <Title level={3}>
              <ClockCircleOutlined className="mr-2 text-orange-500" />
              Giờ làm việc & Hỗ trợ
            </Title>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Thứ 2 - Thứ 6">
                9:00 AM - 6:00 PM (GMT+7)
              </Descriptions.Item>
              <Descriptions.Item label="Thứ 7, Chủ nhật & Ngày lễ">
                <Tag color="red">Nghỉ</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian phản hồi">
                <Tag color="green">Trong vòng 24h làm việc</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Hỗ trợ khẩn cấp">
                <Text strong>Liên hệ qua Zalo</Text>
                <br />
                <Text type="secondary" className="text-sm">
                  Cho các vấn đề cần giải quyết ngay
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
