import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { RegistrationPageComponent } from 'src/app/components/registration-page/registration-page.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { WelcomePageComponent } from 'src/app/components/welcome-page/welcome-page.component';
import { TestPageComponent } from 'src/app/components/test-page/test-page.component';

const routes: Routes = [
  { path: 'welcome-page', component: WelcomePageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegistrationPageComponent},
  { path: 'test-page', component: TestPageComponent},
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
  { path: '**', component: WelcomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
