import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KycService } from './kyc.service';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../../encryption.service';
import { Kyc } from './kyc.interface';
import { timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as JSZip from 'jszip';
import '@smile_identity/smart-camera-web';
import { Router } from '@angular/router';

enum KycScreensEnum {
	SelectKycMethod = 'kyc-selection',
	KycwithoutSelfieForm = 'Kyc-form-without-selfie',
	KycDocsProcess = 'Kyc-Documents-processing',
	kycResultOverview = 'Kyc-result-overview',
	kycWithSelfie = 'Kyc-form-with-selfie',
}

@Component({
	selector: 'app-kyc-updated',
	templateUrl: './kyc-updated.component.html',
	styleUrls: ['./kyc-updated.component.css'],
})
export class KycUpdatedComponent implements OnInit, OnDestroy, OnChanges {
	showUploadModal = false;
	showStartKyc = true;
	selectedFileName: string;
	cancel = false;
	selectedDoc = '';
	date: Date = null;
	showSuccess = false;

	showOptions: boolean = true;
	// if showOptions is True, we want to show both options to the user

	withSelfie: boolean = false;
	withoutSelfie: boolean = false;

	kycScreens = KycScreensEnum;

	activeScreen = this.kycScreens.SelectKycMethod;
	isShowCardSample: boolean = false;
	kycResultOverview: boolean = false;
	kycRejectedStatus: boolean = false;

	selectedImage: string;
	kycWithoutSelfieForm: FormGroup;
	kycWithSelfieForm: FormGroup;
	isLoading: boolean = false;

	kycResultData: Kyc;
	isShowWebcam = false;
	webcamImage: string = '';
	withSelfieDocument: File;
	docVerificationUploadUrl: Object;
	imagesComputed: {
		images: Array<object>;
		partner_params: { libraryVersion: string; permissionGranted: boolean };
	};

	@Input() kycStatus: number = -1;
	@Input() kycResult: Kyc;
	@Output() close: EventEmitter<boolean> = new EventEmitter();
	validationMessage: string = ''

	constructor(
		private fb: FormBuilder,
		private kycService: KycService,
		private toaster: ToastrService,
		private encryptionService: EncryptionService,
		private el: ElementRef,
		private renderer: Renderer2,
		private router: Router,
	) {
		this.initializeKycWithoutSelfieForm();
		this.initializeKycWithSelfieForm();
	}
	ngOnDestroy(): void {
		this.kycStatus = -1
	}

	ngOnInit(): void {}

	ngOnChanges(changes:SimpleChanges){
		if(this.kycStatus === 1) {
			this.activeScreen = this.kycScreens.kycResultOverview;
			this.kycRejectedStatus = false;
			this.kycResultData = this.kycResult;
		}else if(this.kycStatus === 0) {
			this.activeScreen = this.kycScreens.kycResultOverview;
			this.kycRejectedStatus = true;
			this.kycResultData = this.kycResult;
		}
	}

	private setupEventListeners(): void {
		setTimeout(() => {
			const smartCameraElement =
				this.el.nativeElement.querySelector('smart-camera-web');
			if (smartCameraElement) {
				this.renderer.listen(
					smartCameraElement,
					'imagesComputed',
					(event: CustomEvent) => {
						this.imagesComputed = event.detail;
						this.webcamImage = 'true';
						this.isShowWebcam = false;
					}
				);
			}
		}, 0);
	}

	initializeKycWithoutSelfieForm() {
		this.kycWithoutSelfieForm = this.fb.group({
			id_type: ['', [Validators.required]],
			id_number: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
		});
	}

	initializeKycWithSelfieForm() {
		this.kycWithSelfieForm = this.fb.group({
			id_type: ['', [Validators.required]],
		});
	}

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

	displayKycMehtodsSelction() {
		this.activeScreen = this.kycScreens.SelectKycMethod;
	}

	displayKycWithoutSelfieForm() {
		// if(this.kycStatus !== 1){
			this.activeScreen = this.kycScreens.KycwithoutSelfieForm;
			// this.activeScreen = this.kycScreens.kycResultOverview;
		// }
	}

	displayDocsProcessing() {
		this.isLoading = true;

		const signature = this.encryptionService.generateKYCSignature();
		const payload = {
			source_sdk: 'rest_api',
			source_sdk_version: '1.0.0',
			partner_id: this.kycService.partnerId,
			timestamp: this.encryptionService.timeStamp,
			signature: signature,
			country: 'NG',
			id_type: this.kycWithoutSelfieForm.value.id_type,
			id_number: this.kycWithoutSelfieForm.value.id_number,
			callback_url: this.kycService.callbackUrl,
			first_name: '',
			middle_name: '',
			last_name: '',
			phone_number: '',
			dob: '',
			gender: '',
			partner_params: {
				// job_id: uuidv4(),
				job_id: localStorage.getItem('user_id'),
				user_id: localStorage.getItem('user_id'),
				job_type: 5,
			},
		};

		this.kycService.enhancedKyc(payload).subscribe({
			next: (response) => {
				if (response['success']) {
					this.isLoading = false;
					this.activeScreen = this.kycScreens.KycDocsProcess;
					timer(10000)
						.pipe(tap(() => this.checkKycStatus(payload.partner_params.job_id)))
						.subscribe();
				} else {
					this.toaster.error(response['error']['error']);
					this.isLoading = false;
				}
			},
			error: (error) => {
				this.isLoading = false;
				this.toaster.error(error['error']["error"]);
			},
		});
	}

	updatePatternValidations(event: Event) {
		const control = this.kycWithoutSelfieForm.get('id_number');
		const element = event.target as HTMLInputElement;

		if (element.value === 'NIN_SLIP') {
			control.setValidators([
				Validators.pattern(/^[0-9]{11}$/),
				Validators.required,
			]);
			this.validationMessage = 'Invalid NIN SLIP Number';
		} else if (element.value === 'DRIVERS_LICENSE') {
			control.setValidators([
				Validators.required,
				Validators.pattern(/^[a-zA-Z]{3}([ -]{1})?[A-Z0-9]{6,12}$/i),
			]);
			this.validationMessage = 'Invalid DRIVERS LICENSE Number';

		} else if (element.value === 'VOTER_ID') {
			control.setValidators([
				Validators.pattern(/^(INC[A-Za-z0-9]{17}|[A-Za-z0-9]{19,20})$/),
				Validators.required,
			]);
			this.validationMessage = 'Invalid VOTER ID Number';

		}
		control.updateValueAndValidity();
	}

	showCardSample() {
		this.isShowCardSample = true;
	}

	displayKycSelfieForm() {
		if(this.kycStatus !== 1){
			this.withSelfie = true;
			this.activeScreen = this.kycScreens.kycWithSelfie;
		}
	}

	selectKycFile() {
		document.getElementById('uploadKycFile')?.click();
	}

	uploadKycFile(event: Event) {
		const element = event.target as HTMLInputElement;
		if (element.files && element.files.length > 0) {
			const file = element.files[0];
			this.withSelfieDocument = file;
			const allowedExtensions = ['.jpg', '.jpeg'];
			const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

			if (allowedExtensions.includes('.' + fileExtension)) {
				const reader = new FileReader();
				reader.onload = (e) => {
					this.selectedImage = e.target?.result as string;
					this.kycWithSelfieForm
						.get('documentImage')
						.setValue(this.selectedImage);
				};
				reader.readAsDataURL(file);
			} else {
				console.error('Invalid file type. Please select a JPG or JPEG file.');
			}
		} else {
			console.error('No file selected');
		}
	}

	checkKycStatus(jobId?: string) {
		const signature = this.encryptionService.generateKYCSignature();
		const payload = {
			signature: signature,
			timestamp: this.encryptionService.timeStamp,
			user_id: localStorage.getItem('user_id'),
			job_id: jobId ? jobId : localStorage.getItem('user_id'),
			partner_id: this.kycService.partnerId,
			image_links: true,
			history: false,
		};

		this.kycService.checkKycStatus(payload).subscribe({
			next: (response: Kyc) => {
				const successCodes = ['1012', '0810'];
				this.kycResultData = response;
				const result = response?.result;
				if (result && successCodes.includes(result['ResultCode'])) {
					this.activeScreen = this.kycScreens.kycResultOverview;
				} else {
					this.activeScreen = this.kycScreens.kycResultOverview;
					this.kycRejectedStatus = true;
				}
			},
			error: (error) => {},
		});
	}

	onCopied(event: boolean): void {
		this.toaster.success('Code copied to clipboard');
	}

	resubmitKyc() {
		if (!this.withSelfie) {
			this.activeScreen = this.kycScreens.KycwithoutSelfieForm;
			this.kycRejectedStatus = false;
		} else {
			this.activeScreen = this.kycScreens.kycWithSelfie;
			this.kycRejectedStatus = false;
			this.webcamImage = null;
		}
	}

	submitKycWithSelfie() {
		this.isLoading = true;
		const payload = {
			source_sdk: 'rest_api',
			source_sdk_version: '1.0.0',
			file_name: 'upload.zip',
			smile_client_id: this.kycService.partnerId,
			signature: this.encryptionService.generateKYCSignature(),
			timestamp: this.encryptionService.timeStamp,
			partner_params: {
				user_id: localStorage.getItem('user_id'),
				// job_id: uuidv4(),
				job_id: localStorage.getItem('user_id'),
				job_type: 6,
			},
			model_parameters: {},
			callback_url: this.kycService.callbackUrl,
		};

		this.kycService.documentVerificationUploadUrl(payload).subscribe({
			next: (response) => {
				this.docVerificationUploadUrl = response;
				this.generateZipFile(payload.partner_params.job_id);
			},
			error: (error) => {
				this.isLoading = false;
				this.toaster.error(error['error']['error']);
			},
		});
	}

	generateZipFile(jobId: string) {
		const id_info = {
			package_information: {
				apiVersion: {
					buildNumber: 0,
					majorVersion: 2,
					minorVersion: 0,
				},
			},
			id_info: {
				country: 'NG',
				id_type: this.kycWithSelfieForm.value.id_type,
			},
			images: this.imagesComputed.images,
		};
		const zip = new JSZip();
		zip.file('info.json', JSON.stringify(id_info));
		return zip.generateAsync({ type: 'blob' }).then((content) => {
			this.uploadDocumentsToSmile(content, jobId);
		});
	}

	uploadDocumentsToSmile(content, jobId) {
		const payload = {};
		this.kycService
			.uploadKYCDocuments(this.docVerificationUploadUrl['upload_url'], content)
			.subscribe({
				next: (res) => {
					this.isLoading = false;
					this.activeScreen = this.kycScreens.KycDocsProcess;
					timer(15000)
						.pipe(tap(() => this.checkKycStatus(jobId)))
						.subscribe();
				},
				error: (error) => {
					this.isLoading = false;
					this.toaster.error(error['error']['error']);
				},
			});
	}

	openWebcam() {
		this.isShowWebcam = true;
		this.setupEventListeners();
	}

	webcamImageCaptured(image: any) {
		this.webcamImage = image;
		this.kycWithSelfieForm.get('webcamImage').setValue(this.webcamImage);
	}

	webcamIsImageCaptured(status: boolean) {
		if (status) this.isShowWebcam = false;
	}

	clearWebcamImage() {
		this.webcamImage = '';
		this.kycWithSelfieForm.get('webcamImage').setValue(this.webcamImage);
	}

	routeToSports() {
		this.router.navigate(['sports-book']);
	}

	goHome(){
		this.close.emit(true);
	}
}
