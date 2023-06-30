import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { User } from '../domain';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  private token: string = '';
  status: string = {} as string;

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
    Auth.signUp({
      username : user.email,
      password: user.password,
      attributes :{
        email : user.email,
        given_name: user.name,
        family_name: user.surname,
        phone_number: user.telephoneNumber,
        address: user.address,
      }
    }).then(data => {
      console.log("success");
      this.status = "success";
    })
    .catch(error => {
      console.error(error);
      console.log("failure");
      this.status = "failure";
    });

    return new Promise<any>((resolve, reject) => {
      // Perform asynchronous operation
      // For example, make an HTTP request
      fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => {
          // Resolve the Promise with the retrieved data
          resolve(data);
        })
        .catch(error => {
          // Reject the Promise with the encountered error
          reject(error);
        });
    });
  }

  public confirmSignUp(user : User): Promise<any>{
  return Auth.confirmSignUp(user.email, user.code);
  }

  public getUser(): Promise<any>{
    return Auth.currentUserInfo();
  }

  public setToken(): any{ 
    Auth.currentSession()
    .then((session) => {
      // Access the user token
      const idToken = session.getIdToken().getJwtToken();
      this.token = idToken;
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

  public tokenIsPresent() {
    this.setToken();
    return this.token != '';
  }

  public getToken() {
    return this.token;
  }
}
