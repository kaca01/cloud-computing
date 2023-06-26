import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  private url = 'https://t9pgzw2u4d.execute-api.eu-central-1.amazonaws.com/dev/create-folder';

  createFolder(file: any): Observable<any> {
    console.log(file);
      return this.http.post<Folder>(this.url, file)
  }
}
