
import { useState } from 'react';
import { Drawer, List, Col, Row, Tag } from 'antd';
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
      <div className={styles.header}>
        <div className={styles.title}>Inspect Webpack Plugin</div>
      </div>
      <List
        bordered
        dataSource={moduleIds}
        renderItem={(item: string) => (
          <List.Item
            className={styles.listItem}
            onClick={() => {
              setModuleId(item);
              showDrawer();
              setTransformIndex(0); // init to __load__
            }}
          >
            <div>{item}</div>
            <div>
              {
                transformMap[item]
                  .filter(({ name }) => name !== '__LOAD__')
                  .map(({ name }) => <Tag style={{ color: '#707173', borderRadius: 10 }}>{name}</Tag>)
              }
            </div>
          </List.Item>
        )}
      />

      <Drawer
        title={moduleId}
        placement="right"
        onClose={closeDrawer}
        visible={drawerVisible}
        width="90vw"
        className={styles.drawer}
        destroyOnClose
      >
        <Row>
          <Col span={6}>
            <List
              header={
                <div
                  className={styles.listTitle}
                  style={{ textAlign: 'center' }}
                >
                  Transform Stack
                </div>
              }
              footer={<></>}
              dataSource={(transformMap[moduleId] || []).map(item => item.name)}
              renderItem={(item: string, index: number) => (
                <List.Item
                  className={styles.listItem}
                  style={transformIndex === index ? { background: '#141414' } : {}}
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

function calcLoaderTimeInterval(start: number, end: number) {

}

export function getConfig() {
  return {
    title: 'Inspect Webpack Plugin',
  };
}