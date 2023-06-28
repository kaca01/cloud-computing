import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { UploadFileDialogComponent } from '../dialogs/upload-file-dialog/upload-file-dialog.component';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { FolderService } from 'src/app/services/folder.service';
import { User } from 'src/app/domain';
import { AddPermissionDialogComponent } from '../dialogs/add-permission-dialog/add-permission-dialog.component';
import axios from 'axios';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  private user: User = {} as User;
  private email: string = {} as string;

  response = 'The response will show up here';

  // TODO : here should be root folder
  currentPath : string = '';
  currentFolder: string = this.currentPath;

  folderNames: string[] = [];
  documentsNames: string[] = [];
  sharedFolderNames: string[] = [];
  sharedDocumentsNames: string[] = [];

  constructor(private router: Router, 
              private cognitoService: CognitoService, 
              private dialog: MatDialog, 
              private folderService: FolderService,
              private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.getUserDetails();
    await this.getContent();
    await this.getSharedContent();
  }

  updateView() {
    this.getContent();
    this.getSharedContent();
    this.cdr.markForCheck();
  }

  private getSharedContent(): Promise<void> {
    return new Promise<void>((resolve) => {
    this.sharedDocumentsNames = [];
    this.sharedFolderNames = [];
    console.log("ispraznio2");
    console.log(this.sharedFolderNames);

    console.log(this.currentFolder);
    if (this.currentFolder == "Your documents") {
      axios
      .get(this.folderService.url + "getSharedContent", { params: { "email": this.email } })
      .then((response) => {
        console.log(response.data.data);
        for (let i of response.data.data) {
          i = i.documentName; 
          if (i != '' && this.isFolder(i.substring(i.indexOf("/") + 1)) && !this.sharedFolderNames.includes(i)) this.sharedFolderNames.push(i)
          else if (i != '' && !this.isFolder(i) && !this.sharedDocumentsNames.includes(i)) this.sharedDocumentsNames.push(i);
        }
        resolve();
        })
        .catch((error) => {
          console.log(error);
          resolve();
        });
    }
    
  });
  }

  private getContent() : Promise<void> {
    return new Promise<void>((resolve) => {
      this.documentsNames = [];
      this.folderNames = [];
      console.log("ispraznio1");

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
              }
          )
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
        this.email = user.attributes.email;
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

  openSharedFolder(path: string) {
    this.currentPath = path;
    this.updateView();
  }

  openFile(name: string) {

  }

  edit() {

  }

  openInfo() {

  }

  addPeople(i : string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.currentPath+"/"+i;
    
    this.dialog.open(AddPermissionDialogComponent, dialogConfig);
  }

  download() {
    
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
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

  getSharedDocumentName(path: string): string {
    if (path.includes('/')){
      const lastSlashIndex = path.lastIndexOf('/');
      const substringAfterLastSlash = path.substring(lastSlashIndex + 1);
      return substringAfterLastSlash;
    }
    return path;
  }
}
