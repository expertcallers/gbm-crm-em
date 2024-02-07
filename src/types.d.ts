type User = {
  name: string;
  emp_id: string;
  department: number;
  designation: string;
  department_name: string;
  profile_image: string;
  base_team: string;
  team: string;
  my_team: [string, string][];
  gender: string;
};

type EmptyResponse = {
  error?: ResponseError;
  message?: string;
  resign_id?: any;
};
