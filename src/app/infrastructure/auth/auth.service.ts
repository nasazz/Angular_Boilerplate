import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthResponseDto, LoginCommand, RegisterCommand } from '../../domain/dtos/auth.dto';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../core/config/api.config';
import { ApiResponse } from '../../core/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(command : LoginCommand) : Observable<ApiResponse<AuthResponseDto>>{
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.login}`;

    return this.http.post<ApiResponse<AuthResponseDto>>(url,command);
  }

register(command: RegisterCommand): Observable<ApiResponse<AuthResponseDto>> {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.auth.register}`;
    return this.http.post<ApiResponse<AuthResponseDto>>(url, command);
  }

}
