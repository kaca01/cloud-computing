import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RegistrationPageComponent } from 'src/app/components/registration-page/registration-page.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { WelcomePageComponent } from 'src/app/components/welcome-page/welcome-page.component';
import { FoldersComponent } from 'src/app/components/folders/folders.component';
import { DocumentsComponent } from 'src/app/components/documents/documents.component';
import { FamilyRegistrationComponent } from 'src/app/components/family-registration/family-registration.component';
import { UserActivationComponent } from 'src/app/components/user-activation/user-activation.component';
import { LoginVerificationComponent } from 'src/app/components/login-verification/login-verification.component';

const routes: Routes = [
  { path: 'welcome-page', component: WelcomePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationPageComponent},
  { path: 'folders', component: FoldersComponent},
  { path: 'activation/:id', component: UserActivationComponent},
  { path: 'documents', component: DocumentsComponent},
  { path: 'family-registration', component: FamilyRegistrationComponent},
  { path: 'login-verification', component: LoginVerificationComponent},
  { path: '**', component: WelcomePageComponent },
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
