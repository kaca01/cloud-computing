import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  hide: boolean = true;
  submitted = false;
  notification!: DisplayMessage;

  user: User | undefined;

  constructor(private router : Router, private cognitoService : CognitoService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void { 
    this.user = {} as User;
  }

  login(): void { 
    this.user!.email = this.loginForm.get('email')?.value!;
    this.user!.password = this.loginForm.get('password')?.value!;

    if (this.user && this.user.email && this.user.password){
      this.openSnackBar("Loading...");
      this.cognitoService.signIn(this.user)
      .then(() => {
        this.notification;
        this.submitted = true;
        this.router.navigate(['documents']);
      })
      .catch((error:any) => {
        console.log(error.message);
        this.notification = {msgType: 'error', msgBody: 'Incorrect username or password'};
      })
    }
    else{
      this.submitted = false;
      this.notification = {msgType: 'error', msgBody: 'Incorrect username or password'};
    }
  } 
  
  private openSnackBar(snackMsg : string) : void {
    this._snackBar.open(snackMsg, "Dismiss", {
      duration: 2000
    });
  }
}

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}
