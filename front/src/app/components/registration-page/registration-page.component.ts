import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  registrationForm= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    repeatPassword: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    address: new FormControl('', [Validators.required]),
  
  }) ;

  hide : boolean = true;
  hideAgain : boolean = true;
  notification!: DisplayMessage;

  user: User | undefined;
  isConfirm: boolean = false;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
  }

  public signUpWithCognito(){
    //todo check password and repeat password
    //todo check password characters
    
    this.setUserData();
    console.log(this.user);

    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.isConfirm = true;
      })
      .catch((error:any) => {
        console.log(error.message);
        //todo display error.message
      })
    }
    else{
      // todo "Missing data"
    }
  }

  private setUserData(){
    this.user!.email = this.registrationForm.get('email')?.value!;
    this.user!.password = this.registrationForm.get('password')?.value!;
    this.user!.telephoneNumber = this.registrationForm.get('telephoneNumber')?.value!;
    this.user!.address = this.registrationForm.get('address')?.value!;
    this.user!.name = this.registrationForm.get('name')?.value!;
    this.user!.surname = this.registrationForm.get('surname')?.value!;
    this.user!.code = "";
  }

  public confirmSignUp(){
    if (this.user){
      this.cognitoService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/login'])
        //todo display that account has been successfully created
      })
      .catch((error: any) => {
        console.log(error.message);
        //todo display error.message
      })
    }
    else{
      // todo "Missing user information"
    }
  }

  login() {
    this.router.navigate(['login']);
  }

}

interface DisplayMessage {
  msgType: string;
  msgBody: string;

}
