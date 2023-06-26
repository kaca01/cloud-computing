import { Component, OnInit } from '@angular/core';
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

  folderNames: string[] = ["Birthday picsss", "Me", "Friends", "Family", "Party", "New Years Eve", "Christmas", 
  "Algorithms and data structures", "Movies", "Favorite TV Shows", "Cloud Computing"];

  documentsNames: string[] = ['file.pdf', 'picture.png', 'audio.mp3', 'video.mp4', 'word.docx', 'picture2.jpg', 'picture3.jpeg'];

  constructor(private router: Router, private cognitoService: CognitoService, private dialog: MatDialog, 
              private folderService: FolderService) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.getContent();
  }

  private getContent() {
    this.folderService.getContent('folderrr').subscribe((data) => 
            {
              this.response = JSON.stringify(data, null, '\t')
              console.log("success");
              console.log(data);
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

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    
    this.dialog.open(CreateFolderComponent, dialogConfig);
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

}
