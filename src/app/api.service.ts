import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5100/api'; // URL of your .NET API

  constructor(private http: HttpClient) {}

  // Method to handle login
  login(username: string, password: string): Observable<any> {
    const loginDto = { username, password };
    return this.http.post(`${this.apiUrl}/account/login`, loginDto, {
      withCredentials: true,
    });
  }
  register(username: string, email: string, password: string): Observable<any> {
    const registerDto = { username, email, password };
    return this.http.post(`${this.apiUrl}/account/register`, registerDto, {
      withCredentials: true,
    });
  }

  // Get all media with credentials
  getAllMedia(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Media/getAllMedia`, {
      withCredentials: true,
    });
  }
  // Get media by ID
  getMediaById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Media/getMediaById?id=${id}`, {
      withCredentials: true,
    });
  }
  // Add new media
  addMedia(media: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Media/addMedia`, media, {
      withCredentials: true,
    });
  }

  // Delete media by ID
  deleteMedia(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Media/deleteById?id=${id}`, {
      withCredentials: true,
    });
  }
  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Media/deleteUser`, {
      withCredentials: true,
    });
  }
}
