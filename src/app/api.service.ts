import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5100/api/account'; // URL of your .NET API

  constructor(private http: HttpClient) { }

  // Method to handle login
  login(username: string, password: string): Observable<any> {
    const loginDto = { username, password };
    return this.http.post(`${this.apiUrl}/login`, loginDto);
  }

  // Method to handle registration
  register(username: string, email: string, password: string): Observable<any> {
    const registerDto = { username, email, password };
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }
}
