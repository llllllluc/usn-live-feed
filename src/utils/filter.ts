import { Filter } from "../schema/filter";

export const getNoEventFilter = (accountId = "usn"): Filter => {
  return {
    status: "SUCCESS",
    account_id: accountId,
    event: {
      standard: "nep141",
      event: "",
    },
  };
};

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
  if (filter.event.event === "ft_transfer") {
    filter.event.data = [{ old_owner_id: userId }];
  } else {
    filter.event.data = [{ owner_id: userId }];
  }
  // return filter;
};

export const addEventToFilter = (filter: Filter, event: string) => {
  filter.event.event = event;
};
