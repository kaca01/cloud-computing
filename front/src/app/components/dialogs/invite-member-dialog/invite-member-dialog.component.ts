import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DocumentsComponent } from '../../documents/documents.component';
import { UserService } from 'src/app/services/user.service';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-invite-member-dialog',
  templateUrl: './invite-member-dialog.component.html',
  styleUrls: ['./invite-member-dialog.component.css']
})
export class InviteMemberDialogComponent implements OnInit {

  name: string = '';

  constructor(private dialogRef: MatDialogRef<DocumentsComponent>,
    private snackBar: MatSnackBar, private userService : UserService, private cognitoService : CognitoService) { }

  ngOnInit(): void {
  }

  invite(){
    if (this.name == '') {
      this.openSnackBar("Please enter the user email", "Close");
      return;
    }
    return new Promise<void>((resolve) => {
      this.cognitoService.getUser()
      .then((user: any) => {
        if (user){
          this.userService.inviteMember({
            "email": this.name,
            "invitedEmail" : user.attributes.email, 
          }).subscribe((data : any) => {
            this.openSnackBar("Successfully sent invitation email!", "Close");
          }, error => {
            console.log("error happened.");
            console.log(error);
            this.openSnackBar("Some error ocurred", "Close");
          }); 
          this.dialogRef.close();
          resolve();
        }
      })})
  }

  close() : void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    const config: MatSnackBarConfig = {
      duration: 2000, 
      panelClass: ['custom-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    };
    this.snackBar.open(message, action, config);
  }
}
