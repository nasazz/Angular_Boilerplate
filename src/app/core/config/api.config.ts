import { environment } from "../../../environments/environment";

export const API_CONFIG = {
  // This pulls 'https://localhost:7266/api' from environment file
  baseUrl: environment.apiUrl, 
  
  endpoints: {
    auth: {
      // Result: https://localhost:7266/api/auth/login
      login: '/auth/login',
      
      // Result: https://localhost:7266/api/auth/register
      register: '/auth/register'
    },
    // Future placeholders based on your HireFlow domain
    users: {
      getAll: '/users',
      getById: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`
    },
    jobs: {
        getAll: '/jobs',
        getById: (id: string) => `/jobs/${id}`,
        apply: (id: string) => `/jobs/${id}/apply`
    }
  }
};