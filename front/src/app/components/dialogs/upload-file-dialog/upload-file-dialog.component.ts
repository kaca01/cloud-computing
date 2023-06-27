import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

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

  constructor(private dialogRef: MatDialogRef<UploadFileDialogComponent>,
              private fileService: FileService,
              private snackBar: MatSnackBar,
              private datePipe: DatePipe) { }

  ngOnInit(): void { }

  close() : void {
    this.dialogRef.close();
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
        "fileName": this.file['name'],
        "fileType": this.file['type'],
        "fileSize": this.file['size'],
        "fileCreated": this.datePipe.transform(Date(), 'dd.MM.yy hh:mm:ss')!,
        "fileModified": this.datePipe.transform(this.file['lastModifiedDate'], 'dd.MM.yy hh:mm:ss')!,
        "description": this.description,
        "tags": this.exportTags()
      }).subscribe((data : any) => {
        this.openSnackBar(data['message'], 'Close');
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

}