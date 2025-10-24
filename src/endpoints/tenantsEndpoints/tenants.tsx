import { tokenUtils } from '../loginEndpoints/login';

// Tenant Interfaces
export interface Tenant {
  id?: number;
  tenantCode: string;
  tenantName: string;
  enabled: boolean;
}

export interface CreateTenantRequest {
  tenantCode: string;
  tenantName: string;
  enabled: boolean;
}

export interface UpdateTenantRequest {
  id: number;
  tenantCode: string;
  tenantName: string;
  enabled: boolean;
}

// Add Tenant Admin Interfaces
export interface CreateTenantAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  tempPassword: string;
  matchingPassword: string;
  tenantDTO: {
    id: number;
  };
  roleDTOs: Array<{
    id: number;
  }>;
}

export interface ApiResponse<T = any> {
  payload?: T;
  payloadDto?: T;
  message?: string;
  status?: number;
  success?: boolean;
  resultStatus?: string;
  httpStatus?: string;
  httpCode?: string;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  size?: number;
  number?: number;
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements?: number;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = tokenUtils.getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Tenant API endpoints
export const tenantApi = {
  // 🧩 GET /tenants (get all tenants)
  async getAllTenants(): Promise<ApiResponse<Tenant[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenants`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get tenants failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get tenants API call failed:', error);
      throw error;
    }
  },

  // 🧩 GET /tenant/{id} (get tenant by ID)
  async getTenantById(id: number): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenant/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Get tenant failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get tenant API call failed:', error);
      throw error;
    }
  },

  // 🧩 POST /tenant (create new tenant)
  async createTenant(tenantData: CreateTenantRequest): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenant`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(tenantData),
      });

      if (!response.ok) {
        throw new Error(`Create tenant failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create tenant API call failed:', error);
      throw error;
    }
  },

  // 🧩 PUT /tenant/{id} (update tenant)
  async updateTenant(id: number, tenantData: UpdateTenantRequest): Promise<ApiResponse<Tenant>> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenant/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(tenantData),
      });

      if (!response.ok) {
        throw new Error(`Update tenant failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update tenant API call failed:', error);
      throw error;
    }
  },

  // 🧩 DELETE /tenant/{id} (delete tenant)
  async deleteTenant(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/tenant/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Delete tenant failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete tenant API call failed:', error);
      throw error;
    }
  },

  // 🧩 POST /api/v1/user/register (create new tenant admin user)
  async createTenantAdmin(userData: CreateTenantAdminRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Create tenant admin failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create tenant admin API call failed:', error);
      throw error;
    }
  },

   async resendVerificationToken(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/resendVerifyToken?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Resend verification failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resend verification API call failed:', error);
      throw error;
    }
  },
};