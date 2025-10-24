// stores/tenantStore.ts
import { create } from 'zustand';
import { tenantApi } from '../endpoints/tenantsEndpoints/tenants';
import type { Tenant, CreateTenantRequest, UpdateTenantRequest, ApiResponse } from '../endpoints/tenantsEndpoints/tenants';
import { useAuthStore } from './authStore';

interface TenantState {
  // State
  tenants: Tenant[];
  currentTenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTenants: () => Promise<void>;
  fetchTenantById: (id: number) => Promise<Tenant | undefined>;
  createTenant: (tenantData: CreateTenantRequest) => Promise<Tenant | undefined>;
  updateTenant: (id: number, tenantData: UpdateTenantRequest) => Promise<Tenant | undefined>;
  deleteTenant: (id: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
}

export const useTenantStore = create<TenantState>((set, get) => ({
  // Initial state
  tenants: [],
  currentTenant: null,
  isLoading: false,
  error: null,

  // Fetch all tenants - UPDATED with correct response handling
  fetchTenants: async () => {
    console.log('🔄 fetchTenants called');
    set({ isLoading: true, error: null });
    try {
      const response = await tenantApi.getAllTenants();
      console.log('📦 API Response:', response);
      
      // Handle the actual response structure with payload
      if (response.resultStatus === "SUCCESSFUL" && response.payloadDto) {
        console.log('✅ Tenants data found in payload:', response.payloadDto);
        set({ 
          tenants: response.payloadDto, 
          isLoading: false,
          error: null
        });
      } else {
        console.warn('⚠️ Unexpected response structure:', response);
        set({ 
          error: response.message || 'Failed to fetch tenants - unexpected response structure', 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('💥 fetchTenants error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tenants';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  // Fetch tenant by ID - UPDATED
  fetchTenantById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantApi.getTenantById(id);
      
      if (response.resultStatus === "SUCCESSFUL" && response.payload) {
        set({ isLoading: false });
        return response.payload;
      } else {
        set({ 
          error: response.message || 'Failed to fetch tenant', 
          isLoading: false 
        });
        return undefined;
      }
    } catch (error) {
      console.error('fetchTenantById error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tenant',
        isLoading: false 
      });
      return undefined;
    }
  },

  // Create new tenant - UPDATED
  createTenant: async (tenantData: CreateTenantRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantApi.createTenant(tenantData);
      
      if (response.resultStatus === "SUCCESSFUL" && response.payload) {
        // Add new tenant to the list
        const { tenants } = get();
        const updatedTenants = [...tenants, response.payload];
        
        set({ 
          tenants: updatedTenants, 
          isLoading: false 
        });
        
        return response.payload;
      } else {
        set({ 
          error: response.message || 'Failed to create tenant', 
          isLoading: false 
        });
        return undefined;
      }
    } catch (error) {
      console.error('createTenant error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create tenant',
        isLoading: false 
      });
      return undefined;
    }
  },

  // Update tenant - UPDATED
  updateTenant: async (id: number, tenantData: UpdateTenantRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantApi.updateTenant(id, tenantData);
      
      if (response.resultStatus === "SUCCESSFUL" && response.payload) {
        // Update tenant in the list
        const { tenants } = get();
        const updatedTenants = tenants.map(tenant => 
          tenant.id === id ? response.payload! : tenant
        );
        
        set({ 
          tenants: updatedTenants,
          currentTenant: response.payload,
          isLoading: false 
        });
        
        return response.payload;
      } else {
        set({ 
          error: response.message || 'Failed to update tenant', //this is the error part
          isLoading: false 
        });
        return undefined;
      }
    } catch (error) {
      console.error('updateTenant error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update tenant',
        isLoading: false 
      });
      return undefined;
    }
  },

  // Delete tenant - UPDATED
  deleteTenant: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tenantApi.deleteTenant(id);
      
      if (response.resultStatus === "SUCCESSFUL") {
        // Remove tenant from the list
        const { tenants, currentTenant } = get();
        const filteredTenants = tenants.filter(tenant => tenant.id !== id);
        
        set({ 
          tenants: filteredTenants,
          isLoading: false 
        });
        
        // Update current tenant if it was deleted
        if (currentTenant?.id === id) {
          set({ currentTenant: null });
        }
        
        // Also update auth store if needed
        const authStore = useAuthStore.getState();
        if (authStore.currentTenant?.id === id) {
          authStore.setCurrentTenant(null);
        }
      } else {
        set({ 
          error: response.message || 'Failed to delete tenant', 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('deleteTenant error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete tenant',
        isLoading: false 
      });
    }
  },

  // Set loading state
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set current tenant
  setCurrentTenant: (tenant: Tenant | null) => {
    set({ currentTenant: tenant });
    
    // Also sync with auth store
    const authStore = useAuthStore.getState();
    authStore.setCurrentTenant(tenant);
  },
}));