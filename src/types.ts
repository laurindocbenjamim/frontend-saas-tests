export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface Log {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export interface IRSSubmission {
  id: string;
  subjectA: {
    name: string;
    nif: string;
    incapacity: string;
  };
  civilStatus: string;
  submittedAt: string;
}
