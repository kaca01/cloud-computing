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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
