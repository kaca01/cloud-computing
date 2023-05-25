import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  documentsNames: string[] = ['file.pdf', 'picture.png', 'audio.mp3', 'video.mp4', 'word.docx', 'picture2.jpg', 'picture3.jpeg'];

  constructor(private router: Router, private cognitoService: CognitoService) { }

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
