import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {

  folderNames: string[] = ["Birthday picsss", "Me", "Friends", "Family", "Party", "New Years Eve", "Christmas", 
                          "Algorithms and data structures", "Movies", "Favorite TV Shows", "Cloud Computing"];

  constructor() {}

  ngOnInit(): void {

  }

  createNewFolder() {

  }

  openFolder(name: string) {
    console.log(name);
  }

  openSnackBar(snackMsg : string) : void {
    // this.snackBar.open(snackMsg, "Dismiss", {
    //   duration: 2000
    // });
  }


}
