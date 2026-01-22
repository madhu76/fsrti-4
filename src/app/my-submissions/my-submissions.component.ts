import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

interface Submission {
    _id: string,
    submittedBy: string,
    title: string,
    authors: string,
    abstract: string,
    keywords: string,
    status: string,
    articleUrl: string,
    isLoading: boolean,
    updateStatus: string,
    reviewUrls: string[],
    revisionUrls: string[],
    articleType: string,
    articleStream: string,
    associateEditor?: string;
    managingEditor?: string;
    updatedAt: Date;
    volume?: string;
    issue?: string;
    isArchiveSaving?: boolean;
    archiveUpdateStatus?: string;
}

interface AssociateEditor {
    email: string;
    name: string;
    streams: string[];
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
    @ViewChild('assignEditorModal') assignEditorModal: TemplateRef<any>;


    associateEditors: AssociateEditor[] = [];
    assignEditorErrorMessage: string;
    selectedSubmission: Submission;
    selectedAssociateEditor: string;
    submissions: Submission[] = [];
    changedSubmission: Submission | null = null;
    reviewSelectedFiles: File[] = [];
    revisionSelectedFile: File = null;
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
    isAssociateEditor: boolean = false;
    reviewSelectedSubmission: Submission;
    revisionSubmission: Submission;
    revisionSelectedSubmission: Submission;
    archivedSubmissionStatuses = [
        'Accepted',
        'Rejected',
        'Withdrawn'
    ];
    user: any;
    private subscription: Subscription;
    
    constructor(private authService: AuthService, private apiService: ApiDataService, private modalService: NgbModal, private zone: NgZone) { }

    ngOnInit(): void {
        this.loadData();
        this.subscription = this.authService.user.subscribe(user => {
            this.zone.run(() => {
                this.user = user;
            });
        });
        this.apiService.getData('/author/associateeditors').subscribe({
            next: (response) => {
                this.associateEditors = response['associateEditors'] ?? [];
            },
            error: (error) => {
                //If unauthorized send proper alert
                if (error.status === 401) {
                    alert('Only managing editors can assign associate editors');
                } else {
                    alert('Error fetching associate editors');
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    onRefresh(): void {
        this.loadData();
    }

    assignAssociateEditor(): void {
        const data = {
            associateEditor: this.selectedAssociateEditor
        };
        this.apiService.patchData(`/author/manuscript/editors/${this.selectedSubmission._id}`, data).subscribe({
            next: (response) => {
                // On success, update managingEditor to current user email
                this.selectedSubmission.associateEditor = this.selectedAssociateEditor;
                this.selectedSubmission.managingEditor = this.user.email;
                this.modalService.dismissAll();
            },
            error: (error) => {
                // Handle error, e.g., show error message
                this.assignEditorErrorMessage = error;
            }
        });
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

    getAssociateEditorName(email: string): string {
        if(email)
        {
            const editor = this.associateEditors?.find(editor => editor.email === email);
            return editor ? editor.name : email
        }
        return 'None';
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
                        this.archivedSubmissionStatuses.includes(submission.status) === false
                    );
                    this.archivedSubmissions = response['submissions'].filter(submission =>
                        this.archivedSubmissionStatuses.includes(submission.status)
                    );
                    this.isAdmin = response['isAdmin'];
                    this.isAssociateEditor = response['isAssociateEditor'];
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

    getArchivedSubmissionsByStatus(status: string) {
        return this.archivedSubmissions.filter(submission => submission.status === status);
    }

    getEditorAssignments(associateEditor: string, archived: boolean): number {
        const submissionsToTrack = archived ? this.archivedSubmissions : this.submissions;
        return submissionsToTrack.filter(submission =>
            submission.associateEditor === associateEditor &&
            new Date(submission.updatedAt).getTime() > (new Date().getTime() - 90 * 24 * 60 * 60 * 1000)
        ).length;
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
            const submissionstring = JSON.stringify(submission).toLowerCase();
            // Check if the stringified object includes the lowercase filter
            return submissionstring.includes(this.filter.toLowerCase());
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

    openAssignEditorModal(submission: Submission): void {
        try {
            this.assignEditorErrorMessage = '';
            this.selectedSubmission = submission;
            // Fetch associate editors if not already fetched
            if (this.associateEditors?.length === 0) {
                this.apiService.getData('/author/associateeditors').subscribe({
                    next: (response) => {
                        this.associateEditors = response['associateEditors'] ?? [];
                        // Set selectedAssociateEditor to current associate editor, if any
                        this.selectedAssociateEditor = submission.associateEditor || '';
                        this.modalService.open(this.assignEditorModal, { ariaLabelledBy: 'modal-basic-title' });
                    },
                    error: (error) => {
                        //If unauthorized send proper alert
                        if (error.status === 401) {
                            alert('Only managing editors can assign associate editors');
                        } else {
                            alert('Error fetching associate editors');
                        }
                    }
                });
            } else {
                // Set selectedAssociateEditor to current associate editor, if any
                this.selectedAssociateEditor = submission.associateEditor || '';
                this.modalService.open(this.assignEditorModal, { ariaLabelledBy: 'modal-basic-title' });
            }
        } catch (err) {
            alert(err);
        }
    }
    getAssociateEditorsByStream(): any {
        // if(this.selectedSubmission.articleStream)
        // {
        //     return this.associateEditors.filter(editor => editor.streams?.includes(this.selectedSubmission?.articleStream) ?? false);
        // }
        return this.associateEditors;
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
            this.apiService.updateSubmission(this.changedSubmission._id, this.changedSubmission.status, this.reviewSelectedFiles)
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

    onSaveArchiveDetails(submission: Submission): void {
        if (!submission.volume || !submission.issue) {
            alert('Please enter both volume and issue');
            return;
        }
        submission.isArchiveSaving = true;
        submission.archiveUpdateStatus = '';
        
        const data = {
            volume: submission.volume,
            issue: submission.issue
        };
        
        this.apiService.patchData(`/author/archived/${submission._id}`, data).subscribe({
            next: (result) => {
                submission.archiveUpdateStatus = 'success';
                submission.isArchiveSaving = false;
            },
            error: (error) => {
                submission.archiveUpdateStatus = 'error';
                submission.isArchiveSaving = false;
                console.error('Error saving archive details:', error);
            }
        });
    }
}
