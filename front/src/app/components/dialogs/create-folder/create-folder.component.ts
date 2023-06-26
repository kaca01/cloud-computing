import { Component, OnInit } from '@angular/core';
import { Folder } from 'src/app/domain';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  constructor(private service: FolderService) { }

  ngOnInit(): void {
  }

  create(): void {
    let folder: Folder = {} as Folder;
    folder.name = "bajndovanje";
    this.service.createFolder({
      "body": {
      "folderName": folder.name
      }
    }).subscribe((data : any) => {
      console.log("success!!!");
    }, error => {
      console.log("error happened.");
      console.log(error);
    });
    
    
  }
}
