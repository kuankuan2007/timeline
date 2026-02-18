export type Activity = {
  name: string;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  province?: string;
  city: string;
  address: string;
  url?: string;
  plan?: Plan;
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
export enum Plan {
  FindingRoommate = 'finding-roommate',
  FindingRoom = 'finding-room',
  Pending = 'pending',
  WaitingTicketSales = 'waiting-ticket-sales',
}
export const roomStatueText: Record<Plan, string> = {
  [Plan.FindingRoommate]: '寻找室友',
  [Plan.FindingRoom]: '寻找房间',
  [Plan.Pending]: '待定',
  [Plan.WaitingTicketSales]: '等待开票',
} as const;
