import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { LoginCommand, RegisterCommand, AuthResponseDto } from '../../domain/dtos/auth.dto';
import { parseHttpError } from '../../core/utils/http-error.utils';

// State includes user data AND validation errors for the "Red Border" effect
interface AuthState {
  user: AuthResponseDto | null;
  isLoading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]>;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  validationErrors: {}
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  
  withMethods((store, authService = inject(AuthService)) => ({
    
    // --- LOGIN ACTION ---
    login: rxMethod<LoginCommand>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, validationErrors: {} })),
        switchMap((command) =>
          authService.login(command).pipe(
            tapResponse({
              next: (response) => {
                // 1. Check the 'success' boolean from your ApiResponse
                if (response.success && response.data) {
                  patchState(store, { 
                    user: response.data, 
                    isLoading: false 
                  });
                  localStorage.setItem('token', response.data.token);
                } else {
                  // 2. Handle Logic Errors (e.g. "Invalid Password" from Controller)
                  patchState(store, { 
                    error: response.message || 'Login failed', 
                    isLoading: false 
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                // 3. Handle 400/500 Errors (Middleware Exceptions)
                const errorMsg = parseHttpError(err);
                
                // If the error contains validation details (from your dictionary upgrade)
                const backendErrors = err.error?.validationErrors || {};

                patchState(store, { 
                  error: errorMsg, 
                  validationErrors: backendErrors,
                  isLoading: false 
                });
              },
            })
          )
        )
      )
    ),

    // --- REGISTER ACTION ---
    register: rxMethod<RegisterCommand>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, validationErrors: {} })),
        switchMap((command) =>
          authService.register(command).pipe(
            tapResponse({
              next: (response) => {
                if (response.success && response.data) {
                  patchState(store, { user: response.data, isLoading: false });
                  localStorage.setItem('token', response.data.token);
                } else {
                  patchState(store, { 
                      error: response.message || 'Registration failed', 
                      isLoading: false 
                  });
                }
              },
              error: (err: HttpErrorResponse) => {
                const errorMsg = parseHttpError(err);
                const backendErrors = err.error?.validationErrors || {};
                
                patchState(store, { 
                    error: errorMsg, 
                    validationErrors: backendErrors,
                    isLoading: false 
                });
              },
            })
          )
        )
      )
    ),
    
    resetErrors: () => {
      patchState(store, { error: null, validationErrors: {} });
    },
    
    logout: () => {
      patchState(store, initialState);
      localStorage.removeItem('token');
    }
  }))
);