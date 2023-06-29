import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})
export class UserActivationComponent implements OnInit {

  @ViewChild('message') message!: ElementRef;
  email!: string | null;

  constructor(private service: CognitoService, private userService: UserService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
      this.email = this.activatedRoute.snapshot.paramMap.get('email');
      //todo check if this email already exists (shouldn't cognito do that for me? )
      //todo get all user data from dynamotable (need lambda for this)
      if (this.email)
        this.userService.getFamilyMember(this.email).subscribe((user : any) => {
          this.service.signUpWithoutVerification(user).then(() => {
            const p = document.getElementById("message");
            p!.innerHTML = "You have successfully verified the account of your family memeber. They can login now!";
          })
          .catch((error:any) => {
            const errorTxt = this.handleErrors(error);
            const p = document.getElementById("message");
            p!.innerHTML = errorTxt;
          })
        }, error => {
          console.log("error happened.");
          console.log(error);
        });
  }

  handleErrors(error: any) : string {
    if (error.error){
        return error.error;
    }
    else{
        let e = JSON.parse(error.error);
        if(e.message!= null || e.message != undefined)  
            return e.message;
        else if(e.errors != null || e.errors != undefined)
            return e.errors;
        else return "Some error occurred";
  }}

}
