import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFile } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://4r5ozjinp0.execute-api.eu-central-1.amazonaws.com/dev';

  uploadFile(file: UploadFile): Observable<UploadFile> {
      return this.http.post<UploadFile>(this.apiUrl + '/upload', file)
  }

  sendVerificationEmail(email: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/sendVerificationEmail', email)
  }
}
