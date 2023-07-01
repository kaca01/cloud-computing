import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFile } from '../domain';
import { CognitoService } from './cognito.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient, private cognitoService: CognitoService) { }

  public apiUrl = 'https://whrd6fl7ml.execute-api.eu-central-1.amazonaws.com/dev'
  public permissionUrl = "https://whrd6fl7ml.execute-api.eu-central-1.amazonaws.com/dev";

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
    console.log(this.apiUrl + "/file-details/" + file);
    return this.http.get<any>(this.apiUrl + "/file-details/" + file);
  }

  addPeople(body: any): Observable<any> {
    return this.http.put<any>(this.permissionUrl + "/addPermission", body)
  }
}
