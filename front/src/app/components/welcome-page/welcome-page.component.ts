import { Component, OnInit } from '@angular/core';
import { UploadFile } from 'src/app/domain';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  response = 'The response will show up here';

  constructor(private fileService: FileService) { }

  uploadFile(file: UploadFile) {
    this.fileService.uploadFile(file).subscribe((data) => 
        this.response = JSON.stringify(data, null, '\t')
    )
    console.log(this.response);
  }

  onSelectFile(event : any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();

      reader.onload = (event: any) => {
        const fileContent = event.target.result;
        console.log(fileContent); // Prikazivanje sadržaja fajla kao binarni string u konzoli

        this.uploadFile({
          "fileContent": fileContent,
          "fileName": file['name'],
          "fileType": file['type'],
          "fileSize": file['size'],
          "fileCreated": file['lastModifiedDate'],
          "fileModified": file['lastModifiedDate'],
          "description": "",
          "tags": []
        })
      };
      reader.readAsDataURL(file)

      console.log(file)
    }
  }
}
