import type { WhereFilterOp } from "firebase-admin/firestore";

export interface SearchParam {
  value: any;
  where: WhereFilterOp;
}

export type SearchParams = {
  [key: string]: any | SearchParam | SearchParam[];
};
