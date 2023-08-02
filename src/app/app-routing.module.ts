import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { RegistrationComponent } from './registration/registration.component';
import { EditorialboardComponent } from './editorialboard/editorialboard.component';
import { LoginComponent } from './login/login.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { RegistrationCompleteComponent } from './registration-complete/registration-complete.component';
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
import { ManagementComponent } from './management/management.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { AdvisoryeditorialComponent } from './advisoryeditorial/advisoryeditorial.component';
import { PublisherComponent } from './publisher/publisher.component';
import { ConstructionComponent } from './construction/construction.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { TermsComponent } from './terms/terms.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { ArchiveComponent } from './archive/archive.component';
import { TestSigninComponent } from './test-signin/test-signin/test-signin.component';
import { PublicationpoliciesComponent } from './publicationpolicies/publicationpolicies.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'test-signin',
    component: TestSigninComponent
  },
  {
    path: 'pdf',
    component: PdfComponent
  },
  {
    path: 'help',
    component: HomeComponent
  },

  {
    path: 'signup',
    children: [
      {
        path: 'pre-registration',
        component: SignupComponent
      },
      {
        path: 'registration',
        component: RegistrationComponent
      },
      {
        path: 'confirm',
        component: ConfirmComponent
      },
      {
        path: 'complete',
        component: RegistrationCompleteComponent
      }
    ]
  },
  {
    path: 'author',
    loadChildren: () => import('./author/author.module').then((m) => m.AuthorModule),

  },
  { path: 'editorial', component: EditorialboardComponent },
  { path: 'login', component: LoginComponent },
  { path: 'emailform', component: EmailformComponent },
  { path: 'forgotpasswordemail', component: ForgotpasswordemailComponent },
  { path: 'resetpassword/:id', component: NewpasswordComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'guideliness', component: AuthorguidelineComponent },
  { path: 'submission', component: SubmissionComponent },
  { path: "article", component: DisplayarticleComponent },
  { path: "journal-info", component: JournalInfoComponent },
  { path: 'order', component: JournalOrderComponent },
  { path: 'sidenav', component: SidenavComponent },
  { path: 'abstracting', component: AbstractingComponent },
  { path: 'management', component: ManagementComponent },
  { path: 'advisory', component: AdvisoryComponent },
  { path: 'advisoryeditorial', component: AdvisoryeditorialComponent },
  { path: 'publisher', component: PublisherComponent },
  { path: 'construction', component: ConstructionComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: "archive", component: ArchiveComponent },
  { path: 'publicationpolicies', component: PublicationpoliciesComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
