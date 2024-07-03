export interface ILoginResponse {
  user: User;
  casino: Casino;
  check_in: string;
  check_out: string;
  submitted_yesterday: boolean;
  keys: KeysCheck[];
}

export interface KeysCheck {
  identifier: string;
  terminal_id: number;
  key_in_end: string;
  key_out_end: string;
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
  token: string;
}

export interface Casino {
  id: number;
  name: string;
  shift: string;
  initial_amount: string;
  longitude: string;
  latitude: string;
  hasRoulette: boolean;
  roulettes: Roulette[];
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

export interface ILoginPayload {
  matricule: string;
  password: string;
}
