import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service'; // Adjust the path as necessary
import { ApiDataService } from '../Services/api-data.service';
import { NotificationService } from '../Services/notification.service';
import { isFileTooLarge, MAX_UPLOAD_SIZE_LABEL } from '../common/file-upload.constants';

@Component({
  selector: 'app-article-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css']
})
export class SubmissionComponent implements OnInit {
  showLoginError = false; // Tracks if the submit attempt was made without being logged in
  showSuccess = false; // Tracks if the submit attempt was made without being logged in
  submissionId = ''; // Tracks the ID of the submission, if successful
  showError = false; // Tracks if there was an error during submission
  certified = false;
  isSubmitting = false; // Tracks if the form is currently being submitted
  streams: string[] = [];
  isSingleAuthor: boolean = null;
  otherAuthors = '';
  otherAuthorEmails = '';
  correspondingAuthorName = '';

  ngOnInit(): void {
    // Prefill the corresponding author name from the access token, while keeping it editable.
    this.correspondingAuthorName = this.authService.getUserName() ?? '';

    this.articleSubmissionService.getData('/author/streams').subscribe({
      next: (response) => {
        this.streams = response['streams'] ?? [];
      },
      error: (error) => {
        this.notificationService.backendError(error, 'Error fetching article streams.');
      }
    });
  }

  onCertifyChange(event) {
    if (event.target.value === 'agree') {
      this.certified = true;
    } else {
      this.certified = false;
    }
  }


  constructor(private authService: AuthService, private articleSubmissionService: ApiDataService, private notificationService: NotificationService) { }
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

      // Ensure all mandatory fields are filled (other authors are optional).
      const requiredFields: { value: string; label: string }[] = [
        { value: event.target.articleTitle.value, label: 'Article Title' },
        { value: event.target.submissionFor.value, label: 'Submission For' },
        { value: event.target.articleType.value, label: 'Article Type' },
        { value: event.target.articleStream.value, label: 'Article Stream' },
        { value: event.target.correspondingAuthorName.value, label: 'Corresponding Author Name' },
        { value: event.target.articleAbstract.value, label: 'Abstract' },
        { value: event.target.articleKeywords.value, label: 'Keywords' }
      ];
      const missingField = requiredFields.find(field => !field.value || !field.value.trim());
      if (missingField) {
        this.notificationService.warning(`${missingField.label} is required. Please fill in all mandatory fields.`);
        return; // Stop the form submission
      }
      if (!event.target.articleFile.files || event.target.articleFile.files.length === 0) {
        this.notificationService.warning('Please upload your article (PDF) before submitting.');
        return; // Stop the form submission
      }
      if (isFileTooLarge(event.target.articleFile.files[0])) {
        this.notificationService.warning(`The selected file is too large. Please upload a file smaller than ${MAX_UPLOAD_SIZE_LABEL}.`);
        return; // Stop the form submission
      }

      // Single vs multi-author handling.
      if (this.isSingleAuthor === null || this.isSingleAuthor === undefined) {
        this.notificationService.warning('Please indicate whether this is a single-author submission.');
        return; // Stop the form submission
      }
      const isMultiAuthor = this.isSingleAuthor === false;
      const otherAuthors = (this.otherAuthors || '').trim();
      const otherAuthorEmails = (this.otherAuthorEmails || '').trim();
      if (isMultiAuthor) {
        if (!otherAuthors) {
          this.notificationService.warning('Other Author(s) Name(s) is required for multi-author submissions.');
          return; // Stop the form submission
        }
        if (!otherAuthorEmails) {
          this.notificationService.warning('Other Author(s) Email(s) is required for multi-author submissions.');
          return; // Stop the form submission
        }
      }
      if (!this.validateEmails(otherAuthorEmails)) {
        this.notificationService.warning('One or more email addresses are invalid. Please correct them and try again.');
        return; // Stop the form submission
      }
      // Proceed with submission logic
      event.preventDefault(); // Prevent the form from submitting in the traditional way
      const formData: FormData = new FormData();
      formData.append('title', event.target.articleTitle.value);
      formData.append('authors', isMultiAuthor ? otherAuthors : '');
      formData.append('abstract', event.target.articleAbstract.value);
      formData.append('keywords', event.target.articleKeywords.value);
      formData.append('articleType', event.target.articleType.value);
      formData.append('articleStream', event.target.articleStream.value);
      formData.append('correspondingAuthorName', event.target.correspondingAuthorName.value);
      formData.append('articleAuthorEmails', isMultiAuthor ? otherAuthorEmails : '');
      formData.append('submissionFor', event.target.submissionFor.value);
      formData.append('file', event.target.articleFile.files[0]);

      this.isSubmitting = true;
      this.articleSubmissionService.submitArticle(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.showError = false;
          this.showSuccess = true;
          this.submissionId = response['submissionId'];
        },
        error: (error) => {
          this.isSubmitting = false;
          this.showError = true;
          this.notificationService.backendError(error, 'There was an error submitting your manuscript.');
        }
      });
    }
  }
}

