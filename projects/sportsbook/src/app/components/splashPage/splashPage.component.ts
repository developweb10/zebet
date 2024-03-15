// footer.component.ts
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';
import { SplashPage } from './splashPage.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from '../../user.service';
import { AuthService } from '../../modules/auth/auth.service';
import { ApiService } from '../../modules/header/header/api.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TokenService } from '../../services/token-service';
import { LoginResponse } from '../../modules/auth/login-details';
import { EncryptionService } from '../../encryption.service';
import { UserBalanceService } from '../../modules/header/header/balance.service';
import { BettingService } from '../../services/betting-service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-splashPage',
  templateUrl: './splashPage.component.html',
  styleUrls: ['./splashPage.component.css'],
})
export class SplashComponent implements OnInit {
  @ViewChild('infoIcon') infoIcon!: ElementRef;
  @ViewChild('popupMessage') popupMessage!: ElementRef;
  splash: any;
  cards: any[] = [];
  supported_payment_method_images: any[] = [];
  isVisible: boolean = false;
  showInitialContent: boolean = true;
  actType: string = '1';
  phoneNumber: string = '';
  selectedCountryCode: string = '';
  user_email: string = '';
  responseData: any;
  errorMessage: string = '';
  password: string = '';
  topNavItems: any;
  topNavlogo: any;
  error: any;
  isLoggedIn: boolean = false;
  isEmailSelected: boolean = true;
  isPhoneNumberSelected: boolean = true;
  loginMethod: string = 'email';
  selectedOption: string = '2';
  country: string = '234';
  loginCode: string = 'loginCode';
  isMenuVisible: boolean = false;
  isMediumScreen: boolean = false;
  storedData = localStorage.getItem('accessToken');
  ASSETS_URL = environment.ASSETS_URL;
  _tokenService = inject(TokenService);
  isLoading: boolean = false;
  userBalanceService = inject(UserBalanceService);
  bettingService = inject(BettingService);
  toastr = inject(ToastrService);
  showSplashScreen : boolean = false;
  toggleInputType() {
    console.log('Selected option:', this.selectedOption);
    if (this.selectedOption == '1') {
      this.isPhoneNumberSelected = false;
    } else {
      this.isPhoneNumberSelected = true;
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
    private footerService: SplashPage,
    private userService: UserService,
    private httpClient: HttpClient,
    private encryptionService: EncryptionService,
    private loaderService: LoaderService,
  ) {
      if(this.authService.getFncToken() !== null){
        this.router.navigate(['/sports-book'])  
      }else{
        this.showSplashScreen = true;
      }
  }

  ngOnInit(): void {
    //alert(this.authService.getFncToken())
    if(this.authService.getFncToken() !== null)
      this.router.navigate(['/sports-book'])

    this.footerService.getFSplashPage().subscribe((data) => {
      this.splash = data.data;
      this.cards = data.data.cards;
      this.supported_payment_method_images =
        data.data.supported_payment_method_images;
      console.log('splash', this.splash);
    });
    // setTimeout(() => {
    //   this.showInitialContent = true;
    // });
    // if (this.userService.isNewUserCheck()) {

    // } else {

    // }
    // this.userService.markAsVisited();
  }

  // login with header//
  // async login() {
  //   this.isLoading = true;
  //   const url = environment.Log_In_API;
  //   const accessToken = this.authService.getAccessToken();
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${accessToken}`,
  //   });

  //   let body = {};
  //   let error = {};
  //   console.log(this.selectedOption);
  //   if (this.selectedOption === '2') {
  //     const phone_number = document.getElementById(
  //       'phoneNumber'
  //     ) as HTMLInputElement;
  //     const loginType = document.getElementById(
  //       'loginCode'
  //     ) as HTMLInputElement;
  //     body = {
  //       email: '',
  //       phone_number: phone_number.value,
  //       country_code: loginType.value,
  //       password: this.password,
  //     };
  //   } else {
  //     body = {
  //       email: this.user_email,
  //       phone_number: '',
  //       password: this.password,
  //     };
  //   }

  //   this.http.post<any>(url, body, { headers }).subscribe(
  //     (response) => {
  //       console.log('login Response:', response);

  //       if (response.status === 'SUCCESS') {
  //         this.isLoading = false;
  //         console.log('login sucess');
  //         localStorage.setItem(
  //           'fnc_accessToken',
  //           response.data.fnc_logged_in_data.access_token
  //         );

  //         localStorage.setItem('accessToken', response.data.access_token);

  //         this._tokenService.setTokenDetails({
  //           accessToken: response.data.fnc_logged_in_data.access_token,
  //           email: response.data.email,
  //           phone_number: response.data.phone_number,
  //           fnc_accessToken: response.data.fnc_logged_in_data.access_token,
  //         });
  //         // Redirect or perform any necessary actions upon successful login
  //         this.router.navigate(['/sports-book']);
  //         this.isLoggedIn = true;
  //         setTimeout(() => {
  //           location.reload();
  //         }, 0);
  //       }
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       if (error.status === 401) {
  //         alert(error.error.message_key);
  //       }
  //       else {
  //         this.router.navigate(['/auth/login-account']);
  //       }
  //     }
  //   );
  // }
  async login() {
    this.isLoading = true;
    const url = environment.Log_In_API;
    const accessToken = this.authService.getAccessToken();
    const fnc_accessToken = this.authService.getFncToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      fnc_token: `Bearer ${fnc_accessToken}`,
    });

    let body = {};
    let error = {};
    console.log(this.selectedOption);
    if (this.selectedOption === '2') {
      const phone_number = document.getElementById(
        'phoneNumber'
      ) as HTMLInputElement;
      const loginType = document.getElementById(
        'loginCode'
      ) as HTMLInputElement;
      body = {
        email: '',
        phone_number: phone_number.value,
        country_code: loginType.value,
        password: this.password,
        deviceFingerprint: {
          availableResolution: '1920x1080',
          browserCanvasCapability: 'true',
          browserIndexedDBEnabled: 'true',
          browserLanguage: 'en-US',
          browserSessionStorageEnabled: 'true',
          browserType: 'Chrome',
          browserVersion: '94.0.4606.81',
          browserWebGLVersion: '2.0',
          colorDepth: '32-bit',
          deviceResolution: '2560x1440',
          deviceType: 'Desktop',
          installedBrowserPlugins: 'Adobe Flash Player, Java Plugin',
          operatingSystem: 'Windows 10',
          screenResolution: '2560x1440',
          timeZone: 'UTC+00:00',
        },
      };
    } else {
      body = {
        email: this.user_email,
        phone_number: '',
        password: this.password,
        deviceFingerprint: {
          availableResolution: '1920x1080',
          browserCanvasCapability: 'true',
          browserIndexedDBEnabled: 'true',
          browserLanguage: 'en-US',
          browserSessionStorageEnabled: 'true',
          browserType: 'Chrome',
          browserVersion: '94.0.4606.81',
          browserWebGLVersion: '2.0',
          colorDepth: '32-bit',
          deviceResolution: '2560x1440',
          deviceType: 'Desktop',
          installedBrowserPlugins: 'Adobe Flash Player, Java Plugin',
          operatingSystem: 'Windows 10',
          screenResolution: '2560x1440',
          timeZone: 'UTC+00:00',
        },
      };
    }

    this.http.post<LoginResponse>(url, { body : this.encryptionService.encrypt(JSON.stringify(body)) }, { headers }).subscribe(
      (response) => {
        console.log('Response:', response);
        this.isLoading = false;
        if (response.status === 'SUCCESS') {
          localStorage.setItem('accessToken', response.data.access_token);
          localStorage.setItem('refreshToken', response.data.refresh_token);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('phone_number', response.data.phone_number);
          localStorage.setItem('user_id', response.data.user_id);
          localStorage.setItem(
            'fnc_accessToken',
            response.data.fnc_logged_in_data.access_token
          );

          localStorage.setItem(
            'fnc_refreshToken',
            response.data.fnc_logged_in_data.refreshToken
          );

          this._tokenService.setTokenDetails({
            accessToken: response.data.access_token,
            email: response.data.email,
            phone_number: response.data.phone_number,
            fnc_accessToken: response.data.fnc_logged_in_data.access_token,
          });

          this.userBalanceService.populateUserBalance().subscribe(balance => {
            this.userBalanceService.setUserBalance(balance);
            this.bettingService.setLoginStatus(true);
            // Redirect to '/sports-book'
            this.loaderService.setLoggedIn(true);
            this.isLoggedIn = true;
            
            this.router.navigate(['/sports-book']);
          });
        }
      },
      (error) => {
        this.isLoading = false;
        //if (error.status === 401) {
          this.errorMessage = error.error.message_key;
          this.toastr.error(this.errorMessage);
          
        // } else {
        //   this.router.navigate(['/login-account']);
        // }
      }
    );
  }

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  getPaymentMethodImageUrl(directus_files_id: string): string {
    const imageUrl = this.ASSETS_URL + `files/${directus_files_id}`;
    console.log('Image URL:', imageUrl);
    return imageUrl;
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    margin: 20,
    pullDrag: false,
    autoplay: true,
    dots: false,
    autoplayTimeout: 5000,
    navSpeed: 700,
    navText: [
      '<img src="assets/img/arrow-left.png">',
      '<img src="assets/img/arrow-right.png">',
    ],
    responsive: {
      0: {
        items: 1.2,
      },
      768: {
        items: 3,
      },
    },
    nav: true,
  };
  ngAfterViewInit(): void {
    // Add mouseover and mouseout event listeners to the info icon
    this.infoIcon.nativeElement.addEventListener('mouseover', () => {
      this.showPopup();
    });

    this.infoIcon.nativeElement.addEventListener('mouseout', () => {
      this.hidePopup();
    });
  }

  showPopup() {
    this.popupMessage.nativeElement.style.display = 'block';
  }

  hidePopup() {
    this.popupMessage.nativeElement.style.display = 'none';
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
}
