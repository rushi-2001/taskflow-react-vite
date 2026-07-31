export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthCredentials {
  email: string;
  password: string;
}
