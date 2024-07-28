import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface Submission {
    _id: string,
    submittedBy: String,
    title: String,
    authors: String,
    abstract: String,
    keywords: String,
    status: string,
    articleUrl: String,
    isLoading: boolean,
    updateStatus: String,
    reviewUrls: String[],
    revisionUrls: String[]
}

@Component({
    selector: 'app-my-submissions',
    templateUrl: './my-submissions.component.html',
    styleUrls: ['./my-submissions.component.css']
})
export class MySubmissionsComponent implements OnInit {
    @ViewChild('reviewsFileUploadModal') reviewsFileUploadModal: TemplateRef<any>;
    @ViewChild('revisionFileUploadModal') revisionFileUploadModal: TemplateRef<any>;
    @ViewChild('revisionModal') revisionModal: TemplateRef<any>;
    @ViewChild('reviewModal') reviewModal: TemplateRef<any>;

    submissions: Submission[] = [];
    changedSubmission: Submission | null = null;
    reviewSelectedFiles: File[] = [];
    revisionSelectedFile: File = null
    archivedSubmissions: Submission[] = [];
    filteredSubmissions: Submission[] = [];
    archivedSubmissionsTableVisibility = false;
    showLoginError = false;
    showError = false;
    isLoading = false;
    filter: string = '';
    sortColumn: string = '';
    sortAscending: boolean = true;
    isAdmin: boolean = false;
    reviewSelectedSubmission: Submission;
    revisionSubmission: Submission;
    revisionSelectedSubmission: Submission;
    constructor(private authService: AuthService, private apiService: ApiDataService, private modalService: NgbModal) { }

    ngOnInit(): void {
        this.loadData();
    }

    onRefresh(): void {
        this.loadData();
    }
    onSubmit(submission: any) {
        submission.isLoading = true;
        submission.updateStatus = ''; // Clear previous status
        // Simulate an API call to update the submission
        this.apiService.updateSubmission(submission._id, submission.status)
            .subscribe({
                next: (result) => {
                    submission.updateStatus = 'success';
                    submission.isLoading = false;
                    // Handle success, e.g., show success message, refresh list, etc.
                },
                error: (error) => {
                    submission.updateStatus = 'error';
                    submission.isLoading = false;
                    // Handle error, e.g., show error message
                }
            });
    }



    private loadData() {
        if (!this.authService.isAuthenticated) {
            this.showLoginError = true;
        } else {
            this.isLoading = true;
            this.showLoginError = false;
            this.showError = false;
            this.apiService.getData('/author/manuscript').subscribe({
                next: (response: Submission[]) => {
                    this.submissions = response['submissions'].filter(submission =>
                        submission.status !== 'Accepted' && submission.status !== 'Rejected'
                    );
                    this.archivedSubmissions = response['submissions'].filter(submission =>
                        submission.status === 'Accepted' || submission.status === 'Rejected'
                    );
                    this.isAdmin = response['isAdmin'];
                    this.filteredSubmissions = [...this.submissions];
                    this.isLoading = false;
                },
                error: (error) => {
                    this.showError = true;
                    this.isLoading = false;
                }
            });
        }
    }

    onSort(column: string): void {
        if (this.sortColumn === column) {
            this.sortAscending = !this.sortAscending;
        } else {
            this.sortAscending = true;
            this.sortColumn = column;
        }
        this.sortSubmissions();
    }

    private sortSubmissions(): void {
        const direction = this.sortAscending ? 1 : -1;
        this.filteredSubmissions.sort((a, b) => {
            if (a[this.sortColumn] < b[this.sortColumn]) return -1 * direction;
            if (a[this.sortColumn] > b[this.sortColumn]) return 1 * direction;
            return 0;
        });
    }

    onFilterChange(): void {
        this.filteredSubmissions = this.submissions.filter(submission => {
            // Convert each submission object to a lowercase JSON string
            const submissionString = JSON.stringify(submission).toLowerCase();
            // Check if the stringified object includes the lowercase filter
            return submissionString.includes(this.filter.toLowerCase());
        });
    }

    openReviewsFileUploadModal(submission: Submission): void {
            this.changedSubmission = submission;
            this.modalService.open(this.reviewsFileUploadModal, { ariaLabelledBy: 'modal-basic-title' });
        }

    openRevisionFileUploadModal(submission: Submission): void {
        this.revisionSubmission = submission;
        this.modalService.open(this.revisionFileUploadModal, { ariaLabelledBy: 'modal-basic-title' });        
    }

    openReviewModal(submission: Submission): void {
        this.reviewSelectedSubmission = submission;
        this.modalService.open(this.reviewModal, { ariaLabelledBy: 'modal-basic-title' });
    }

    openRevisionModal(submission: Submission): void {
        this.revisionSelectedSubmission = submission;
        this.modalService.open(this.revisionModal, { ariaLabelledBy: 'modal-basic-title' });
    }

    onReviewFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.reviewSelectedFiles = Array.from(input.files);
        }
    }

    onRevisionFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.revisionSelectedFile = input.files[0];
        }
    }

    onUploadReviews(): void {
        if (this.changedSubmission) {
            this.changedSubmission.isLoading = true;
            this.apiService.updateSubmission(this.changedSubmission._id, this.changedSubmission.status,this.reviewSelectedFiles)
                .subscribe({
                    next: (result) => {
                        this.changedSubmission.updateStatus = 'success';
                        this.changedSubmission.isLoading = false;
                        this.loadData();
                        // Handle success, e.g., show success message
                    },
                    error: (error) => {
                        this.changedSubmission.updateStatus = 'error';
                        this.changedSubmission.isLoading = false;
                        // Handle error, e.g., show error message
                    }
                });
            this.modalService.dismissAll();
        }
    }

    onUploadRevision(): void {
        if (this.revisionSubmission) {
            this.revisionSubmission.isLoading = true;
            this.apiService.uploadFiles(this.revisionSubmission._id, this.revisionSubmission.submittedBy, this.revisionSelectedFile)
                .subscribe({
                    next: (result) => {
                        this.revisionSubmission.updateStatus = 'success';
                        this.revisionSubmission.isLoading = false;
                        this.loadData();
                        // Handle success, e.g., show success message
                    },
                    error: (error) => {
                        this.revisionSubmission.updateStatus = 'error';
                        this.revisionSubmission.isLoading = false;
                        // Handle error, e.g., show error message
                    }
                });
            this.modalService.dismissAll();
        }
    }
}
