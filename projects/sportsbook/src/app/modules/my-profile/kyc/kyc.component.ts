import { Component } from '@angular/core';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css'],
})
export class KycComponent {
  showUploadModal = false;
  showStartKyc = true;
  selectedFileName: string;
  cancel = false;
  selectedDoc = '';
  date: Date = null;
  showSuccess = false;
  showHide() {
    this.showUploadModal = true;
    this.showStartKyc = false;
    this.showSuccess = false;
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.selectedFileName = selectedFile.name;
      this.cancel = true;
    } else {
      this.selectedFileName = null;
    }
  }

  removeFile() {
    this.selectedFileName = null;
    this.cancel = false;
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
  updateSelectedDocument(value) {
    this.selectedDoc = value;
  }
  uploadDoc() {
    this.showSuccess = true;
    this.showStartKyc = false;
    this.showUploadModal = false;
  }
}
