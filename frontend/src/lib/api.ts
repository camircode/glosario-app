const isServer = typeof window === 'undefined';

export const API_URL = isServer
  ? (process.env.API_URL_INTERNAL || 'http://backend:3000')
  : (import.meta.env.PUBLIC_API_URL || 'http://localhost:3000');

export interface Term {
  id: string;
  name: string;
  definition: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getTerms(): Promise<Term[]> {
  const response = await fetch(`${API_URL}/api/terms`);
  if (!response.ok) {
    throw new Error('Failed to fetch terms');
  }
  return response.json();
}

export async function getTerm(id: string): Promise<Term> {
  const response = await fetch(`${API_URL}/api/terms/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch term');
  }
  return response.json();
}