interface Asset extends Record<string, any> {
  id: number;
  name: string;
  contact: number;
  email: string;
  company_name: string;
}

type GetAllAssetResponse = Asset[];

type SearchForEmployeeResponse = {
  error?: string | undefined;
  result: [any, string][];
};
