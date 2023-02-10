import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { JournalComponent } from './journal/journal.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTreeModule } from '@angular/material/tree';
import { SignupComponent } from './signup/signup.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditorialboardComponent } from './editorialboard/editorialboard.component';
import { LoginComponent } from './login/login.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { RegistrationCompleteComponent } from './registration-complete/registration-complete.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ConfirmPasswordMatchDirective } from './customvalidators/confirm-pswrd-match.directive'

import { AuthorModule } from './author/author.module';
import { PdfComponent } from './pdf/pdf.component';

import { EmailformComponent } from './emailform/emailform.component';
import { ForgotpasswordemailComponent } from './forgotpasswordemail/forgotpasswordemail.component';
import { NewpasswordComponent } from './newpassword/newpassword.component';
import { ArticlesComponent } from './articles/articles.component';
import { AdminComponent } from './admin/admin.component';
import { AuthorguidelineComponent } from './authorguideline/authorguideline.component';
import { SubmissionComponent } from './submission/submission.component';

import { DisplayarticleComponent } from './displayarticle/displayarticle.component';
import { JournalInfoComponent } from './journal-info/journal-info.component';
import { JournalOrderComponent } from './journal-order/journal-order.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AbstractingComponent } from './abstracting/abstracting.component';
import { Vol1Issue2Component } from './vol1-issue2/vol1-issue2.component';
import { Vol1Issue3Component } from './vol1-issue3/vol1-issue3.component';
import { Vol1Issue4Component } from './vol1-issue4/vol1-issue4.component';
import { Vol3Issue1Component } from './vol3-issue1/vol3-issue1.component';
import { ManagementComponent } from './management/management.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { AdvisoryeditorialComponent } from './advisoryeditorial/advisoryeditorial.component';
import { PublisherComponent } from './publisher/publisher.component';
import { ConstructionComponent } from './construction/construction.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsComponent } from './terms/terms.component';
import { ContactComponent } from './contact/contact.component';
import { Vol2Issue1Component } from './vol2-issue1/vol2-issue1.component';
import { Vol2Issue2Component } from './vol2-issue2/vol2-issue2.component';
import { AboutComponent } from './about/about.component';
import { TestSigninComponent } from './test-signin/test-signin/test-signin.component';
import { Vol2Issue3Component } from './vol2-issue3/vol2-issue3.component';
import { ArchiveComponent } from './archive/archive.component';
import { PublicationpoliciesComponent } from './publicationpolicies/publicationpolicies.component';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JournalComponent,
    FooterComponent,
    NavComponent,
    SignupComponent,
    RegistrationComponent,
    EditorialboardComponent,
    LoginComponent,
    ConfirmComponent,
    RegistrationCompleteComponent,
    ConfirmPasswordMatchDirective,

    PdfComponent,

    EmailformComponent,
    ForgotpasswordemailComponent,
    NewpasswordComponent,
    ArticlesComponent,
    AdminComponent,
    AuthorguidelineComponent,
    SubmissionComponent,
    DisplayarticleComponent,
    JournalInfoComponent,
    JournalOrderComponent,
    SidenavComponent,
    AbstractingComponent,
    Vol1Issue2Component,
    Vol1Issue3Component,
    Vol1Issue4Component,
    ManagementComponent,
    AdvisoryComponent,
    AdvisoryeditorialComponent,
    PublisherComponent,
    ConstructionComponent,
    PrivacypolicyComponent,
    TermsComponent,
    ContactComponent,
    Vol2Issue1Component,
    Vol2Issue2Component,
    Vol3Issue1Component,
    AboutComponent,
    TestSigninComponent,
    Vol2Issue3Component,
    ArchiveComponent,
    PublicationpoliciesComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatGridListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    HttpClientModule,
    AuthorModule,
    FlashMessagesModule.forRoot(),
    MatTreeModule
  ],
  providers: [Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
