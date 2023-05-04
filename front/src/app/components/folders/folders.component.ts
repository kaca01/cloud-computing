import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/app/services/cognito.service';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.css']
})
export class FoldersComponent implements OnInit {

  folderNames: string[] = ["Birthday picsss", "Me", "Friends", "Family", "Party", "New Years Eve", "Christmas", 
                          "Algorithms and data structures", "Movies", "Favorite TV Shows", "Cloud Computing"];

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
  
  createNewFolder() {

  }

  openFolder(name: string) {
    console.log(name);
  }

  addPeople() {
    console.log("add people");
  }

  openSnackBar(snackMsg : string) : void {
    // this.snackBar.open(snackMsg, "Dismiss", {
    //   duration: 2000
    // });
  }

  openDialog() {
    
  }


}
