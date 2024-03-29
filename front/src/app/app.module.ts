import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from 'src/infrastructure/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../infrastructure/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { RegistrationPageComponent } from './components/registration-page/registration-page.component';
import { LoginComponent } from './components/login/login.component';
import { FoldersComponent } from './components/folders/folders.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { HttpClientModule } from '@angular/common/http';
import { UploadFileDialogComponent } from './components/dialogs/upload-file-dialog/upload-file-dialog.component';
import { CreateFolderComponent } from './components/dialogs/create-folder/create-folder.component';
import { InviteMemberDialogComponent } from './components/dialogs/invite-member-dialog/invite-member-dialog.component';
import { FamilyRegistrationComponent } from './components/family-registration/family-registration.component';
import { FileDetailsComponent } from './components/dialogs/file-details/file-details.component';
import { AddPermissionDialogComponent } from './components/dialogs/add-permission-dialog/add-permission-dialog.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/tokenInterceptor';
import { UserActivationComponent } from './components/user-activation/user-activation.component';
import { LoginVerificationComponent } from './components/login-verification/login-verification.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    RegistrationPageComponent,
    LoginComponent,
    FoldersComponent,
    NavigationComponent,
    DocumentsComponent,
    UploadFileDialogComponent,
    CreateFolderComponent,
    InviteMemberDialogComponent,
    FamilyRegistrationComponent,
    FileDetailsComponent,
    AddPermissionDialogComponent,
    UserActivationComponent,
    LoginVerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
