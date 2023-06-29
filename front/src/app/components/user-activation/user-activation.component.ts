import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/domain';
import { CognitoService } from 'src/app/services/cognito.service';
import { UserService } from 'src/app/services/user.service';
import axios from 'axios';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-user-activation',
  templateUrl: './user-activation.component.html',
  styleUrls: ['./user-activation.component.css']
})

export class UserActivationComponent implements OnInit {

  @ViewChild('message') message!: ElementRef;
  email!: string | null;
  emails: String[] = [];

  constructor(private service: CognitoService,
     private userService: UserService,
      private activatedRoute: ActivatedRoute,
      private fileService : FileService) {}

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
              this.givePermission(user.user.Item);
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

  givePermission(user: any){
    axios
    .get(this.fileService.apiUrl + "/seePermission", { params: { "document_path": user.invitedEmail } })
    .then((response) => {
      console.log(response);
      if(response.data.data.grantedUsers != undefined && response.data.data.grantedUsers.length != 0){
        for (const el in response.data.data.grantedUsers)
        this.emails.push(response.data.data.grantedUsers[el]);
      }
    })
    .catch((error) => {
      console.log(error);
    });
    if (!this.emails.includes(user.email))
      this.emails.push(user.email)
    this.fileService.addPeople({     
      "granted_users": this.emails,
      "document_path": user.invitedEmail,
    }).subscribe((data : any) => {
      console.log(data['message']);
    })
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
