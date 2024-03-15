import { Component } from '@angular/core';
import { ResisterApiService } from '../../../shared/register-api.service';
import { Router } from '@angular/router';
import { ProfileService } from '../my-profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-communication',
  templateUrl: './edit-communication.component.html',
  styleUrls: ['./edit-communication.component.css']
})
export class EditCommunicationComponent {
  userEmail: string = '';
  userPhone: string = '';
  usernameIsEmail: boolean = true; 
  selectedCountryCode = '+234';

  constructor(
    private registerApiService: ResisterApiService,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditCommunicationComponent>
  ) {


  }
  
  ngOnInit() {
    this.profileService.getPlayerProperties().subscribe(
      (data) => {
        if (data && data.properties) {
          const username = data.properties.find(prop => prop.property === 'username');
          const mobileNumber = data.properties.find(prop => prop.property === 'mobileNumber');
          const email = data.properties.find(prop => prop.property === 'email');
          if (username && username.value !== "") {
            // Check if username is email
            this.usernameIsEmail = this.isValidEmail(username.value);
          }
          if (mobileNumber && mobileNumber.value !== "") {
            this.userPhone = mobileNumber.value;
          }
          if (email && email.value !== "") {
            this.userEmail = email.value;
          }
        } else {
          console.error('Invalid response structure');
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  saveUserData() {
    const property = 'CONTACT_DETAILS';
    const userData = {
      properties: []
    };
    if(this.usernameIsEmail){
      if(!this.userPhone){
        this.showErrorToast('Phone number is required');
        return;
      }
    }else{
      if(!this.userEmail){
        this.showErrorToast('Email ID is required');
        return;
      }
    }
    if (!this.usernameIsEmail && this.userEmail) {
      userData.properties.push({ property: 'email', value: this.userEmail });
    }

    if (this.usernameIsEmail && this.userPhone) {
      userData.properties.push({ property: 'mobileNumber', value: this.userPhone });
    }

    this.registerApiService.saveUserData(userData, property).subscribe(
      (response) => {
        console.log('User data saved successfully:', response);
        this.router.navigate(['edit-profile']);
        setTimeout(() => {
          location.reload();
        }, 0);
      },
      (error) => {
        this.showErrorToast(error.error.description);
      }
    );
  }

  // Function to validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateInput(event: any) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
    const key = event.key;
  
    // Check if the pressed key is not a number or is not an allowed key
    if (!/^\d$/.test(key) && !allowedKeys.includes(key)) {
      event.preventDefault();
    }
  }

  showErrorToast(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 5000,
      positionClass: 'toast-top-right',
    });
  }
  onKeyPress(event: KeyboardEvent) {
		const allowedChars = /[0-9]/;

		// Get the current value of the input
		let inputValue = (event.target as HTMLInputElement).value;

		// Check if the input already starts with '+'
		if (!inputValue.startsWith('+')) {
			// If user removed '+', allow typing it again
			if (event.key === '+' && inputValue === '') {
				return;
			}
			event.preventDefault();
			this.selectedCountryCode = '+' + inputValue; // Add '+' to the beginning of the input
		}

		// Check if the typed character is a number
		const inputKey = event.key;
		if (!allowedChars.test(inputKey)) {
			event.preventDefault();
		}
	}

  closeDialog(): void {
    this.dialogRef.close();
  }
}