export interface User {
  name: string;
}

export interface Message {
  from: string;
  to?: string;
  content: string;
}