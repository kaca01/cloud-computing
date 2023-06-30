import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public url = 'https://j98v559zri.execute-api.eu-central-1.amazonaws.com/dev/';

  familyMemberSignup(user: any): Observable<any> {
    return this.http.put<any>( this.url+'familyMemberSignup', user);
  }

  getFamilyMember(email: string): Observable<any> {
    return this.http.get<any>(this.url + 'getFamilyMember/' + email);
  }

  inviteMember(user: any): Observable<any> {
    return this.http.put<any>( this.url+'inviteMember', user);
  }
}
