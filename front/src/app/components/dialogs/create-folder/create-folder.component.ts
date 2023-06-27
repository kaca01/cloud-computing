import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Folder } from 'src/app/domain';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  private name: string = '';
  private path: string = '';

  constructor(private dialogRef: MatDialogRef<CreateFolderComponent>,
              private service: FolderService,
              @Inject(MAT_DIALOG_DATA) data: string) {
                console.log(data);
                this.path = data;  
              }

  ngOnInit(): void {
  }

  create(): void {
    this.name = "proba proba 123";
    if (this.name == '') {
      return;
    }
    this.service.createFolder({
      "body": {
      "folderName": this.name,
      "folderPath": this.path
      }
    }).subscribe((data : any) => {
      console.log("success!!!");
    }, error => {
      console.log("error happened.");
      console.log(error);
    });

    this.dialogRef.close();
  }
}
