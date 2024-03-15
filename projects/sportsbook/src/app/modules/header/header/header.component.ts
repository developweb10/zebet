import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  Renderer2,
  inject,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from '../../auth/auth.service';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { UserBalanceService } from './balance.service';
import { TokenService } from '../../../services/token-service';
import { AuthLogoutService } from '../../my-profile/my-profile/authlogout.service';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from "ngx-cookie-service";
import {
  Modal,
  Ripple,
  initTE,
} from "tw-elements";
import { NotificationComponent } from '../notification/notification';
import { NotificationService } from '../notification/notification.service';
import { LoaderService } from '../../../services/loader.service';
import { ProfileService } from '../../my-profile/my-profile/profile.service';
import { BettingService } from '../../../services/betting-service';
import { ToastrService } from 'ngx-toastr';
import { EncryptionService } from '../../../encryption.service';
import { LoginResponse } from '../../auth/login-details';
initTE({ Modal, Ripple });

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  storedData: boolean;
  isBalanceLoaded: boolean;
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
  isLoggedIn: boolean = true;
  isEmailSelected: boolean = true;
  isPhoneNumberSelected: boolean = true;
  loginMethod: string = 'email';
  selectedOption: string = '2';
  countyCode: string = '+234';
  loginCode: string = 'loginCode';
  isMenuVisible: boolean = false;
  isSmallScreen: boolean = true;
  isMediumScreen: boolean = false;
  isSplashPage: boolean = false;
  isRegisterAccountRoute: boolean = false;
  isBlogAvtive: string = '';
  ASSETS_URL = environment.ASSETS_URL;
  mobile_nav_items: any;
  topNavItemsHide: any;
  userBalanceDetails: any = {};
  showBalance = false;
  iamge_URL =environment.iamge_URL;

  balanceUser: number = 0;

  showLoadingDots = false;
  showRefreshIcon = true;

  notificationProperties: any[] = [];
  showActiveMessageIcon: boolean = false;
  notifications: any[] = [];
  unseenCount: number ;

  _tokenService = inject(TokenService);
  userBalanceService = inject(UserBalanceService);
  bettingService = inject(BettingService);
  toastr = inject(ToastrService);
  isLoggedOut: boolean = false;
  isSmallMobile: boolean = false;

  @ViewChild('menuContainer1') menuContainer1!: ElementRef;
  @ViewChild('menuContainer2') menuContainer2!: ElementRef;
  @ViewChild('menuContainer3') menuContainer3!: ElementRef;
  @ViewChild('menuContainer4') menuContainer4!: ElementRef;

  isUserLoggedOut =
    localStorage.getItem('fnc_accessToken') === null ? true : false;

  get formattedBalance(): string {
    return this.balanceUser.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  shouldShowHeader(): boolean {
    // Get the current URL
    const currentUrl = this.router.url;

    let isFound = false;

    // Check if the current URL matches either /register-account or /login-account
    isFound = !(
      currentUrl.includes('/auth/register-account') ||
      currentUrl.includes('/auth/login-account') ||
      currentUrl.includes('/auth/forgetpassword')
    );

    //alert(isFound)


    return isFound;
  }

  toggleInputType() {
    console.log('Selected option:', this.selectedOption);
    if (this.selectedOption == '1') {
      this.isPhoneNumberSelected = false;
      this.selectedOption = '1'; // Switch to email input
    } else {
      this.isPhoneNumberSelected = true;
      this.selectedOption = '2'; // Switch to phone number input
    }
  }
  isBlogActive: boolean = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService,
    private el: ElementRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private balance: UserBalanceService,
    private authLogoutService: AuthLogoutService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private loaderService: LoaderService,
    private profileService: ProfileService,
    private encryptionService: EncryptionService,
    private cookieService: CookieService,
  ) {
    this.checkScreenWidth();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authLogoutService.getLogoutObservable().subscribe(() => {
      this.handleLogout();
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;

        const currentUrl = this.router.url;

        if (currentUrl.includes('blog')) {
          this.isBlogAvtive = 'Blog';
          // console.log('String found in URL Blog');
        }
        else if (currentUrl.includes('sports-book') && currentUrl.split('/').length < 5) {
          this.isBlogAvtive = 'SPORTS';
        }
        else if (currentUrl.includes('promotion')) {
          this.isBlogAvtive = 'Promotion';
        }
        else if (currentUrl.includes('help')) {
          this.isBlogAvtive = 'Help';
        }
        else {
          this.isBlogAvtive = '';
        }
      }
    });
      }
  isLinkActive(navLink: any): boolean {
    // Implement the logic to check if the link is active
    // You might need to compare the current route with navLink.mobile_nav_items_id.link

    // Example: Check if the link contains a specific string
    if (this.router.url.includes(navLink.mobile_nav_items_id.link)) {
      return true;
    }

    // Add more conditions or logic as needed

    // Default return value if none of the conditions are met
    return false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenWidth();
  }
  private handleLogout() {
    // Update visibility or reset fields based on the logout event
    this.isLoggedOut = true;
    this.cdr.detectChanges();
    // ... your logic here
  }

  checkScreenWidth(): void {
    // Determine the screen width and set isMediumScreen accordingly
    this.isMediumScreen = window.innerWidth >= 768 && window.innerWidth <= 1265;
    
    // Hide the menu when screen size changes to a size other than medium
    if (!this.isMediumScreen) {
      this.isMenuVisible = false;
    }

    window.innerWidth < 350 ? this.isSmallMobile= true : this.isSmallMobile = false;
    this.isSmallScreen = window.innerWidth <= 768;

  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInsideContainer1 = this.menuContainer1?.nativeElement?.contains(event.target as Node);
    const clickedInsideContainer2 = this.menuContainer2?.nativeElement?.contains(event.target as Node);
    const clickedInsideContainer3 = this.menuContainer3?.nativeElement?.contains(event.target as Node);
    const clickedInsideContainer4 = this.menuContainer4?.nativeElement?.contains(event.target as Node);
    const clickedInsideAnyContainer = clickedInsideContainer1 || clickedInsideContainer2 || clickedInsideContainer3 || clickedInsideContainer4 ;

    if (!clickedInsideAnyContainer) {
      this.closeMenu(); // Close both containers if clicked outside
    }
  }
  ngOnInit(): void {

    if (this.authService.isLoggedIn()) {

      this.notificationService.update$.subscribe(() => {
        this.getNotificationProperties();
      });
     }
     else 
     {
        if(localStorage.getItem('fnc_refreshToken') && localStorage.getItem('refreshToken') && this.cookieService.check('keepSignIn'))
        {
          this.authService.handleLogin();
        }
     }

    this.loaderService.isLoggedIn$.subscribe(data => {
      //alert(data)
      this.storedData = data;
      console.log("IsLoggedIn", data)
      if(data)
        this.getUserBalance();
      else
        this.balanceUser = 0;
    })
    //alert(this.storedData)
    this.apiService.getTopNavItems().subscribe(
      (data) => {
        this.topNavItems = data;
        this.topNavlogo = data.data;
        this.mobile_nav_items = data.data.mobile_nav_items;
        localStorage.setItem("mobile_nav_items", JSON.stringify(data.data.mobile_nav_items));
        console.log('Navbaar', this.topNavItems);
      },
      (error) => {
        this.error = error; // Store the error for debugging
        console.error('An error occurred:', error);
        if(localStorage.getItem("mobile_nav_items"))
          this.mobile_nav_items = JSON.parse("mobile_nav_items");
      }
    );

    // this.route.url.subscribe(urlSegments => {
    //   this.isSplashPage = urlSegments.length === 0 || urlSegments[0].path === '';
    // });
    // console.error('this.router.url',this.router.url)
    this.isSplashPage = this.router.url === '/';
    // Use NavigationEnd and cast event to NavigationEnd type
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSplashPage = event.url === '/';
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterAccountRoute = event.url.includes('/auth/register-account');
      }
    });

    this.storedData = this.authService.getFncToken() !== null ? true : false;
    
    if (this.storedData) {
      this.getUserBalance();
    }

    // this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
    //   this.isLoggedIn = isLoggedIn;
    // });

    this.balance.refresh$.subscribe(() => {
      this.refreshUserBalance();
    });
     

  }

  // login with header//
  async login() {
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
        //if (error.status === 401) {
          this.errorMessage = error.error.message_key;
          this.toastr.error(this.errorMessage);
          
        // } else {
        //   this.router.navigate(['/login-account']);
        // }
      }
    );
  }

  getUserBalance() {
    this.isBalanceLoaded = false;
    const requestBody = {
      products: ['sportsbook', 'casino'],
    };

    this.balance.getUserBalance(requestBody).subscribe(
      (data: any[]) => {
        console.log("InspectBal", JSON.stringify(data))
        this.userBalanceDetails = data;
        this.balanceUser = this.userBalanceDetails.real.total.amount;
        this.isBalanceLoaded = true;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  refreshUserBalance() {
    this.showRefreshIcon = false;
    this.showLoadingDots = true;
    this.showBalance = true;

    this.balance.populateUserBalance().subscribe(
      (data: any) => {
        this.userBalanceService.setUserBalance(data);
        this.userBalanceDetails = data;
        this.balanceUser = this.userBalanceDetails.real.total.amount
        this.showLoadingDots = false;
        this.showRefreshIcon = true;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  toggleBalanceVisibility() {
    this.showBalance = !this.showBalance;
  }
  openNotificationDialog(): void {
    const dialogCommunication = this.dialog.open(NotificationComponent, {
      maxWidth: '100vw',
      width: '100vw',
      height:'80vh',
      panelClass: 'notification-box',
      // Adjust the width as needed

      // Add any other MatDialogConfig options here
    });
    // Top navBar//
  }
  hasUnseenNotifications(): boolean {
    return this.unseenCount > 0;
  }
  
  getUnseenCount(): number {
    const unseenMessages = this.notifications ? this.notifications.filter(message => !message.seen) : [];
    return unseenMessages.length;
  }
  
  getNotificationProperties(): void {
    this.notificationService.getNotificationProperties().subscribe(
      (data) => {
        // Count the number of unseen notifications
        this.notifications = data
        console.log("vvvvvvvv",this.notifications)
        this.unseenCount = data !== null ? data.filter(notification => notification.seen).length : [];
        //console.log("1234567887number",data.filter(notification => !notification.seen).length )
  
        // Rest of your code...
      },
      (error) => {
        console.error('Error fetching notification properties:', error);
      }
    );
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

  closeMenu() {
    this.isMenuVisible = false;
  }

  onMyProfile() {
    this.profileService.myProfileSubject.next();
    this.router.navigate(['/edit-profile']);
  }
  isActive(str){
    return window.location.href.includes(str);
  }
}