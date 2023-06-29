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
      this.email = this.activatedRoute.snapshot.paramMap.get('id');
      if (this.email)
        this.userService.getFamilyMember(this.email).subscribe(async (user : any) => {
          if (user.user.Item){
            this.service.signUpWithoutVerification(user.user.Item);
            await this.sleep(2000); 
            if (this.service.status == "success"){
              console.log(1);
              const p = document.getElementById("message");
              p!.innerHTML = "You have successfully verified the account of your family memeber. A login code has been sent to their email address!";
            }
            else if (this.service.status=="failure"){
              console.log(2);
              const p = document.getElementById("message");
              p!.innerHTML = "An account with this email has already been created!";
            }
            else console.log(3);
          }
        }, error => {
          console.log("error happened.");
        }
      );
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
