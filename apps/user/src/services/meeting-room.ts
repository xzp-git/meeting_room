import { request } from '@umijs/max';
import { HttpBaseResponse } from './user';

export interface MeetingRoom {
  id: number;

  name: string;

  capacity: number;

  location: string;

  equipment: string;

  description: string;

  isBooked: boolean;

  createTime: Date;

  updateTime: Date;
}

export interface GetMeetingRoomListReq {
  pageNo: number;
  pageSize: number;
  name?: string;
  capacity?: number;
  equipment?: string;
}

export async function getMeetingRoomList(
  params: GetMeetingRoomListReq,
  options?: { [key: string]: any },
) {
  return request<
    HttpBaseResponse<{ meetingRooms: MeetingRoom[]; total: number }>
  >('/api/v1/meeting-room/list', {
    params,
    method: 'GET',
    ...(options || {}),
  });
}

export async function createMeetingRoom(
  data: Partial<MeetingRoom>,
  options?: { [key: string]: any },
) {
  return request<HttpBaseResponse<MeetingRoom>>('/api/v1/meeting-room/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateMeetingRoom(
  data: Partial<MeetingRoom>,
  options?: { [key: string]: any },
) {
  return request<HttpBaseResponse<MeetingRoom>>('/api/v1/meeting-room/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function findOne(
  params: { id: number },
  options?: { [key: string]: any },
) {
  return request<HttpBaseResponse<MeetingRoom>>(
    `/api/v1/meeting-room/${params.id}`,
    {
      method: 'GET',
      ...(options || {}),
    },
  );
}

export async function deleteMeetingRoom(
  params: { id: number },
  options?: { [key: string]: any },
) {
  return request<HttpBaseResponse>(`/api/v1/meeting-room/${params.id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
