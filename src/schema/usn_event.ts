export interface UsnEvent {
  time: Date;
  event: string;
  index: number;
  owner_id: string;
  amount: string;
}
