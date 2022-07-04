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

export const bigToString = (b: Big) => {
  let s = b.toFixed();
  let pos = s.indexOf(".");
  let p = 6;
  let len = 7;
  if (pos > 0) {
    let ap = Math.min(p, Math.max(len - pos, 0));
    if (ap > 0) {
      ap += 1;
    }
    if (pos + ap < s.length) {
      s = s.substring(0, pos + ap);
    }
  } else {
    pos = s.length;
  }
  for (let i = pos - 4; i >= 0; i -= 3) {
    s = s.slice(0, i + 1) + "," + s.slice(i + 1);
  }

  if (s === "0.000000" && p === 6 && len === 7) {
    return "<0.000001";
  }

  return s;
};
