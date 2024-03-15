import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResisterApiService } from '../../../shared/register-api.service';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../my-profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent {
  userProfile: any = {
    firstName: '',
    lastName: '',
  }
  selectedGender: string = 'Male';
  selectedDate: Date;
  isAgeLessThan18 = false;
  showTransactions: boolean = false;
  selectedFile: File | null = null;
  photoUploaded = false;
  uploadedPhotoUrl: string | null = null;
  selectedNationalIdentityNumber: string   = '';
  disableNIN: boolean = false;
  disableDob: boolean = false;
  disableGender: boolean = false;

  getToday(): string {
    // Get the current date in the format 'YYYY-MM-DD'
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  constructor(private router: Router, private registerApiService: ResisterApiService, private http: HttpClient, private profileService: ProfileService,private toastr: ToastrService,private dialogRef: MatDialogRef<ProfileUpdateComponent>) {
  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0] as File;
    if (selectedFile) {
      // Handle the selected file
      console.log('Selected file:', selectedFile);

      // Set photoUploaded to true when the photo is successfully uploaded
      this.photoUploaded = true;

      // Set the uploadedPhotoUrl to the URL of the uploaded photo
      // For example, if you are using FileReader:
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedPhotoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(selectedFile);
    }
  }


  ngOnInit() {



    this.profileService.getPlayerProperties().subscribe(
      (data) => {
        if (data && data.properties) {
          const selectedDate = data.properties.find(prop => prop.property === 'dateOfBirth');
          const gender = data.properties.find(prop => prop.property === 'gender');
          const firstName = data.properties.find(prop => prop.property === 'firstName');
          const lastName = data.properties.find(prop => prop.property === 'lastName');
          const NIN = data.properties.find(prop => prop.property === 'nationalIdentityNumber');
          if (selectedDate || gender || firstName || lastName) {
            this.selectedDate = selectedDate.value;
            this.selectedGender = gender.value;
            this.userProfile.firstName = firstName.value;
            this.userProfile.lastName = lastName.value;
            this.selectedNationalIdentityNumber = NIN.value;
            if(NIN.value){
              this.disableNIN = true;
            }
            if(gender.value){
              this.disableGender = true;
            }
            if(selectedDate.value){
              this.disableDob = true;
            }
          }

          else {
            console.error('personal details not found in the response');
          }
        }

        else {
          console.error('Invalid response structure');
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.userProfile.firstName = this.userProfile.firstName || '';
    this.userProfile.lastName = this.userProfile.lastName || '';


    const storedGender = this.selectedGender;
    if (storedGender) {
      this.selectedGender = storedGender;
    }
    // Now userDetails is an object again and can be used as needed
  }
  onGenderChange() {
    // Update local storage when the gender changes
    this.selectedGender = this.selectedGender;
  }
  onSubmit() {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      // Adjust the URL based on your server endpoint
      const uploadUrl = 'https://example.com/upload';

      this.http.post(uploadUrl, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully', response);
          // Handle success, e.g., show a success message to the user
        },
        (error) => {
          console.error('Error uploading file', error);
          // Handle error, e.g., show an error message to the user
        }
      );
    } else {
      console.warn('No file selected');
      // Handle case where no file is selected
    }
  }

  saveUserData() {
    const property = 'PERSONAL_DATA'
    const userBirthdate = new Date(this.selectedDate);
    const today = new Date();

    const ageDiff = today.getFullYear() - userBirthdate.getFullYear();
    const monthDiff = today.getMonth() - userBirthdate.getMonth();

    const isAgeLessThan18 = ageDiff < 18 || (ageDiff === 18 && monthDiff < 0);

    // Display error if age is less than 18
    this.isAgeLessThan18 = isAgeLessThan18;

    // Proceed with saving data if age is 18 or older
    if (!isAgeLessThan18) {
      const formattedDate = this.formatDate(userBirthdate);

      const userData = {
        "properties": [
          {
            "property": "gender",
            "value": this.selectedGender
          },
          {
            "property": "dateOfBirth",
            "value": formattedDate
          },

        ]

      };

      this.registerApiService.saveUserData(userData, property).subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
  
          const propertyNIN = 'PERSONAL_DOCUMENTS';
          const NIN = {
            properties: [
              { property: 'nationalIdentityNumber', value: String(this.selectedNationalIdentityNumber) },
            ],
          };
  
          this.registerApiService.saveUserData(NIN, propertyNIN).subscribe(
            (responseNIN) => {
              console.log('User NIN data saved successfully:', responseNIN);
              this.router.navigate(['edit-profile']);
              setTimeout(() => {
                location.reload();
              }, 0);
            },
            (errorNIN) => {
              console.error('Error saving NIN data:', errorNIN);
              this.showErrorToast("Enter 11-digit numeric NIN");
              // Handle NIN data save error here
            }
          );
        },
        (error) => {
          console.error('Error saving user data:', error.error.description);
          this.showErrorToast(error.error.description);
          // Handle user data save error here
        }
      );
    }


  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
    const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed

    return `${year}-${month}-${day}`;
  }

  showErrorToast(message: string) {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}
  closeDialog(): void {
    this.dialogRef.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    // Get the current value of the input
    const currentValue = (event.target as HTMLInputElement).value;

    // Get the key that was pressed
    const key = event.key;

    // Check if the key is a digit or Backspace/Delete
    const isDigit = /^\d$/.test(key);
    const isBackspaceOrDelete = key === 'Backspace' || key === 'Delete';

    // Check if the input already has 11 digits
    const hasReachedMaxLength = currentValue.length >= 11;

    // Prevent further input if:
    // 1. The input already has 11 digits and the pressed key is not Backspace/Delete
    // 2. The pressed key is not a digit and not Backspace/Delete
    if ((hasReachedMaxLength && !isBackspaceOrDelete) || (!isDigit && !isBackspaceOrDelete)) {
      event.preventDefault();
    }
  }

  isValidNIN(): boolean {
    return this.selectedNationalIdentityNumber && // Check if selectedNationalIdentityNumber is not null
           this.selectedNationalIdentityNumber.length === 11 && // Check length only if it's not null
           /^\d+$/.test(this.selectedNationalIdentityNumber); // Additional validation
  }
  

}


