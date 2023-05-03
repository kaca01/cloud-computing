import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {

  }

  createNewFolder() {
    
  }

  openSnackBar(snackMsg : string) : void {
    // this.snackBar.open(snackMsg, "Dismiss", {
    //   duration: 2000
    // });
  }


}
