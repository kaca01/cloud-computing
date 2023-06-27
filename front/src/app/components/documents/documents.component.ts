import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { UploadFileDialogComponent } from '../dialogs/upload-file-dialog/upload-file-dialog.component';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import axios from 'axios';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  folderNames: string[] = ["Birthday picsss", "Me", "Friends", "Family", "Party", "New Years Eve", "Christmas", 
  "Algorithms and data structures", "Movies", "Favorite TV Shows", "Cloud Computing"];

  documentsNames: string[] = ['file.pdf', 'picture.png', 'audio.mp3', 'video.mp4', 'word.docx', 'picture2.jpg', 'picture3.jpeg'];

  constructor(private router: Router, 
              private cognitoService: CognitoService, 
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private fileService: FileService) { }

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails(){
    this.cognitoService.getUser()
    .then((user: any) => {
      if (user){
        // loged in
        console.log(user);
      }
      else{
        // if not logged in, send user to login
        this.router.navigate(['/welcome-page']);
      }
    })
  }

  createNewFolder() {

  }

  openFolder(name: string) {
    console.log(name);
  }

  openFile(name: string) {

  }

  edit() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { type: "edit" } 
    
    this.dialog.open(UploadFileDialogComponent, dialogConfig);
  }

  openInfo() {

  }

  addPeople() {

  }

  download() {
    axios
    .get(this.fileService.apiUrl + "/download", { params: { "path": "stat_usmeni_okt1_2020.pdf" } }) // TODO izmeni ovo kasnije
    .then((response) => {
      const base64Data: string = response.data.body;
      const byteCharacters: string = atob(base64Data);
      const byteNumbers: number[] = Array.from(byteCharacters).map((char) => char.charCodeAt(0));
      const byteArray: Uint8Array = new Uint8Array(byteNumbers);
      const blob: Blob = new Blob([byteArray], { type: "pdf" });

      // Create URL object for blob
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = "stat_usmeni_okt1_2020.pdf"; // TODO izmeni ovo kasnije

      // Simulation of clicking on the link element to download the file
      link.click();

      // Releasing URL object resources
      window.URL.revokeObjectURL(downloadUrl);

      this.openSnackBar('Successfully download file', 'Close');
    })
    .catch((error) => {
      this.openSnackBar('Download error', 'Close');
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { type: "upload" } 
    
    this.dialog.open(UploadFileDialogComponent, dialogConfig);
  }

  findExtension(name: string): string {
    return name.split('.')[1];
  }

  choosePicture(name: string): string {
    let extension = this.findExtension(name);
    if (['jpg', 'png', 'jpeg'].includes(extension)) return "../../../assets/images/pictures.png";
    if (extension == 'mp3') return "../../../assets/images/equalizer.png";
    if (extension == 'mp4') return "../../../assets/images/multimedia.png";
    else return "../../../assets/images/documents.png";
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
