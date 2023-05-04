import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RegistrationPageComponent } from 'src/app/components/registration-page/registration-page.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { WelcomePageComponent } from 'src/app/components/welcome-page/welcome-page.component';
import { FoldersComponent } from 'src/app/components/folders/folders.component';
import { DocumentsComponent } from 'src/app/components/documents/documents.component';

const routes: Routes = [
  { path: 'welcome-page', component: WelcomePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationPageComponent},
  { path: 'folders', component: FoldersComponent},
  { path: 'documents', component: DocumentsComponent},
  { path: '**', component: WelcomePageComponent },
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
