interface Asset extends Record<string, any> {
  id: number;
  name: string;
  contact: number;
  email: string;
  company_name: string;
}

type GetAllAssetResponse = Asset[];

interface Lead extends Record<string, any> {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_contact: number;
  created_at: string;
  status: string;
  customer: number;
}

type getAllLeadResponse = Lead[];

type SearchForEmployeeResponse = {
  error?: string | undefined;
  result: [any, string][];
};
