import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';

interface Submission {
    _id: String,
    submittedBy: String,
    title: String,
    authors: String,
    abstract: String,
    keywords: String,
    status: String,
    articleUrl: String,
    isLoading: boolean,
    updateStatus: String
}

@Component({
    selector: 'app-my-submissions',
    templateUrl: './my-submissions.component.html',
    styleUrls: ['./my-submissions.component.css']
})
export class MySubmissionsComponent implements OnInit {
    submissions: Submission[] = [];
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
    constructor(private authService: AuthService, private apiService: ApiDataService) { }

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
                        submission.status !== 'Approved' && submission.status !== 'Rejected'
                    );
                    this.archivedSubmissions = response['submissions'].filter(submission =>
                        submission.status === 'Approved' || submission.status === 'Rejected'
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
}
