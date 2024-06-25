import { ProCard } from '@ant-design/pro-components';
import { Image, Typography } from 'antd';
import { FC, PropsWithChildren } from 'react';
import { useStyles } from './style';

const Wrapper: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  const { styles } = useStyles();

  return (
    <ProCard split="vertical">
      <ProCard colSpan="50%" headerBordered>
        <Typography.Title style={{ textAlign: 'center', marginTop: '0.5em' }}>
          {title}
        </Typography.Title>
        {children}
      </ProCard>
      <ProCard ghost>
        <Image
          className={styles.registerBackground}
          preview={false}
          src="https://assets.codepen.io/3685267/timed-cards-5.jpg"
        ></Image>
      </ProCard>
    </ProCard>
  );
};

export default Wrapper;
