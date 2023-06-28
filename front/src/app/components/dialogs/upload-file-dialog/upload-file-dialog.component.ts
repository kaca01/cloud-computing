import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import axios from 'axios';
import { CognitoService } from 'src/app/services/cognito.service';
import { DocumentsComponent } from '../../documents/documents.component';
import { UploadFile } from 'src/app/domain';

@Component({
  selector: 'app-upload-file-dialog',
  templateUrl: './upload-file-dialog.component.html',
  styleUrls: ['./upload-file-dialog.component.css'],
  providers: [DatePipe]
})
export class UploadFileDialogComponent implements OnInit {
  hint: string = "separate tags with a comma"
  tagsFromForm: string = ''
  tags: Array<any> = [];
  description: string = '';

  fileContent: string = '';
  file: any;
  currentPath: string = "";
  currentFile: string = "";
  type: string = "";

  user: any;
  private documentComponent : DocumentsComponent = {} as DocumentsComponent;
  selectedFile: UploadFile = {} as UploadFile;

  constructor(private dialogRef: MatDialogRef<UploadFileDialogComponent>,
              private fileService: FileService,
              private snackBar: MatSnackBar,
              private datePipe: DatePipe,
              private cognitoService: CognitoService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                console.log(data);
                this.type = data.type;
                this.documentComponent = data.component;
                this.currentPath = this.documentComponent.currentPath;
                this.selectedFile = this.documentComponent.selectedFile;
                if (this.type == 'edit') {
                  this.description = this.selectedFile.description;
                  for (let i of this.selectedFile.tags) {
                    this.tagsFromForm += i + ",";
                  }
                } else {
                  this.description = '';
                  this.tagsFromForm = '';
                }
                console.log(this.selectedFile);
                this.currentFile = this.data.file;
                this.cognitoService.getUser()
                  .then((user: any) => {
                    if (user) {
                      this.user = user
                  }})
                }

  ngOnInit(): void { }

  close() : void {
    this.dialogRef.close();
  }

  deleteFile(){
    axios
    .delete(this.fileService.apiUrl + "/deleteFile", { params: { "file_path": this.currentPath+"/"+this.currentFile } })
    .then((response) => {
      this.openSnackBar('Successfully deleted file', 'Close');
      this.documentComponent.updateView();
    })
    .catch((error) => {
      this.openSnackBar('Delete error', 'Close');
    });
    this.close();
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.fileContent = event.target.result;
      };
      reader.readAsDataURL(this.file)
    }
  }

  uploadFile() {
    if(this.file == undefined) {
      this.openSnackBar('Choose file', 'Close');
    }
    else {
      this.fileService.uploadFile({     
        "fileContent": this.fileContent,
        "fileName": this.currentPath+"/"+this.file['name'],
        "fileType": this.file['type'],
        "fileSize": this.file['size'],
        "fileCreated": this.datePipe.transform(Date(), 'dd.MM.yy hh:mm:ss')!,
        "fileModified": this.datePipe.transform(this.file['lastModifiedDate'], 'dd.MM.yy hh:mm:ss')!,
        "description": this.description,
        "tags": this.exportTags(),
        "user": this.user['attributes']['email']
      }).subscribe((data : any) => {
        this.openSnackBar(data['message'], 'Close');
        this.documentComponent.updateView();
      })
      this.close();
      this.tags = [];
    }
  }

  exportTags(): Array<any>{
    if(this.tagsFromForm.includes(','))
      this.tags = this.tagsFromForm.trim().split(',')
    else 
      this.tags.push(this.tagsFromForm)
    return this.tags
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

  editFile() : void {
    if(this.file != undefined) {
      console.log(this.file['type'].split('/')[1])
      if(this.file['type'].split('/')[1] != this.currentFile.split('.')[1]) 
        this.openSnackBar('Invalid file type', 'Close');
      else 
        this.callEditFunction();
    }
    else 
      this.callEditFunction();
    this.close();
  }

  callEditFunction() {
    this.fileService.editFile({     
      "fileContent": this.fileContent,
      "fileName": this.currentPath+"/"+this.currentFile, 
      "description": this.description,
      "tags": this.exportTags()
    }).subscribe((data : any) => {
      console.log(data)
      this.openSnackBar(data['message'], 'Close');
    })
  }
}