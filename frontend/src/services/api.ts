import { CreateClassDTO } from '@/types';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiCall = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('classhub_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi gọi API');
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => 
    apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => 
    apiCall('/auth/me')
};

export const classAPI = {
  getAll: () => 
    apiCall<{ success: boolean; classes: any[] }>('/classes'),
  getById: (id: string) => 
    apiCall<{ success: boolean; class: any }>(`/classes/${id}`),
  create: (classData: CreateClassDTO) => 
    apiCall<{ success: boolean; class: any }>('/classes/create', { method: 'POST', body: JSON.stringify(classData) }),
  join: (code: string) => 
    apiCall<{ success: boolean; message: string; class: any }>('/classes/join', { method: 'POST', body: JSON.stringify({ code }) })
};

export const assignmentAPI = {
  getByClass: (classId: string) => 
    apiCall(`/assignments/class/${classId}`),
  create: (assignmentData: any) => 
    apiCall('/assignments/create', { method: 'POST', body: JSON.stringify(assignmentData) }),
  submit: (submissionData: any) => 
    apiCall('/assignments/submit', { method: 'POST', body: JSON.stringify(submissionData) })
};
