import { Filter } from "../schema/filter";

export const getFtMintFilter = (accountId = "usn"): Filter => {
  return {
    status: "SUCCESS",
    account_id: accountId,
    event: {
      standard: "nep141",
      event: "ft_mint",
    },
  };
};

export const getFtBurnFilter = (accountId = "usn"): Filter => {
  return {
    status: "SUCCESS",
    account_id: accountId,
    event: {
      standard: "nep141",
      event: "ft_burn",
    },
  };
};

export const addUserIdToFilter = (filter: Filter, userId: string) => {
  filter.event.data = [{ owner_id: userId }];
  return filter;
};
