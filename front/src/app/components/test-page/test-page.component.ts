import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.css']
})
export class TestPageComponent implements OnInit {

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails(){
    this.cognitoService.getUser()
    .then((user: any) => {
      if (user){
        // loged in
        console.log(user);
      }
      else{
        // if not logged in, send user to login
        this.router.navigate(['/welcome-page']);
      }
    })
  }

  signOutWithCognito(){
    this.cognitoService.signOut()
    .then((user: any) => {
      this.router.navigate(['/welcome-page']);
    })
  }

}
