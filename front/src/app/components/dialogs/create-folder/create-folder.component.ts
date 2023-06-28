import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Folder } from 'src/app/domain';
import { FolderService } from 'src/app/services/folder.service';
import { DocumentsComponent } from '../../documents/documents.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  name: string = '';
  private path: string = '';

  private documentComponent : DocumentsComponent = {} as DocumentsComponent;

  constructor(private dialogRef: MatDialogRef<CreateFolderComponent>,
              private service: FolderService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) data: DocumentsComponent) {
                this.documentComponent = data;
                this.path = data.currentPath;  
              }

  ngOnInit(): void {
  }

  create(): void {
    if (this.name == '') {
      this.openSnackBar("Please input name of the foder", "Close");
      return;
    }
    this.service.createFolder({
      "body": {
      "folderName": this.name,
      "folderPath": this.path
      }
    }).subscribe((data : any) => {
      this.openSnackBar("Successfully created!", "Close");
    }, error => {
      console.log("error happened.");
      console.log(error);
    });

    this.dialogRef.close();
    this.documentComponent.currentPath += "/" + this.name;
    this.documentComponent.updateView();
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
