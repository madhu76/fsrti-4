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
import { EditorialboardComponent } from './editorialboard/editorialboard.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ConfirmPasswordMatchDirective } from './customvalidators/confirm-pswrd-match.directive'

import { AuthorModule } from './author/author.module';

import { ArticlesComponent } from './articles/articles.component';
import { AuthorguidelineComponent } from './authorguideline/authorguideline.component';
import { SubmissionComponent } from './submission/submission.component';

import { DisplayarticleComponent } from './displayarticle/displayarticle.component';
import { JournalInfoComponent } from './journal-info/journal-info.component';
import { JournalOrderComponent } from './journal-order/journal-order.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AbstractingComponent } from './abstracting/abstracting.component';
import { ManagementComponent } from './management/management.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { AdvisoryeditorialComponent } from './advisoryeditorial/advisoryeditorial.component';
import { PublisherComponent } from './publisher/publisher.component';
import { ConstructionComponent } from './construction/construction.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsComponent } from './terms/terms.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { TestSigninComponent } from './test-signin/test-signin/test-signin.component';
import { ArchiveComponent } from './archive/archive.component';
import { PublicationpoliciesComponent } from './publicationpolicies/publicationpolicies.component';
import { SpecialIssuesComponent } from './specialissues/specialissues.component';
import { MySubmissionsComponent } from './my-submissions/my-submissions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JournalComponent,
    FooterComponent,
    NavComponent,
    EditorialboardComponent,
    ConfirmPasswordMatchDirective,
    MySubmissionsComponent,
    ArticlesComponent,
    SpecialIssuesComponent,
    AuthorguidelineComponent,
    SubmissionComponent,
    DisplayarticleComponent,
    JournalInfoComponent,
    JournalOrderComponent,
    SidenavComponent,
    AbstractingComponent,
    ManagementComponent,
    AdvisoryComponent,
    AdvisoryeditorialComponent,
    PublisherComponent,
    ConstructionComponent,
    PrivacypolicyComponent,
    TermsComponent,
    ContactComponent,
    AboutComponent,
    TestSigninComponent,
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
  providers: [
    Meta
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
