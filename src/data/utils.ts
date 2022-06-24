import Big from "big.js";
import { NearConfig } from "./near";
import React from "react";

const MinAccountIdLen = 2;
const MaxAccountIdLen = 64;
const ValidAccountRe = /^(([a-z\d]+[-_])*[a-z\d]+\.)*([a-z\d]+[-_])*[a-z\d]+$/;
export const OneNear = Big(10).pow(24);
export const OneEth = Big(10).pow(18);
const AccountSafetyMargin = OneNear.div(2);

export function accountTrim(accountId: string) {
  return accountId && accountId.length > 14 + 14 + 1
    ? accountId.slice(0, 14) + "…" + accountId.slice(-14)
    : accountId;
}

// const toCamel = (s) => {
//   return s.replace(/([-_][a-z])/gi, ($1) => {
//     return $1.toUpperCase().replace("-", "").replace("_", "");
//   });
// };

// const isArray = function (a) {
//   return Array.isArray(a);
// };

// export const isObject = function (o) {
//   return o === Object(o) && !isArray(o) && typeof o !== "function";
// };

// export const keysToCamel = function (o: object | any[]) {
//   if (isObject(o)) {
//     const n = {};

//     Object.keys(o).forEach((k) => {
//       n[toCamel(k)] = keysToCamel(o[k]);
//     });

//     return n;
//   } else if (isArray(o)) {
//     return o.map((i) => {
//       return keysToCamel(i);
//     });
//   }

//   return o;
// };
