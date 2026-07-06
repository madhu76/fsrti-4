import { Component, NgZone, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiDataService } from '../Services/api-data.service';
import { NotificationService } from '../Services/notification.service';
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
    @ViewChild('addEditorModal') addEditorModal: TemplateRef<any>;
    @ViewChild('addManagingEditorModal') addManagingEditorModal: TemplateRef<any>;
    @ViewChild('editNumberModal') editNumberModal: TemplateRef<any>;


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
    streamsList: string[] = [];
    newEditor: { name: string; email: string; streams: string[] } = { name: '', email: '', streams: [] };
    addEditorErrorMessage: string = '';
    isAddingEditor: boolean = false;
    addEditorModalRef: any;
    managingEditors: AssociateEditor[] = [];
    newManagingEditor: { name: string; email: string; streams: string[] } = { name: '', email: '', streams: [] };
    addManagingEditorErrorMessage: string = '';
    isAddingManagingEditor: boolean = false;
    addManagingEditorModalRef: any;
    newStreamName: string = '';
    isAddingStream: boolean = false;
    selectedNumberSubmission: Submission;
    editYear: string = '';
    editNumber: string = '';
    editNumberErrorMessage: string = '';
    isSavingNumber: boolean = false;
    editNumberModalRef: any;
    user: any;
    private subscription: Subscription;
    
    constructor(private authService: AuthService, private apiService: ApiDataService, private modalService: NgbModal, private zone: NgZone, private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.loadData();
        this.loadStreams();
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
                if (error.status === 401) {
                    this.notificationService.warning('Only managing editors can assign associate editors.');
                } else {
                    this.notificationService.backendError(error, 'Error fetching associate editors.');
                }
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private loadManagingEditors(): void {
        this.apiService.getData('/author/managingeditors').subscribe({
            next: (response) => {
                this.managingEditors = response['managingEditors'] ?? [];
            },
            error: (error) => {
                if (error.status !== 401) {
                    this.notificationService.backendError(error, 'Error fetching managing editors.');
                }
            }
        });
    }

    private loadStreams(): void {
        this.apiService.getData('/author/streams').subscribe({
            next: (response) => {
                this.streamsList = response['streams'] ?? [];
            },
            error: (error) => {
                this.notificationService.backendError(error, 'Error fetching streams.');
            }
        });
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
                this.notificationService.success('Associate editor assigned successfully.');
            },
            error: (error) => {
                this.modalService.dismissAll();
                this.notificationService.backendError(error, 'Error assigning associate editor.');
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
                    this.notificationService.backendError(error, 'Error updating the submission.');
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
                    this.notificationService.backendError(error, 'There was an error retrieving your articles.');
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
                        if (error.status === 401) {
                            this.notificationService.warning('Only managing editors can assign associate editors.');
                        } else {
                            this.notificationService.backendError(error, 'Error fetching associate editors.');
                        }
                    }
                });
            } else {
                // Set selectedAssociateEditor to current associate editor, if any
                this.selectedAssociateEditor = submission.associateEditor || '';
                this.modalService.open(this.assignEditorModal, { ariaLabelledBy: 'modal-basic-title' });
            }
        } catch (err) {
            this.notificationService.error('Unable to open the assign editor dialog.', true, String(err));
        }
    }
    getAssociateEditorsByStream(): any {
        // if(this.selectedSubmission.articleStream)
        // {
        //     return this.associateEditors.filter(editor => editor.streams?.includes(this.selectedSubmission?.articleStream) ?? false);
        // }
        return this.associateEditors;
    }

    openAddEditorModal(): void {
        this.newEditor = { name: '', email: '', streams: [] };
        this.addEditorErrorMessage = '';
        this.isAddingEditor = false;
        this.addEditorModalRef = this.modalService.open(this.addEditorModal, { ariaLabelledBy: 'modal-basic-title' });
    }

    toggleEditorStream(stream: string): void {
        const index = this.newEditor.streams.indexOf(stream);
        if (index === -1) {
            this.newEditor.streams.push(stream);
        } else {
            this.newEditor.streams.splice(index, 1);
        }
    }

    openAddManagingEditorModal(): void {
        this.loadManagingEditors();
        this.loadStreams();
        this.newManagingEditor = { name: '', email: '', streams: [] };
        this.newStreamName = '';
        this.isAddingStream = false;
        this.addManagingEditorErrorMessage = '';
        this.isAddingManagingEditor = false;
        this.addManagingEditorModalRef = this.modalService.open(this.addManagingEditorModal, { ariaLabelledBy: 'modal-basic-title' });
    }

    toggleManagingEditorStream(stream: string): void {
        const index = this.newManagingEditor.streams.indexOf(stream);
        if (index === -1) {
            this.newManagingEditor.streams.push(stream);
        } else {
            this.newManagingEditor.streams.splice(index, 1);
        }
    }

    addNewStream(): void {
        const stream = this.newStreamName?.trim();
        if (!stream) {
            this.addManagingEditorErrorMessage = 'Stream name is required';
            return;
        }
        if (this.streamsList.some(s => s.toLowerCase() === stream.toLowerCase())) {
            this.addManagingEditorErrorMessage = 'This stream already exists';
            return;
        }

        this.addManagingEditorErrorMessage = '';
        this.isAddingStream = true;
        this.apiService.postData('/author/streams', { stream }).subscribe({
            next: () => {
                this.streamsList.push(stream);
                // Auto-select the newly added stream for the managing editor being added.
                if (!this.newManagingEditor.streams.includes(stream)) {
                    this.newManagingEditor.streams.push(stream);
                }
                this.newStreamName = '';
                this.isAddingStream = false;
                this.notificationService.success(`Stream "${stream}" added successfully.`);
            },
            error: (error) => {
                this.isAddingStream = false;
                if (error?.status >= 400 && error?.status < 500 && error?.error?.message) {
                    this.addManagingEditorErrorMessage = error.error.message;
                } else {
                    this.notificationService.backendError(error, 'Error adding stream.');
                }
            }
        });
    }

    openEditNumberModal(submission: Submission): void {
        this.selectedNumberSubmission = submission;
        const parts = (submission._id || '').split('-');
        this.editYear = parts[0] || '';
        this.editNumber = parts[1] || '';
        this.editNumberErrorMessage = '';
        this.isSavingNumber = false;
        this.editNumberModalRef = this.modalService.open(this.editNumberModal, { ariaLabelledBy: 'modal-basic-title' });
    }

    private allManuscriptIds(): string[] {
        return [...this.submissions, ...this.archivedSubmissions].map(s => s._id);
    }

    isEditYearValid(): boolean {
        return /^\d{2}$/.test((this.editYear || '').trim());
    }

    get newManuscriptNumber(): string {
        const year = (this.editYear || '').trim();
        const num = (this.editNumber || '').trim();
        if (!year || !num) {
            return '';
        }
        return `${year}-${num.padStart(4, '0')}`;
    }

    isNumberFormatValid(): boolean {
        return /^\d{2}-\d{4}$/.test(this.newManuscriptNumber);
    }

    isNumberUnchanged(): boolean {
        return this.newManuscriptNumber === (this.selectedNumberSubmission ? this.selectedNumberSubmission._id : '');
    }

    isNumberTaken(): boolean {
        return this.allManuscriptIds().includes(this.newManuscriptNumber);
    }

    getTakenNumbersForYear(year: string): string[] {
        const y = (year || '').trim();
        if (!/^\d{2}$/.test(y)) {
            return [];
        }
        return this.allManuscriptIds()
            .filter(id => id.startsWith(`${y}-`))
            .map(id => id.split('-')[1])
            .filter(n => !!n)
            .sort();
    }

    useNextAvailableNumber(): void {
        const year = (this.editYear || '').trim();
        if (!/^\d{2}$/.test(year)) {
            return;
        }
        const taken = new Set(this.getTakenNumbersForYear(year).map(n => parseInt(n, 10)));
        let candidate = 1;
        while (taken.has(candidate)) {
            candidate++;
        }
        this.editNumber = candidate.toString().padStart(4, '0');
    }

    canSaveNumber(): boolean {
        return this.isNumberFormatValid()
            && !this.isNumberUnchanged()
            && !this.isNumberTaken()
            && !this.isSavingNumber;
    }

    saveManuscriptNumber(): void {
        if (!this.canSaveNumber() || !this.selectedNumberSubmission) {
            return;
        }
        const oldId = this.selectedNumberSubmission._id;
        const newId = this.newManuscriptNumber;
        if (!confirm(`Change manuscript number from ${oldId} to ${newId}? Ensure the author has already agreed to this change.`)) {
            return;
        }
        this.editNumberErrorMessage = '';
        this.isSavingNumber = true;
        this.apiService.patchData(`/author/manuscript/number/${oldId}`, { newId }).subscribe({
            next: () => {
                this.selectedNumberSubmission._id = newId;
                this.isSavingNumber = false;
                if (this.editNumberModalRef) {
                    this.editNumberModalRef.close('Saved');
                } else {
                    this.modalService.dismissAll();
                }
                this.notificationService.success(`Manuscript number updated to ${newId}.`);
            },
            error: (error) => {
                this.isSavingNumber = false;
                if (error?.status >= 400 && error?.status < 500 && error?.error?.message) {
                    this.editNumberErrorMessage = error.error.message;
                } else {
                    this.notificationService.backendError(error, 'Error updating manuscript number.');
                }
            }
        });
    }

    addManagingEditor(): void {
        this.addManagingEditorErrorMessage = '';
        const name = this.newManagingEditor.name?.trim();
        const email = this.newManagingEditor.email?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            this.addManagingEditorErrorMessage = 'Name is required';
            return;
        }
        if (!email || !emailRegex.test(email)) {
            this.addManagingEditorErrorMessage = 'A valid email is required';
            return;
        }
        if (this.newManagingEditor.streams.length === 0) {
            this.addManagingEditorErrorMessage = 'Select at least one stream';
            return;
        }
        if (!confirm(`Add ${name} (${email}) as a managing editor?`)) {
            return;
        }

        this.isAddingManagingEditor = true;
        const payload = { name, email, streams: this.newManagingEditor.streams };
        this.apiService.postData('/author/managingeditors', payload).subscribe({
            next: () => {
                this.managingEditors.push({ name, email, streams: this.newManagingEditor.streams });
                this.isAddingManagingEditor = false;
                if (this.addManagingEditorModalRef) {
                    this.addManagingEditorModalRef.close('Added');
                } else {
                    this.modalService.dismissAll();
                }
                this.notificationService.success(`Managing editor ${name} added successfully.`);
            },
            error: (error) => {
                this.isAddingManagingEditor = false;
                if (error?.status >= 400 && error?.status < 500 && error?.error?.message) {
                    // Expected validation/business error: show inline in the form.
                    this.addManagingEditorErrorMessage = error.error.message;
                } else {
                    this.notificationService.backendError(error, 'Error adding managing editor.');
                }
            }
        });
    }

    addAssociateEditor(): void {
        this.addEditorErrorMessage = '';
        const name = this.newEditor.name?.trim();
        const email = this.newEditor.email?.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name) {
            this.addEditorErrorMessage = 'Name is required';
            return;
        }
        if (!email || !emailRegex.test(email)) {
            this.addEditorErrorMessage = 'A valid email is required';
            return;
        }
        if (this.newEditor.streams.length === 0) {
            this.addEditorErrorMessage = 'Select at least one stream';
            return;
        }
        if (!confirm(`Add ${name} (${email}) as an associate editor?`)) {
            return;
        }

        this.isAddingEditor = true;
        const payload = { name, email, streams: this.newEditor.streams };
        this.apiService.postData('/author/associateeditors', payload).subscribe({
            next: () => {
                this.associateEditors.push({ name, email, streams: this.newEditor.streams });
                this.isAddingEditor = false;
                if (this.addEditorModalRef) {
                    this.addEditorModalRef.close('Added');
                } else {
                    this.modalService.dismissAll();
                }
                this.notificationService.success(`Associate editor ${name} added successfully.`);
            },
            error: (error) => {
                this.isAddingEditor = false;
                if (error?.status >= 400 && error?.status < 500 && error?.error?.message) {
                    // Expected validation/business error: show inline in the form.
                    this.addEditorErrorMessage = error.error.message;
                } else {
                    this.notificationService.backendError(error, 'Error adding associate editor.');
                }
            }
        });
    }

    deleteReview(submission: Submission, url: string): void {
        if (!confirm('Delete this review? This cannot be undone.')) {
            return;
        }
        this.apiService.deleteData(`/author/manuscript/${submission._id}/review`, { url }).subscribe({
            next: () => {
                const index = submission.reviewUrls.indexOf(url);
                if (index !== -1) {
                    submission.reviewUrls.splice(index, 1);
                }
                this.notificationService.success('Review deleted successfully.');
            },
            error: (error) => {
                this.notificationService.backendError(error, 'Error deleting review. Please try again.');
            }
        });
    }

    deleteRevision(submission: Submission, url: string): void {
        if (!confirm('Delete this revision? This cannot be undone.')) {
            return;
        }
        this.apiService.deleteData(`/author/manuscript/${submission._id}/revision`, { url }).subscribe({
            next: () => {
                const index = submission.revisionUrls.indexOf(url);
                if (index !== -1) {
                    submission.revisionUrls.splice(index, 1);
                }
                this.notificationService.success('Revision deleted successfully.');
            },
            error: (error) => {
                this.notificationService.backendError(error, 'Error deleting revision. Please try again.');
            }
        });
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
                        this.notificationService.success('Review uploaded successfully.');
                    },
                    error: (error) => {
                        this.changedSubmission.updateStatus = 'error';
                        this.changedSubmission.isLoading = false;
                        this.notificationService.backendError(error, 'Error uploading the review.');
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
                        this.notificationService.success('Revision uploaded successfully.');
                    },
                    error: (error) => {
                        this.revisionSubmission.updateStatus = 'error';
                        this.revisionSubmission.isLoading = false;
                        this.notificationService.backendError(error, 'Error uploading the revision.');
                    }
                });
            this.modalService.dismissAll();
        }
    }

    onSaveArchiveDetails(submission: Submission): void {
        if (!submission.volume || !submission.issue) {
            this.notificationService.warning('Please enter both volume and issue.');
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
                this.notificationService.success('Archive details saved successfully.');
            },
            error: (error) => {
                submission.archiveUpdateStatus = 'error';
                submission.isArchiveSaving = false;
                this.notificationService.backendError(error, 'Error saving archive details.');
            }
        });
    }
}
