import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) { }

  upload(file: File, targetLang: string, options: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetLang', targetLang);

    if (options && Object.keys(options).length > 0) {
      formData.append('options', JSON.stringify(options));
    }

    return this.http.post(`${this.baseUrl}/upload`, formData);
  }

  getJob(jobId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/job/${jobId}`);
  }

  getDownload(jobId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/job/${jobId}/download`);
  }
}
