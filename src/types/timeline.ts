export type Activity = {
  name: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  province?: string;
  city: string;
  address: string;
  url?: string;
  roomStatus?: RoomStatue;
};
export enum Statue {
  Plan = 'plan',
  Ongoing = 'ongoing',
  Ended = 'ended',
}
export const statueText: Record<Statue, string> = {
  [Statue.Plan]: '计划中',
  [Statue.Ongoing]: '进行中',
  [Statue.Ended]: '已结束',
} as const;
export enum RoomStatue {
  FindingRoommate = 'finding-roommate',
  FindingRoom = 'finding-room',
}
export const roomStatueText: Record<RoomStatue, string> = {
  [RoomStatue.FindingRoommate]: '寻找室友',
  [RoomStatue.FindingRoom]: '寻找房间',
} as const;
