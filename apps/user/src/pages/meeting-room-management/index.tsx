import {
  MeetingRoom,
  createMeetingRoom,
  deleteMeetingRoom,
  getMeetingRoomList,
  updateMeetingRoom,
} from '@/services';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';

const bookedStatus = new Map([
  [
    0,
    {
      text: '未预定',
      status: 'Success',
    },
  ],
  [
    1,
    {
      text: '已预定',
      status: 'Error',
    },
  ],
]);

const MeetingRoomManagement = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<MeetingRoom>();
  const [selectedRowsState, setSelectedRows] = useState<MeetingRoom[]>([]);

  const columns: ProColumns<MeetingRoom>[] = [
    {
      title: '名称',
      dataIndex: 'name',
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
      title: '容纳人数',
      dataIndex: 'capacity',
    },
    {
      title: '会议室位置',
      hideInSearch: true,
      dataIndex: 'location',
    },
    {
      title: '会议室设备',
      dataIndex: 'equipment',
    },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '注册时间',
      hideInSearch: true,
      dataIndex: 'createTime',
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: '上次更新时间',
      hideInSearch: true,
      dataIndex: 'updateTime',
      hideInForm: true,
      valueType: 'dateTime',
    },
    {
      title: '预定状态',
      hideInSearch: true,
      dataIndex: 'isBooked',
      hideInForm: true,
      valueEnum: bookedStatus,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => (
        <>
          <a
            key="editable1"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="删除确认"
            description="删除会议室后将不可恢复，是否确认删除?"
            onConfirm={async () => {
              const res = await deleteMeetingRoom({ id: record.id });
              if (res.code === 1) {
                message.success('删除成功');
                action?.reload();
              }
            }}
            okText="删除"
            cancelText="确认"
          >
            <a key="delete">删除</a>
          </Popconfirm>

          {/* <a
            onClick={() =>
              runFreeze({ id: record.id, freeze: Number(!record.isFrozen) })
            }
          >
            {record.isFrozen ? '解冻' : '冻结'}
          </a> */}
        </>
      ),
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '会议室管理',
      }}
    >
      <ProTable<MeetingRoom>
        rowKey="id"
        headerTitle="查询表格"
        actionRef={actionRef}
        editable={{
          // defaultDom = {save,cancel,delete} 可以酌情添加和使用
          onSave: async (key, row) => {
            const res = await updateMeetingRoom(row);
            if (res.code === 1) {
              message.success('更新成功');
            }
          },
          actionRender: (row, config, defaultDom) => {
            return [defaultDom.save, defaultDom.cancel];
          },
        }}
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
          const { data, code } = await getMeetingRoomList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.meetingRooms || [],
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
        <ProTable<MeetingRoom, MeetingRoom>
          onSubmit={async (value) => {
            const res = await createMeetingRoom(value);
            if (res.code === 1) {
              message.success('创建会议室成功');
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

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<MeetingRoom>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MeetingRoomManagement;
