import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { InviteMemberDialogComponent } from '../dialogs/invite-member-dialog/invite-member-dialog.component';
import { AddPermissionDialogComponent } from '../dialogs/add-permission-dialog/add-permission-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(private router: Router, private cognitoService: CognitoService, private dialog: MatDialog, ) { }

  ngOnInit(): void {
  }

  inviteMember(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
    this.dialog.open(InviteMemberDialogComponent, dialogConfig);
  }

  controlAccess(){
    return new Promise<void>((resolve) => {
      this.cognitoService.getUser()
      .then((user: any) => {
        if (user){
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          dialogConfig.autoFocus = true;
          dialogConfig.data = user.attributes.email;
          
          this.dialog.open(AddPermissionDialogComponent, dialogConfig);
          resolve();
        }
      })})
  }
  
  logOut(){
    this.cognitoService.signOut()
    .then((user: any) => {
      this.router.navigate(['/welcome-page']);
    })
  }

}
