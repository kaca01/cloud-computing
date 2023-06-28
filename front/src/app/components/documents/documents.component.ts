import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { UploadFileDialogComponent } from '../dialogs/upload-file-dialog/upload-file-dialog.component';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { FolderService } from 'src/app/services/folder.service';
import { User } from 'src/app/domain';
import { FileService } from 'src/app/services/file.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import axios from 'axios';
import { HttpHeaders } from '@angular/common/http';
import { FileDetailsComponent } from '../dialogs/file-details/file-details.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  private user: User = {} as User;

  response = 'The response will show up here';

  // TODO : here should be root folder
  currentPath : string = '';
  currentFolder: string = this.currentPath;

  folderNames: string[] = [];
  documentsNames: string[] = [];

  constructor(private router: Router, 
              private cognitoService: CognitoService, 
              private dialog: MatDialog, 
              private folderService: FolderService,
              private fileService: FileService,
              private cdr: ChangeDetectorRef,
              private snackBar: MatSnackBar) { }

  async ngOnInit() {
    await this.getUserDetails();
    await this.getContent();
  }

  updateView() {
    this.getContent();
    this.cdr.markForCheck();
  }

  private getContent() : Promise<void> {
    return new Promise<void>((resolve) => {
      this.documentsNames = [];
      this.folderNames = [];
      
      let pathVariable : string = encodeURIComponent(this.currentPath);
      this.currentFolder = this.getCurrentFolder();
      this.folderService.getContent(pathVariable).subscribe((data) => 
        {
          this.response = JSON.stringify(data, null, '\t')
          for (let i of data.data) {
            i = this.getName(i); 
            if (i != '' && this.isFolder(i) && !this.folderNames.includes(i)) this.folderNames.push(i)
            else if (i != '' && !this.isFolder(i) && !this.documentsNames.includes(i)) this.documentsNames.push(i);
          }
          resolve();

        }, error => {
          console.log("error");
          console.log(error);
          resolve();
        });
      });
  }

  private getUserDetails(): Promise<void> {
    return new Promise<void>((resolve) => {
    this.cognitoService.getUser()
    .then((user: any) => {
      if (user){
        // logged in
        this.currentPath = user.attributes.email;
        this.currentFolder = this.currentPath;
        this.user = user;
        resolve();

      }
      else{
        // if not logged in, send user to login
        resolve();
        this.router.navigate(['/welcome-page']);
      }
    })
    
    });
  }

  back(): void {
    const lastIndex = this.currentPath.lastIndexOf("/");
    this.currentPath = this.currentPath.substring(0, lastIndex);
    this.updateView();
  }

  createNewFolder() {

  }

  openFolder(name: string) {
    this.currentPath += "/" + name;
    this.updateView();
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

  openInfo(name: string): void {
    let path: string = this.currentPath + "/" + name;
    console.log(path);
    let pathVariable : string = encodeURIComponent(path);

    this.fileService.getDetails(pathVariable).subscribe((data: any) => 
    {
      console.log(data);

      const dialogConfig = new MatDialogConfig();

      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = data;
      
      this.dialog.open(FileDetailsComponent, dialogConfig);

    }, (error: any) => {
      console.log("error");
      console.log(error);
    });
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

  deleteFolder(){
    axios
    .delete(this.fileService.apiUrl + "/deleteFolder", { params: { "folder_path": "test_folder" } }) // TODO izmeni ovo kasnije
    .then((response) => {
      this.openSnackBar('Successfully deleted folder', 'Close');
    })
    .catch((error) => {
      this.openSnackBar('Delete error', 'Close');
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { type: "upload" } 
    
    this.dialog.open(UploadFileDialogComponent, dialogConfig);
  }

  openCreateFolderDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this
    
    this.dialog.open(CreateFolderComponent, dialogConfig);
  }

  private isFolder(name: string): boolean { 
    return !name.includes('.');
  }

  private findExtension(name: string): string {
    return name.split('.')[1];
  }

  choosePicture(name: string): string {
    let extension = this.findExtension(name);
    if (['jpg', 'png', 'jpeg'].includes(extension)) return "../../../assets/images/pictures.png";
    if (extension == 'mp3') return "../../../assets/images/equalizer.png";
    if (extension == 'mp4') return "../../../assets/images/multimedia.png";
    else return "../../../assets/images/documents.png";
  }

  private getName(input: string): string {
    let result: string = input.replace(this.currentPath, "");
    result = result.replace('/', '');
    return result.split("/")[0];
  }

  private getCurrentFolder(): string {
    if (this.currentPath.includes('/')){ 
      let pathElements = this.currentPath.split('/');
      let result = pathElements[pathElements.length - 1];
      return result;
    } 
    return "Your documents";
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
