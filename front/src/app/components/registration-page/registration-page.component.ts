import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';
import { FolderService } from 'src/app/services/folder.service';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {

  registrationForm= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), this.createPasswordStrengthValidator()]),
    repeatPassword: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
    address: new FormControl('', [Validators.required]),
  
  }) ;

  hide : boolean = true;
  hideAgain : boolean = true;

  user: User | undefined;
  isConfirm: boolean = false;

  constructor(private router: Router,
              private cognitoService: CognitoService, 
              private folderService: FolderService,
              private _snackBar: MatSnackBar,
              private fileService: FileService) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
  }

  public signUpWithCognito(){
    if (this.registrationForm.get('password')?.value! != this.registrationForm.get('repeatPassword')?.value!){
      this.openSnackBar("Passwords not matching!");
      return;
    }

    this.setUserData();
    console.log(this.user);

    if (this.user && this.user.email && this.user.password){
      this.cognitoService.signUp(this.user)
      .then(() => {
        this.isConfirm = true;
      })
      .catch((error:any) => {
        console.log(error.message);
        this.openSnackBar(error.message);
      })
    }
    else{
      this.openSnackBar("Missing data!");
    }
  }

  private setUserData(){
    this.user!.email = this.registrationForm.get('email')?.value!;
    this.user!.password = this.registrationForm.get('password')?.value!;
    this.user!.telephoneNumber = this.registrationForm.get('telephoneNumber')?.value!;
    this.user!.address = this.registrationForm.get('address')?.value!;
    this.user!.name = this.registrationForm.get('name')?.value!;
    this.user!.surname = this.registrationForm.get('surname')?.value!;
    this.user!.code = "";
  }

  public confirmSignUp(){
    if (this.user){
      this.cognitoService.confirmSignUp(this.user)
      .then(() => {
        this.router.navigate(['/login']);
        this.folderService.createFolder({
          "body": {
          "folderName": this.user?.email,
          "folderPath": ''
          }
        }).subscribe((data : any) => {
          console.log("success");
        }, error => {
          console.log("error happened.");
          console.log(error);
        });
        // this.openSnackBar("Account has been successfully created! You can login now!");
        this.fileService.sendVerificationEmail({ "email" : this.user?.email }).subscribe((data : any) => {
          this.openSnackBar(data['message']);
        })
      })
      .catch((error: any) => {
        console.log(error.message);
        this.openSnackBar(error.message);
      })
    }
    else{
      this.openSnackBar("Missing user information");
    }
  }

  login() {
    this.router.navigate(['login']);
  }
  
  private openSnackBar(snackMsg : string) : void {
    this._snackBar.open(snackMsg, "Dismiss", {
      duration: 3000
    });
  }      

  createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && specialChars;

        return !passwordValid ? {passwordStrength:true}: null;
    }

  }

}
