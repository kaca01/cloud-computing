import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';
import { FolderService } from 'src/app/services/folder.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-family-registration',
  templateUrl: './family-registration.component.html',
  styleUrls: ['./family-registration.component.css']
})
export class FamilyRegistrationComponent implements OnInit {

  registrationForm= new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    surname: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    invitedEmail: new FormControl('', [Validators.required, Validators.email]),
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
              private userService: UserService,
              private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.user = {} as User;
    this.isConfirm = false;
  }

  public signUp(){
    if (this.registrationForm.get('password')?.value! != this.registrationForm.get('repeatPassword')?.value!){
      this.openSnackBar("Passwords not matching!");
      return;
    }

    this.setUserData();

    if (this.user && this.user.email && this.user.password){
      if (this.user && this.user.email && this.user.password){
        this.openSnackBar("Verifying...");
        this.userService.familyMemberSignup({
          "user": this.user,
          "invitedEmail": this.registrationForm.get('invitedEmail')?.value!
        }).subscribe((data : any) => {
          console.log(data);
          if (data.cause){
            this.openSnackBar(data.cause);
            return;
          }
          this.openSnackBar("Verification email successfully sent to your family member!");
        }, error => {
          console.log("error happened.");
          console.log(error);
        });
      }
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
