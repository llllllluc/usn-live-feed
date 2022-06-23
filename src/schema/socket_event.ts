export interface SocketEvent {
  block_height: string,
  block_hash: string;
  block_timestamp: string;
  block_epoch_id: string;
  receipt_id: string;
  log_index: number;
  predecessor_id: string;
  account_id: string;
  status: string;
  event: {
    standard: string;
    version: string;
    event: string;
    data: [
      {
        owner_id: string;
        amount: string;
        token_ids: string[];
      }
    ];
  };
}
