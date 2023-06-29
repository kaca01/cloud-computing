import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';
import { FileService } from 'src/app/services/file.service';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-login-verification',
  templateUrl: './login-verification.component.html',
  styleUrls: ['./login-verification.component.css']
})
export class LoginVerificationComponent implements OnInit {

  constructor(private cognitoService: CognitoService,
     private router: Router,
    private folderService: FolderService,
    private _snackBar: MatSnackBar,
    private fileService: FileService) { }

    registrationForm= new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      code: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]),    
    }) ;
  ngOnInit(): void {
  }

  public verifyLogin(){
    if (this.registrationForm.valid){
      const user = {} as User;
      user.email = this.registrationForm.get('email')?.value!;
      user.code = this.registrationForm.get('code')?.value!;
      console.log(user);
      this.cognitoService.confirmSignUp(user)
      .then(() => {
        this.router.navigate(['/login']);
        this.folderService.createFolder({
          "body": {
          "folderName": this.registrationForm.get('email')?.value!,
          "folderPath": ''
          }
        }).subscribe((data : any) => {
          console.log("success");
        }, error => {
          console.log("error happened.");
          console.log(error);
        });
        // this.openSnackBar("Account has been successfully created! You can login now!");
        this.fileService.sendVerificationEmail({ "email" : this.registrationForm.get('email')?.value! }).subscribe((data : any) => {
          this.openSnackBar(data['message']);
        })
        //todo dobij pristup svim fajlovima
      })
      .catch((error: any) => {
        console.log(error.message);
        this.openSnackBar(error.message);
      })
    }
    else{
      this.openSnackBar("Missing data");
    }
  }

  private openSnackBar(snackMsg : string) : void {
    this._snackBar.open(snackMsg, "Dismiss", {
      duration: 2000
    });
  }  
}
