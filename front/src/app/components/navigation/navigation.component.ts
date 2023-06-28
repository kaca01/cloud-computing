import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router, private cognitoService: CognitoService) { }

  ngOnInit(): void {
  }

  inviteMember(){

  }

  controlAccess(){
    
  }
  
  logOut(){
    this.cognitoService.signOut()
    .then((user: any) => {
      this.router.navigate(['/welcome-page']);
    })
  }

}
