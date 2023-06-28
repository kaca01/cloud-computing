import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadFile } from 'src/app/domain';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.css']
})
export class FileDetailsComponent implements OnInit {
  file: UploadFile = {} as UploadFile;

  constructor(private dialogRef: MatDialogRef<FileDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) data: any) {
      console.log('dataaaaaa');
      console.log(data);
      this.file = data;
     }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

}
