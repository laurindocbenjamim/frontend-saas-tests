import { User, Log, Product, Service, IRSSubmission } from '../types';

const API_BASE = '/api';

export const api = {
  auth: {
    login: async (credentials: any) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    }
  },
  users: {
    getAll: async () => (await fetch(`${API_BASE}/users`)).json(),
    create: async (data: Partial<User>) => {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return res.json();
    },
    update: async (id: string, data: Partial<User>) => {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update user');
      }
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
    }
  },
  logs: {
    getAll: async () => (await fetch(`${API_BASE}/logs`)).json(),
    create: async (data: any) => {
      const res = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    }
  },
  products: {
    getAll: async () => (await fetch(`${API_BASE}/products`)).json(),
    create: async (data: Partial<Product>) => {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    }
  },
  services: {
    getAll: async () => (await fetch(`${API_BASE}/services`)).json(),
    create: async (data: Partial<Service>) => {
      const res = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    }
  },
  irs: {
    submit: async (data: any) => {
      const res = await fetch(`${API_BASE}/irs-submission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    }
  }
};
