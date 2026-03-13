const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export async function createTerm(data: { name: string; definition: string; imageUrl: string | null }): Promise<any> {
  const response = await fetch(`${API_URL}/api/terms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create term');
  }
  return response.json();
}

export async function updateTerm(id: string, data: { name: string; definition: string; imageUrl: string | null }): Promise<any> {
  const response = await fetch(`${API_URL}/api/terms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update term');
  }
  return response.json();
}

export async function deleteTerm(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/terms/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete term');
  }
}