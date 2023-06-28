import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFile } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://3z9beer3v0.execute-api.eu-central-1.amazonaws.com';
  private stagePath = '/dev';
  private resourcePath = '/dogs';

  private url = this.apiUrl + this.stagePath + this.resourcePath;

  uploadFile(file: UploadFile): Observable<UploadFile> {
      return this.http.post<UploadFile>(this.url, file)
  }

  addPeople(body: any): Observable<any> {
    return this.http.put<any>("https://3z9beer3v0.execute-api.eu-central-1.amazonaws.com/dev/addPermission", body)
  }
}
