import { Component, OnInit } from '@angular/core';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent {
  response = 'The response will show up here';

  constructor(private fileService: FileService) { }

  uploadFile() {
    this.fileService.uploadFile({
      "fileContent": "Ovo je sadrzaj fajla",
      "fileName": "mojFajl.csv",
      "fileType": "csv",
      "fileSize": 1234,
      "fileCreated": "12/11/2022 11:50",
      "fileModified": "12/11/2022 11:50",
      "description": "neki fajl",
      "tags": ["fajl", "test"]
  }).subscribe((data) => 
        this.response = JSON.stringify(data, null, '\t')
    )
    console.log(this.response);
  }
}
