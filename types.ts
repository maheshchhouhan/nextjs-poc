export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

export interface Credentials {
  email?: string;
  password?: string;
}