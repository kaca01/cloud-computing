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
      phone_number: user.telephoneNumber,
      address: user.address,
    }
  })
  }

  public signUpWithoutVerification(user: User): Promise<any> {
    return Auth.signUp({
      username : user.email,
      password: user.password,
      attributes :{
        email : user.email,
        given_name: user.name,
        family_name: user.surname,
        phone_number: user.telephoneNumber,
        address: user.address,
        email_verified: true
      }
    })
    }

  public confirmSignUp(user : User): Promise<any>{
  return Auth.confirmSignUp(user.email, user.code);
  }

  public getUser(): Promise<any>{
    return Auth.currentUserInfo();
  }

  public getToken(): any{ 
    Auth.currentSession()
    .then((session) => {
      // Access the user token
      const idToken = session.getIdToken().getJwtToken();
      console.log('User token:', idToken);
      return idToken;
    })
    .catch((error) => {
      console.log('Error:', error);
      return null;
    });
  }

  public signIn(user:User): Promise<any>{
    return Auth.signIn(user.email, user.password);
  }

  public signOut(): Promise<any>{
    return Auth.signOut();
  }
}
