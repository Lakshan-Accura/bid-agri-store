import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenUtils, authApi } from '../endpoints/loginEndpoints/login';
import type { Tenant } from '../endpoints/tenantsEndpoints/tenants';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentTenant: (tenant: Tenant | null) => void;
  setAvailableTenants: (tenants: Tenant[]) => void;
  hasSuperAdminRole: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      currentTenant: null,
      availableTenants: [],

      // Login action with SUPER_ADMIN validation
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({
            userName: email,
            password: password
          });
          
          const decodedToken = tokenUtils.getDecodedToken();
          
          if (decodedToken) {
            // Check if user has SUPER_ADMIN role
            const hasSuperAdmin = decodedToken.roles?.includes('SUPER_ADMIN');
            
            if (!hasSuperAdmin) {
              // Clear tokens and throw error if not SUPER_ADMIN
              tokenUtils.clearTokens();
              set({ 
                isLoading: false,
                user: null,
                isAuthenticated: false
              });
              throw new Error('Access denied. Only users with SUPER_ADMIN role are allowed to login.');
            }

            set({
              user: {
                id: decodedToken.sub,
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                roles: decodedToken.roles,
              },
              isAuthenticated: true,
              isLoading: false,
            });

            // After login, you can fetch user's tenants here if needed
            // await get().fetchUserTenants();
          }
        } catch (error) {
          set({ 
            isLoading: false,
            user: null,
            isAuthenticated: false
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        tokenUtils.clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          currentTenant: null,
          availableTenants: [],
        });
      },

      // Check authentication status with SUPER_ADMIN validation
      checkAuth: () => {
        set({ isLoading: true });
        
        const isValid = tokenUtils.isTokenValid();
        const decodedToken = tokenUtils.getDecodedToken();
        
        if (isValid && decodedToken) {
          // Check if user has SUPER_ADMIN role
          const hasSuperAdmin = decodedToken.roles?.includes('SUPER_ADMIN');
          
          if (hasSuperAdmin) {
            set({
              user: {
                id: decodedToken.sub,
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
                roles: decodedToken.roles,
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Clear tokens and logout if user doesn't have SUPER_ADMIN role
            tokenUtils.clearTokens();
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              currentTenant: null,
              availableTenants: [],
            });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            currentTenant: null,
            availableTenants: [],
          });
        }
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      // Set current tenant
      setCurrentTenant: (tenant: Tenant | null) => {
        set({ currentTenant: tenant });
        // You can also store the selected tenant in localStorage if needed
        if (tenant) {
          localStorage.setItem('currentTenant', JSON.stringify(tenant));
        } else {
          localStorage.removeItem('currentTenant');
        }
      },

      // Set available tenants
      setAvailableTenants: (tenants: Tenant[]) => {
        set({ availableTenants: tenants });
      },

      // Check if current user has SUPER_ADMIN role
      hasSuperAdminRole: () => {
        const { user } = get();
        return user?.roles?.includes('SUPER_ADMIN') || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        currentTenant: state.currentTenant,
        availableTenants: state.availableTenants,
      }),
    }
  )
);