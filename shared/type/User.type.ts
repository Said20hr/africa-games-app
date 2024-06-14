export interface ILoginResponse {
  casino: Casino;
  user: User;
}

export interface Casino {
  id: number;
  initial_amount: string;
  name: string;
  roulette: any[];
  shift: string;
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
