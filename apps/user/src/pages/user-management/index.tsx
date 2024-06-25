import { UserInfo, freezeUser, queryUserList } from '@/services';
import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Avatar, Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const { addUser, modifyUser } = services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<UserInfo[]>([]);
  const { run: runFreeze } = useRequest(
    async (val) => {
      const res = await freezeUser(val);
      if (res.code === 1) {
        message.success(val.freeze ? '冻结成功' : '解冻成功');
        actionRef.current?.reload();
      }
    },
    {
      manual: true,
    },
  );

  const columns: ProColumns<UserInfo>[] = [
    {
      title: '用户名',
      dataIndex: 'username',

      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (_, record) => {
        return record.avatar ? (
          <Avatar src={`http://localhost:3001/${record.avatar}`} />
        ) : (
          _
        );
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'isFrozen',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未冻结',
          status: 'Success',
        },
        1: {
          text: '已冻结',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a
            onClick={() =>
              runFreeze({ id: record.id, freeze: Number(!record.isFrozen) })
            }
          >
            {record.isFrozen ? '解冻' : '冻结'}
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '用户管理',
      }}
    >
      <ProTable<UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, code } = await queryUserList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.users || [],
            success: code === 1,
            total: data?.total || 0,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<UserInfo, UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.username && (
          <ProDescriptions<UserInfo>
            column={2}
            title={row?.username}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.username,
            }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
