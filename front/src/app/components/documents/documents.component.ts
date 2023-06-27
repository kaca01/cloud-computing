import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';
import { UploadFileDialogComponent } from '../dialogs/upload-file-dialog/upload-file-dialog.component';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  response = 'The response will show up here';

  currentPath : string = 'folderrr';

  folderNames: string[] = [];
  documentsNames: string[] = [];

  constructor(private router: Router, private cognitoService: CognitoService, private dialog: MatDialog, 
              private folderService: FolderService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getContent();
  }

  private updateView() {
    this.getContent();
    this.cdr.markForCheck();
  }

  private getContent() {
    this.documentsNames = [];
    this.folderNames = [];
    let pathVariable : string = encodeURIComponent(this.currentPath);
    this.folderService.getContent(pathVariable).subscribe((data) => 
            {
              this.response = JSON.stringify(data, null, '\t')
              for (let i of data.data) {
                i = this.getName(i); 
                if (i != '' && this.isFolder(i) && !this.folderNames.includes(i)) this.folderNames.push(i)
                else if (i != '' && !this.isFolder(i) && !this.documentsNames.includes(i)) this.documentsNames.push(i);
              }

            }, error => {
              console.log("error");
              console.log(error);
            }
        )
  }

  private getUserDetails(){
    this.cognitoService.getUser()
    .then((user: any) => {
      if (user){
        // logged in
        console.log(user);
      }
      else{
        // if not logged in, send user to login
        this.router.navigate(['/welcome-page']);
      }
    })
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

  }

  openInfo() {

  }

  addPeople() {

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
    dialogConfig.data = this.currentPath;
    
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
}
