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
  created_at: string;
  email: string;
  id: number;
  is_email_verified: boolean;
  name: string;
  permissions: any[];
  photo: string;
  role: string;
  token: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
