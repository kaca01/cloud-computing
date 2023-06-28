import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DocumentsComponent } from '../../documents/documents.component';

@Component({
  selector: 'app-invite-member-dialog',
  templateUrl: './invite-member-dialog.component.html',
  styleUrls: ['./invite-member-dialog.component.css']
})
export class InviteMemberDialogComponent implements OnInit {

  name: string = '';

  constructor(private dialogRef: MatDialogRef<DocumentsComponent>,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  invite(){
    if (this.name == '') {
      this.openSnackBar("Please enter the user email", "Close");
      return;
    }
    // this.service.createFolder({
    //   "body": {
    //   "folderName": this.name,
    //   "folderPath": this.path
    //   }
    // }).subscribe((data : any) => {
    //   this.openSnackBar("Successfully sent email!", "Close");
    // }, error => {
    //   console.log("error happened.");
    //   console.log(error);
    //   this.openSnackBar("Successfully sent email!", "Close");
    // });

    this.dialogRef.close();
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
