import { MeetingRoom, getMeetingRoomList, updateMeetingRoom } from '@/services';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Drawer, message } from 'antd';
import { useRef, useState } from 'react';

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

const MeetingRoomReserve = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<MeetingRoom>();

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
      render: () => <a key="reserve">预定</a>,
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: '会议室预定',
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
      />

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

export default MeetingRoomReserve;
