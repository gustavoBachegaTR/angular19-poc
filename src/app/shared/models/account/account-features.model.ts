export interface AccountFeature {
  id: number;
  displayName: string;
  status: string;
  ofs?: { name: string };
  isVisible: boolean;
}
