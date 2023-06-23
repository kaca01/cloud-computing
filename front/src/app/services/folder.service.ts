import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'https://ucflzlff97.execute-api.eu-central-1.amazonaws.com';
  private stagePath = '/dev';
  private resourcePath = '/create-folder';

  private url = this.apiUrl + this.stagePath + this.resourcePath;

  uploadFile(file: Folder): Observable<Folder> {
      return this.http.post<Folder>(this.url, file)
  }
}
