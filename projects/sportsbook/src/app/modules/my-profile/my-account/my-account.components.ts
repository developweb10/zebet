import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProfileUpdateComponent } from '../profile-update/profile-update.component';
import { EditAddressComponent } from '../edit-address/edit-address.component';
import { EditCommunicationComponent } from '../edit-communication/edit-communication.component';
import { OtherSettingsComponent } from '../other-settings/other-settings.component';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from '../my-profile/profile.service';

interface ApiResponse {
  status: string;
  message_key?: string;
}

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  userDetails: any
  userDetailsString: any;
  userProfilestring: any;
  userProfile: any;
  isPopupOpen = true;
  showMyAccountSection = true;
  isLoggedIn: boolean = true;
  errorMessage: string = '';
  email: any;
  phone_number: any;
  date: string;
  showTransactions: boolean = false;
  showBetHistory: boolean = false;
  address: any
  address2: any
  city: any
  postCode: any
  countrie: any
  firstName: any
  lastname: any
  dob: any
  gender: any
  language: any
  currency: any;
  NIN: any
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private router: Router,
    private http: HttpClient
  ) { }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkWindowSize();
  }

  ngOnInit() {
    this.checkWindowSize();

    this.profileService.getPlayerProperties().subscribe(
      (data) => {
        if (data && data.properties) {
          const address = data.properties.find(prop => prop.property === 'address');
          const email = data.properties.find(prop => prop.property === 'email');
          const address2 = data.properties.find(prop => prop.property === 'address2');
          const city = data.properties.find(prop => prop.property === 'city');
          const postCode = data.properties.find(prop => prop.property === 'postCode');
          const countrie = data.properties.find(prop => prop.property === 'country');
          const firstName = data.properties.find(prop => prop.property === 'firstName');
          const lastname = data.properties.find(prop => prop.property === 'lastName');
          const dob = data.properties.find(prop => prop.property === 'dateOfBirth');
          const gender = data.properties.find(prop => prop.property === 'gender');
          const language = data.properties.find(prop => prop.property === 'language');
          const currency = data.properties.find(prop => prop.property === 'currency');
          const phoneNumber = data.properties.find(prop => prop.property === 'mobileNumber');
          const NIN = data.properties.find(prop => prop.property === 'nationalIdentityNumber');

          if (firstName || lastname ||   dob || gender ||phoneNumber || email || language || currency || address || address2 || city || postCode || countrie ) {
            this.firstName = firstName.value
            this.lastname = lastname.value
            this.dob = dob.value
            this.gender = gender.value
            this.email = email.value
            this.phone_number = phoneNumber.value
            this.language = language.value
            this.currency = currency.value
            this.address = address.value;
            this.address2 = address2.value
            this.city = city.value
            this.countrie = countrie.value
            this.postCode = postCode.value
            this.NIN = NIN.value

            console.log("1234567890console", this.phone_number)
          }

          else {
            console.error('address not found in the response');
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

  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }

  toggleBetHistory() {
    this.showBetHistory = !this.showBetHistory;
  }

  openPopup() {
    this.isPopupOpen = false;
  }
  private checkWindowSize() {
    // Adjust the condition based on your desired screen sizes
    this.isPopupOpen = window.innerWidth <= 1024; // Example: open on screens smaller than or equal to 768 pixels
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(ProfileUpdateComponent, {
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'dialogBox-bottom',
      // Adjust the width as needed

      // Add any other MatDialogConfig options here
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // You can add logic to handle the result if needed
    });
  }
  openEditAddressDialog(): void {
    const dialogAddress = this.dialog.open(EditAddressComponent, {
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'dialogBox-bottom',
      // Adjust the width as needed

      // Add any other MatDialogConfig options here
    });

    dialogAddress.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // You can add logic to handle the result if needed
    });
  }

  openEditCommunicationDialog(): void {
    const dialogCommunication = this.dialog.open(EditCommunicationComponent, {
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'dialogBox-bottom',
      // Adjust the width as needed

      // Add any other MatDialogConfig options here
    });

    dialogCommunication.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // You can add logic to handle the result if needed
    });
  }

  openEditCurrenciesDialog(): void {
    const dialogCommunication = this.dialog.open(OtherSettingsComponent, {
      maxWidth: '100vw',
      width: '100vw',
      panelClass: 'dialogBox-bottom',
    });

    dialogCommunication.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // You can add logic to handle the result if needed
    });
  }

  logout() {
    const signOutUrl = environment.Sign_Out_API;

    const access_token = this.authService.getAccessToken();
    const fnc_accessToken = this.authService.getFncToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
      fnc_token: `Bearer ${fnc_accessToken}`,
    });

    this.http.post<ApiResponse>(signOutUrl, {}, { headers }).subscribe(
      (response) => {
        console.log('Sign-Out Response:', response);

        if (response.status === 'SUCCESS') {
          this.isLoggedIn = false;
          this.router.navigate(['/auth/login-account']);
          setTimeout(() => {
            location.reload();
          }, 0);
        } else {
          console.error('Sign-Out failed:', response);

          // to('Sign-Out Failed. Please try again.'); // You can customize this message or handle the error differently
        }
      },
      (error) => {
        console.error('Sign-Out Error:', error);
        this.errorMessage = error.error.message_key;
        this.showErrorToast(this.errorMessage);
        // You can customize this message or handle the error differently
      }
    );
  }
  showErrorToast(message: string) {
    this.toastr.error(message, 'Error', {
      closeButton: true,
      timeOut: 5000, // Display duration in milliseconds
      positionClass: 'toast-top-right', // You can change the position as per your design
    });
  }

  goHome() {
    this.close.emit(true);
  }

  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
