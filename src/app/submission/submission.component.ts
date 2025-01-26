import { Component } from '@angular/core';
import { AuthService } from '../Services/auth.service'; // Adjust the path as necessary
import { ApiDataService } from '../Services/api-data.service';

@Component({
  selector: 'app-article-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent {
  showLoginError = false; // Tracks if the submit attempt was made without being logged in
  showSuccess = false; // Tracks if the submit attempt was made without being logged in
  submissionId = ''; // Tracks the ID of the submission, if successful
  showError = false; // Tracks if there was an error during submission
  certified = false;

  onCertifyChange(event) {
    if (event.target.value === 'agree') {
      this.certified = true;
    } else {
      this.certified = false;
    }
  }


  constructor(private authService: AuthService, private articleSubmissionService: ApiDataService) { }
  private validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email.trim());
  }
  private validateEmails(emails) {
    // If emails field is empty or whitespace, return true
    if (!emails || !emails.trim()) {
      return true;
    }
    const emailArray = emails.split(',');
    for (let email of emailArray) {
      if (!this.validateEmail(email)) {
        return false;
      }
    }
    return true;
  }


  onSubmit(event: any) {
    if (!this.authService.isAuthenticated) {
      this.showLoginError = true;
    } else {
      this.showLoginError = false;

      const emails = event.target.articleAuthorEmails.value;
      if (!this.validateEmails(emails)) {
        alert('One or more email addresses are invalid. Please correct them and try again.');
        return; // Stop the form submission
      }
      // Proceed with submission logic
      event.preventDefault(); // Prevent the form from submitting in the traditional way
      const formData: FormData = new FormData();
      formData.append('title', event.target.articleTitle.value);
      formData.append('authors', event.target.articleAuthors.value);
      formData.append('abstract', event.target.articleAbstract.value);
      formData.append('keywords', event.target.articleKeywords.value);
      formData.append('articleType', event.target.articleType.value);
      formData.append('articleStream', event.target.articleStream.value);
      formData.append('correspondingAuthorName', event.target.correspondingAuthorName.value);
      formData.append('articleAuthorEmails', event.target.articleAuthorEmails.value);
      formData.append('submissionFor', event.target.submissionFor.value);
      formData.append('file', event.target.articleFile.files[0]);

      this.articleSubmissionService.submitArticle(formData).subscribe({
        next: (response) => {
          this.showError = false;
          this.showSuccess = true;
          this.submissionId = response['submissionId'];
        },
        error: (error) => {
          this.showError = true;
        }
      });
    }
  }
}

