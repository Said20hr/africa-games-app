export interface ILoginResponse {
  casino: Casino;
  user: User;
}

export interface Casino {
  id: number;
  name: string;
  shift: string;
  initial_amount: string;
  roulettes: Roulette[];
  hasRoulette: boolean;
  last_operation: Date | null;
}

export interface Roulette {
  id: number;
  identifier: string;
  type: string;
  casino_id: number;
  key_in: string;
  key_out: string;
  money_in: string;
  total_key_in: string;
  total_key_out: string;
  total_money_in: string;
  created_at: string;
  updated_at: string;
  diff_key: number;
  diff_total_key: number;
  status: boolean;
  inactive_days: number;
}

export interface User {
  id: number;
  matricule: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  insurance_number: string;
  service: string;
  position: string;
  birth_date: string;
  hire_date: string;
  category_level: string;
  marital_status: string;
  number_of_children: number;
  status: string;
  phone: string;
  base_salary: string;
  position_bonus: string;
  dip: string;
  bank: string;
  account_number: string;
  photo_access: any;
  nationality: string;
  created_at: string;
  role: string;
  permissions: any[];
  token: string;
}

export interface ILoginPayload {
  matricule: string;
  password: string;
}
