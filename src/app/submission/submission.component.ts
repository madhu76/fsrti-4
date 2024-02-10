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
  constructor(private authService: AuthService, private articleSubmissionService: ApiDataService) { }

  onSubmit(event: any) {
    if (!this.authService.isAuthenticated) {
      this.showLoginError = true;
    } else {
      this.showLoginError = false;
      // Proceed with submission logic
      event.preventDefault(); // Prevent the form from submitting in the traditional way
      const formData: FormData = new FormData();
      formData.append('title', event.target.articleTitle.value);
      formData.append('authors', event.target.articleAuthors.value);
      formData.append('abstract', event.target.articleAbstract.value);
      formData.append('keywords', event.target.articleKeywords.value);
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

