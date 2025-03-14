export interface AccountExt {
  accountType: string;
  [key: string]: any;
}

export interface SourceInfo {
  id: number;
  description?: string;
  notes?: string | null;
}

export interface Group {
  id: number;
}

export interface Status {
  id: number;
  code: number;
  description: string;
}

export interface Account {
  id: string;
  accountCrossReference: string | null;
  accountDomains: any[];
  accountExt: AccountExt | null;
  accountExtInfo: any | null;
  authorizationCode: string | null;
  firmName: string;
  groups: Group[];
  name: string;
  notes: string | null;
  riaCustomerNumber: string;
  sapCustomerNumber: string | null;
  sourceInfos: SourceInfo[];
  startDate: string;
  status: Status;
  siteAdmin: string;
  sourceInfo: string;
  totalOrders: number;
  totalUsers: number;
  supportsIpOverrideToken: boolean | null;
}
