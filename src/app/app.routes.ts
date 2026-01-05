import { Routes } from '@angular/router';

export const routes: Routes = [
// 1. The default route (Fixes the blank page)
  { 
    path: '', 
    redirectTo: 'auth/login', 
    pathMatch: 'full' 
  },
  
  // 2. Your existing Login route
  // Make sure the path string matches your actual file name!
  // If your file is "login.component.ts", the import should usually be:
  // import('./features/auth/login/login.component')
  { 
    path: 'auth/login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) 
  }
];
