import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor() {
    Amplify.configure({
      Auth:environment.cognito
    })
   }

   public signUp(user: User): Promise<any> {
    return Auth.signUp({
      username : user.email,
      password: user.password,
      attributes :{
        email : user.email,
        given_name: user.name,
        family_name: user.surname,
        phone: user.phone,
        birthdate: user.birthdate,
      }
    })
   }

   public confirmSignUp(user : User): Promise<any>{
    return Auth.confirmSignUp(user.email, user.code);
   }
}
