import React, { useEffect, useState } from 'react';
import { CategoryStyleType } from '@/types/CategoryStyleType';
import { getDataByDocName } from '@/services/FirestoreData/getFirestoreData';
import { Form, Select, Switch, Row, Col, Typography, message, Tag } from 'antd';

const { Option } = Select;
const { Title } = Typography;

type Props = {};

export default function CategoryStyle({}: Props) {
  const [categoryStyle, setCategoryStyle] = useState<CategoryStyleType | null>(null);

  const fetchCategoryStyle = async () => {
    try {
      const data = await getDataByDocName<CategoryStyleType>('theme-settings', 'categories');
      setCategoryStyle(data);
    } catch (error) {
      console.error('Failed to fetch category style data:', error);
      message.error('Error fetching data');
    }  
  };

  useEffect(() => {
    fetchCategoryStyle();
  }, []);

  const handleCategorieTypeChange = (value: string) => {
    if (categoryStyle) {
      setCategoryStyle({
        ...categoryStyle,
        selectedType: value,
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    if (categoryStyle) {
      setCategoryStyle({
        ...categoryStyle,
        isEnable: checked,
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Title level={3}>Category Style Settings</Title>
      {categoryStyle ? (
        <>
          <Form layout="vertical">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Enable">
                  <Switch
                    checked={categoryStyle.isEnable}
                    onChange={handleSwitchChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Categorie Types">
                  <Select
                    value={categoryStyle.selectedType}
                    onChange={handleCategorieTypeChange}
                    placeholder="Select a category type"
                    style={{ width: '100%' }}
                  >
                    {categoryStyle.categorieType.map((type) => (
                      <Option key={type} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Title level={5}>
                  Selected Type:{' '}
                  <Tag color="purple" style={{ fontSize: '16px', padding: '5px 10px' }}>
                    {categoryStyle.selectedType}
                  </Tag>
                </Title>
              </Col>
            </Row>
          </Form>
          {/* <Row className="mt-4">
            <Col span={24}>
              <Title level={4}>Current Data:</Title>
              <pre
                style={{
                  background: '#f6f8fa',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                }}
              >
                {JSON.stringify(categoryStyle, null, 2)}
              </pre>
            </Col>
          </Row> */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
