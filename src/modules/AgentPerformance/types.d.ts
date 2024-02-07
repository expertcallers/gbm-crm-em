interface Asset extends Record<string, any> {
    id: number;
    created_by_emp_id: number;
    created_by_name: string;
    serial_number: string;
    asset_category: string;
    model: string;
    os: string;
    created_at: Date;
    created_by: string;
    brand: string;
    system_name: string;
    processor: string;
    ram: string;
    hard_disk_type: string;
    hard_disk_serial_no: string;
    hard_disk_size: number;
    monitor_brand: string;
    monitor_serial_no: string;
    monitor_size: number;
    keyboard: string;
    mouse: string;
    webcam: string;
    status: string;
    notes: string;
    assigned_to: string;
    assigned_to_name: string;
    assigned_to_emp_id: string;
  }
  
  type GetAllAssetResponse = {
    details?: string;
    count: number;
    results: Asset[];
  };
  
  type SearchForAssetCategoryResponse = {
    error?: string | undefined;
    result: string[] | any;
  };
  
  type GetAssetHistory = {
    details?: string;
    count: number;
    results: {
      id: number;
      asset: number;
      created_at: string;
      created_by_emp_id: string;
      created_by_name: string;
      message: string;
      transaction: string;
    }[];
  };
  
  type GetAllAssetAllocationResponse = {
    details?: string;
    count: number;
    results: AssetAllocation[];
  };
  
  type AssetAllocation = {
    id: number;
    asset: number;
    serial_number: string;
    asset_category: string;
    assigned_at: string;
    assigned_by: number;
    assigned_by_emp_id: string;
    assigned_by_name: string;
    assigned_to_name: string;
    assigned_to_emp_id: string;
    docs: {
      created_at: string;
      id: number;
      name: string;
      path: string;
      uploaded_by_emp_id: string;
      uploaded_by_name: string;
    }[];
    docs_type: string;
    docs_uid: string;
    it_policy: string;
    policy_number: string;
    status: string;
    return_comment: string;
    returned_at: string;
    updated_at: string;
  };
  
  type SearchForEmployeeResponse = {
    error?: string | undefined;
    result: [any, string][];
  };