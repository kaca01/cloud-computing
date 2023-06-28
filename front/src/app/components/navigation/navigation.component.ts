import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { InviteMemberDialogComponent } from '../dialogs/invite-member-dialog/invite-member-dialog.component';

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
    
  }
  
  logOut(){
    this.cognitoService.signOut()
    .then((user: any) => {
      this.router.navigate(['/welcome-page']);
    })
  }

}
