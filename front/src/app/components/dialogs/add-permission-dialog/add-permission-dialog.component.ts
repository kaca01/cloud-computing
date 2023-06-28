import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FileService } from 'src/app/services/file.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, T } from '@angular/cdk/keycodes';

export interface Email {
  email: string;
}

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.css']
})
export class AddPermissionDialogComponent implements OnInit {

  public users : Email[] = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  emails: String[] = [];

  constructor(private dialogRef: MatDialogRef<AddPermissionDialogComponent>,
    private fileService: FileService,
    private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  close() : void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add email
    if (value) {
      this.emails.push(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(email: String): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }


  addPeople() {
    // this.fileService.addPeople({     
    //   "granted_users": this.fileContent,
    //   "document_path": this.file['name'],
    // }).subscribe((data : any) => {
    //   this.openSnackBar(data['message'], 'Close');
    // })
    this.close();
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
