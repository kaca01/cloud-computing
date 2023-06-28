import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFile } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  public apiUrl = 'https://63fdyvf97k.execute-api.eu-central-1.amazonaws.com/dev'

  uploadFile(file: UploadFile): Observable<UploadFile> {
      return this.http.post<UploadFile>(this.apiUrl + "/upload", file)
  }

  editFile(file: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/edit", file)
  }

  sendVerificationEmail(email: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/sendVerificationEmail', email)
  }

  getDetails(file: string): Observable<any> {
    console.log(this.apiUrl + "/dev/file-details/" + file);
    return this.http.get<any>(this.apiUrl + "/dev/file-details/" + file);
  }
}
