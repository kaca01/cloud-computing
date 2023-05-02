import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { WelcomePageComponent } from 'src/app/components/welcome-page/welcome-page.component';

const routes: Routes = [
  { path: 'welcome-page', component: WelcomePageComponent},
  { path: '', redirectTo: '/welcome-page', pathMatch: 'full' },
  { path: '**', component: WelcomePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
