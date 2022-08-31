
import { useState } from 'react';
import { Drawer, List, Col, Row } from 'antd';
import transformMap from '../../mock/transformMap.json';
import styles from './index.module.css';
import CodeDiffViewer from '@/components/CodeDiffViewer';

console.log(transformMap);

export default function Home() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [moduleId, setModuleId] = useState('');
  const [transformIndex, setTransformIndex] = useState(0);
  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const moduleIds = Reflect.ownKeys(transformMap);

  return (
    <>
      <List
        header={<div className={styles.listTitle}>Module Id</div>}
        bordered
        dataSource={moduleIds}
        renderItem={(item: string) => (
          <List.Item
            onClick={() => {
              setModuleId(item);
              showDrawer();
            }}
          >
            {item}
          </List.Item>
        )}
      />

      <Drawer
        title="Transform Stack"
        placement="right"
        bodyStyle={{ padding: '0 24' }}
        onClose={closeDrawer}
        visible={drawerVisible}
        width="90vw"
        destroyOnClose
      >
        <Row gutter={16}>
          <Col span={6}>
            <List
              header={<div className={styles.listTitle}>Module Id</div>}
              dataSource={(transformMap[moduleId] || []).map(item => item.name)}
              renderItem={(item: string, index: number) => (
                <List.Item
                  onClick={() => {
                    setTransformIndex(index);
                  }}
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>
          <Col span={18}>
            <CodeDiffViewer
              oldCode={transformIndex > 0 ? transformMap[moduleId]?.[transformIndex - 1].result : ''}
              newCode={transformMap[moduleId]?.[transformIndex].result}
            />
          </Col>
        </Row>

      </Drawer>
    </>
  );
}

export function getConfig() {
  return {
    title: 'Inspect Webpack Plugin',
  };
}