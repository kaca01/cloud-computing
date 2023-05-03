import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  user:User | undefined;

  constructor(private router : Router, private cognitoService : CognitoService) {}

  ngOnInit(): void { 
    this.user = {} as User;
  }

  login(): void { 
    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signIn(this.user)
      .then(() => {
        this.notification;
        this.submitted = true;
        this.router.navigate(['test-page']);
      })
      .catch((error:any) => {
        //todo display error.message through notification!
      })
    }
    else{
      //todo display "Please enter a valid email address and password!"
    }
  } 
}

interface DisplayMessage {
  msgType: string;
  msgBody: string;
}
