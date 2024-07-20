import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  // url = 'http://localhost:3000';
  url = 'https://jisst-backend.vercel.app'
  constructor(private http: HttpClient, private authService: AuthService) { }

  getData(route) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    };
    return this.http.get(this.url + route, httpOptions);
  }

  updateSubmission(submissionId: string, status: string, reviewFiles: File[] = []) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    };
    const formData: FormData = new FormData();

    formData.append('status', status);
    reviewFiles.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.patch(this.url + '/author/manuscript/' + submissionId, formData, httpOptions);
  }

  submitArticle(formData: FormData) {
    const url = this.url + '/author/manuscript';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    };

    return this.http.post(url, formData, httpOptions);
  }

  uploadFiles(submissionId: String, submittedBy, file: File): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.authService.accessToken
      })
    };
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('submittedBy', submittedBy);
    return this.http.patch(this.url + `/author/manuscript/revision/` + submissionId, formData, httpOptions);
  }

}
