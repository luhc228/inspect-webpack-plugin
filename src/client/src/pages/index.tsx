
import { useState, useEffect } from 'react';
import { Drawer, List, Col, Row, Tag, notification } from 'antd';
import styles from './index.module.css';
import CodeDiffViewer from '@/components/CodeDiffViewer';
import { SERVER_HOST } from '@/constants';
import { ReloadOutlined } from '@ant-design/icons';

interface Data {
  transformMap: TransformMap;
  context: string;
  done: boolean;
}

export default function Home() {
  const [transformMap, setTransformMap] = useState<TransformMap>({});
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [moduleId, setModuleId] = useState('');
  const [transformIndex, setTransformIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [contextPath, setContextPath] = useState('');

  const showDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  function fetchData() {
    setLoading(true);
    fetch(`${SERVER_HOST}/data`)
      .then((res) => res.json())
      .then((data: Data) => {
        const { context, transformMap } = data;
        setContextPath(context);
        setTransformMap(transformMap);
      })
      .catch((error) => {
        notification.error({
          message: error.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);

  const moduleIds = Reflect.ownKeys(transformMap);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>Inspect Webpack Plugin</div>
        <div className={styles.operation}>
          <ReloadOutlined className={styles.icon} onClick={() => fetchData()} />
        </div>
      </div>
      <List
        bordered
        loading={loading}
        dataSource={moduleIds}
        renderItem={(item: string) => (
          <List.Item
            className={styles.listItem}
            onClick={() => {
              setModuleId(item);
              showDrawer();
              setTransformIndex(0); // init to `__load__`
            }}
          >
            <div>{formatFilepath(item, contextPath)}</div>
            <div>
              {
                transformMap[item]
                  .filter(({ name }) => name !== '__LOAD__')
                  .map(({ name }) => (
                    <Tag key={name} style={{ color: '#707173', borderRadius: 10 }}>{name}</Tag>
                  ))
              }
            </div>
          </List.Item>
        )}
      />

      <Drawer
        title={formatFilepath(moduleId, contextPath)}
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
              renderItem={(item: string, index: number) => {
                const { start, end } = transformMap[moduleId][index];
                return (
                  <List.Item
                    className={styles.listItem}
                    style={transformIndex === index ? { background: '#141414' } : {}}
                    onClick={() => {
                      setTransformIndex(index);
                    }}
                  >
                    {item} <Tag style={{ color: '#bdc3c7', marginLeft: 10 }}>{calcLoaderTimeInterval(start, end)}ms</Tag>
                  </List.Item>
                );
              }}
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
  return end - start;
}

function formatFilepath(filepath: string, context: string) {
  return filepath
    .replace(RegExp(`${context}`), '')
    .replace(RegExp('^/'), './');
}

export function getConfig() {
  return {
    title: 'Inspect Webpack Plugin',
  };
}