import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Folder } from '../domain';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  constructor(private http: HttpClient) { }

  public url = 'https://0n5qvfuh5m.execute-api.eu-central-1.amazonaws.com/dev/';
  private methodCreate = 'create-folder';
  private methodGet = 'content';

  createFolder(file: any): Observable<any> {
    console.log(file);
    return this.http.post<any>(this.url + this.methodCreate, file);
  }

  getContent(folder: string): Observable<any> {
    return this.http.get<any>(this.url + this.methodGet + '/' + folder);
  }
}
