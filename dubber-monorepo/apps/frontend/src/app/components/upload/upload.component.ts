import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LanguageService, Country, Language } from '../../services/language.service';

interface ErrorResponse {
  error?: string;
  code?: string;
  message?: string;
  maxSize?: string;
  uploadedSize?: string;
}

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  selectedFile?: File;
  selectedCountryCode = 'IN';
  targetLang = 'hi';
  jobId?: number;
  status?: string;
  progress = 0;
  etr = '';
  activity = '';
  errorMessage = '';

  countries: Country[] = [];
  availableLanguages: Language[] = [];

  pollingInterval: any;

  constructor(
    private api: ApiService,
    public languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.countries = this.languageService.getCountries();
    this.availableLanguages = this.languageService.getLanguagesByCountry(this.selectedCountryCode);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  onCountryChange(): void {
    this.availableLanguages = this.languageService.getLanguagesByCountry(this.selectedCountryCode);
    if (this.availableLanguages.length > 0) {
      this.targetLang = this.availableLanguages[0].code;
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.errorMessage = '';
  }

  getErrorMessage(error: any): string {
    const errorData = error.error as ErrorResponse;

    if (!errorData) {
      return 'Unknown error occurred. Please try again.';
    }

    switch (errorData.code) {
      case 'FILE_TOO_LARGE':
        return `File too large (${errorData.uploadedSize}). Maximum allowed size is ${errorData.maxSize}.`;
      case 'INVALID_FILE_TYPE':
        return errorData.error || 'Invalid file type. Allowed: mp4, avi, mkv, mov, flv, webm';
      case 'FILE_EMPTY':
        return 'File is empty. Please select a valid file.';
      case 'JOB_NOT_FOUND':
        return 'Job not found. Please upload a new file.';
      case 'OUTPUT_NOT_READY':
        return 'Translation is still in progress. Please check again later.';
      case 'UPLOAD_ERROR':
      case 'DOWNLOAD_ERROR':
        return errorData.error || 'Operation failed. Please try again.';
      default:
        return errorData.error || errorData.message || 'An error occurred. Please try again.';
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    console.log('Uploading file:', this.selectedFile.name, 'Language:', this.targetLang);
    this.status = 'UPLOADING...';
    this.errorMessage = '';
    this.progress = 0;

    this.api.upload(this.selectedFile, this.targetLang, {})
      .subscribe({
        next: (res: any) => {
          console.log('Upload response:', res);
          this.jobId = res.jobId;
          this.status = 'QUEUED';
          this.errorMessage = '';
          this.startPolling();
        },
        error: (error: any) => {
          console.error('Upload error:', error);
          this.status = 'ERROR';
          const errorMsg = this.getErrorMessage(error);
          this.errorMessage = errorMsg;
          console.error('Detailed error:', error);
        }
      });
  }

  startPolling(): void {
    this.stopPolling(); // Clear existing if any
    this.pollingInterval = setInterval(() => {
      this.checkStatus();
    }, 2000);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  checkStatus(): void {
    if (!this.jobId) {
      return;
    }

    console.log('Checking status for job:', this.jobId);
    this.api.getJob(this.jobId).subscribe({
      next: (job: any) => {
        console.log('Job status:', job);
        this.status = job.status;
        this.progress = job.progress || 0;
        this.etr = job.estimatedTimeRemaining || '';
        this.activity = job.activity || '';

        if (this.status === 'COMPLETED' || this.status === 'FAILED') {
          this.stopPolling();
        }
      },
      error: (error: any) => {
        console.error('Status check error:', error);
        // Don't stop polling on transient errors, unless 404
        if (error.status === 404) {
          this.stopPolling();
          this.errorMessage = 'Job not found.';
        }
      }
    });
  }

  download(): void {
    if (!this.jobId) {
      this.errorMessage = 'No job ID found. Please upload a file first.';
      return;
    }

    console.log('Downloading job:', this.jobId);
    this.api.getDownload(this.jobId).subscribe({
      next: (res: any) => {
        console.log('Download response:', res);
        this.errorMessage = '';
        window.open(res.url, '_blank');
      },
      error: (error: any) => {
        console.error('Download error:', error);
        const errorMsg = this.getErrorMessage(error);
        this.errorMessage = errorMsg;
      }
    });
  }
}
