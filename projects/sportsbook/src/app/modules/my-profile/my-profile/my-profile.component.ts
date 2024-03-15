import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserBalanceService } from '../../header/header/balance.service';
import { ShowComponentEnum } from './component.enum';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { AuthLogoutService } from './authlogout.service';
import { LoaderService } from '../../../services/loader.service';
import { UserBalance } from '../../header/header/balance.dt';
import { BettingService } from '../../../services/betting-service';
import { KycService } from '../kyc-updated/kyc.service';
import { EncryptionService } from '../../../encryption.service';
import { Kyc, Result } from '../kyc-updated/kyc.interface';
import { Subject } from 'rxjs';
import { NameComponent } from '../../auth/registration/name/name.component';
import { DepositService } from '../deposit/deposit.service';

// import { DepositService } from '../deposit/deposit.service';

interface ApiResponse {
	status: string;
	message_key?: string;
}
enum ScreenEnum {
	LARGE = 'large',
	SMALL = 'small',
}

@Component({
	selector: 'app-my-profile',
	templateUrl: './my-profile.component.html',
	styleUrls: ['./my-profile.component.css'],
})
export class MyProfileComponent implements OnInit {

	private destroy$ = new Subject<boolean>();

	
	showMyAccountSection = true;
	isLoggedIn: boolean = true;
	errorMessage: string = '';
	email: string = '';
	phone_number: string = '';
	date: string;
	showHome: boolean = true;
	showTransactions: boolean = false;
	showBetHistory: boolean = false;
	showDeposit: boolean = false;
	showAccount: boolean = true;
	showBonuses: boolean = false;
	showRG: boolean = false;
	showWithdrawal: boolean = false;
	showKyc: boolean = false;
	isMobile: boolean = false;
	userBalanceDetails: any = {};
	showComponentEnum: ShowComponentEnum = ShowComponentEnum.HOME;
	currentBreakpoint: string = '';
	isLoggedOut: boolean = false;
	isLoading: boolean = false;
	playerId: any;
	isDeposit: boolean = false;
	withdrawableBalance = 0;
	lockedBalance = 0;

	pageTitle = '';
	readonly breakpoint$ = this.breakpointObserver
		.observe([
			Breakpoints.Large,
			Breakpoints.Medium,
			Breakpoints.Small,
			Breakpoints.XSmall,
			'(min-width: 500px)',
		])
		.pipe(
			tap((value) => console.log(value)),
			distinctUntilChanged()
		);
	private screenEnum: ScreenEnum = ScreenEnum.LARGE;
	kycStatus: Kyc;
	isKycSuccess: number = -1;
	kycResult: Result;
	constructor(
		private palyerPropertiesApiUrl: ProfileService,
		private authService: AuthService,
		private toastr: ToastrService,
		public dialog: MatDialog,
		private router: Router,
		private http: HttpClient,
		private balance: UserBalanceService,
		private breakpointObserver: BreakpointObserver,
		private authLogoutService: AuthLogoutService,
		private loaderService: LoaderService,
		private route: ActivatedRoute,
		private depositService: DepositService,
		private bettingService: BettingService,
		private kycService: KycService,
		private encryptionService: EncryptionService,
		private userBalanceService: UserBalanceService

	) {
		this.isLoggedIn = this.authService.isLoggedIn();
		this.email = localStorage.getItem('email');
		this.phone_number = localStorage.getItem('phone_number');
		this.authLogoutService.getLogoutObservable().subscribe(() => {
			this.handleLogout();
		});
		this.checkKycStatus();

		setTimeout(() => {
			this.route.queryParams.subscribe({
				next: () => {
					let paymentRequestId;
					let entityVersion;
					if (localStorage.getItem('paymentRequestId') && localStorage.getItem('Entity-Version')) {
						paymentRequestId = localStorage.getItem('paymentRequestId');
						entityVersion = localStorage.getItem('Entity-Version');

						this.depositService.paymentRequestResume(paymentRequestId, entityVersion, {}).subscribe({
							next: (res) => {
								for(const link of res.links) {
									if(link.rel && link.rel === 'approve') {
										this.depositService.showApproveBtnSubject.next(true);
										break;
									}
								}
								this.depositService.depositStatusSubject.next(res);
							},
							error: error => {
								if (error.error.code === 'payment_request_version_mismatch') {
									const url: string = localStorage.getItem('altResumeApi');
									this.depositService.resumeAlternative(url).subscribe((res) => {

										for(const link of res[0].links) {
											if(link.rel && link.rel === 'approve') {
												this.depositService.showApproveBtnSubject.next(true);
												break;
											}
										}

										this.depositService.depositStatusSubject.next(res[0]);
										localStorage.removeItem('paymentRequestId');
										localStorage.removeItem('Entity-Version');
										localStorage.removeItem('altResumeApi');
									});	
								}
							},
							complete: () => {
								localStorage.removeItem('paymentRequestId');
								localStorage.removeItem('Entity-Version');
								localStorage.removeItem('altResumeApi');
							}
						});
					}
				},
				error: error => {
				}
			});
		}, 1000);

		this.palyerPropertiesApiUrl.myProfileSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
			this.checkScreenWidth(); // Check screen width before toggling
			if (this.screenEnum === ScreenEnum.SMALL) {
				this.showAccount = false;
				this.showTransactions = false;
				this.showBetHistory = false;
				this.showDeposit = false;
				this.showHome = true;
				this.showWithdrawal = false;
				this.showBonuses = false;
				this.showRG = false;
				this.showKyc = false;
			} else {
				this.showAccount = true;
				this.showDeposit = false;
				this.showTransactions = false;
				this.showBetHistory = false;
				this.showHome = true;
				this.showWithdrawal = false;
				this.showRG = false;
				this.showBonuses = false;
				this.showKyc = false;
			}
		})

		// this.palyerPropertiesApiUrl.depostiSubject.pipe(takeUntil(this.destroy$)).subscribe((status) => {
		// 	if(!status) return;

		// 	this.checkScreenWidth(); // Check screen width before toggling

		// 	if (this.screenEnum === ScreenEnum.SMALL) {
		// 		// For screen sizes less than 1025, toggle the showAccount field
		// 		this.showDeposit = true;
		// 		this.showAccount = false;
		// 		// Optionally, you may want to hide other sections here
		// 		this.showTransactions = false;
		// 		this.showBetHistory = false;
		// 		this.showHome = false;
		// 		this.showBonuses = false;
		// 		this.showWithdrawal = false;
		// 		this.showRG = false;
		// 		this.showKyc = false;
		// 	} else {
		// 		this.showAccount = false;
		// 		this.showDeposit = true;
		// 		this.showTransactions = false;
		// 		this.showBetHistory = false;
		// 		this.showBonuses = false;
		// 		this.showWithdrawal = false;
		// 		this.showHome = false;
		// 		this.showRG = false;
		// 		this.showKyc = false;
		// 	}
		// });
	}

	ngOnInit(): void {
		this.checkScreenWidth();
		this.checkPlayerProperties();
		this.getUserBalance();
		this.breakpoint$.subscribe(() => this.breakpointChanged());
		if (this.router.routerState.snapshot.root.queryParams['deposit']) this.toggleDeposit();
		if (this.route.snapshot.queryParams['currPage'] === 'bethistory') {
			this.toggleBetHistory();
		}


	}

	showAlert(data){
		alert(data)
	}

	checkPlayerProperties() {
		this.palyerPropertiesApiUrl.getPlayerProperties().subscribe(
		  (data) => {
			console.log("Player Prop", data);
			if (data && data.properties) {
			  const playerIdProperty = data.properties.find(
				(prop) => prop.property === 'hubPlayerId'
			  );
			  if (playerIdProperty) {
				this.playerId = playerIdProperty.value;
				console.log('Player ID:', this.playerId);
	  
				// Check if firstName and lastName are empty
				const firstNameProperty = data.properties.find(
				  (prop) => prop.property === 'firstName'
				);
				const lastNameProperty = data.properties.find(
				  (prop) => prop.property === 'lastName'
				);
	  
				if (!firstNameProperty.value || !lastNameProperty.value) {
				  this.nameEditPopup(); 
				}
			  } else {
				console.error('Player ID not found in the response');
			  }
			} else {
			 this.nameEditPopup(); // Open popup when properties are null
			}
		  },
		  (error) => {
			console.error(error);
		  }
		);
	  }
	  

	nameEditPopup() {
		const dialogRef = this.dialog.open(NameComponent, {
			width: '300px',
			panelClass: 'edit-name',
			data: { message: 'Properties are null in the response.' },
			disableClose: true,
		});

	}


	private breakpointChanged() {
		// if(this.breakpointObserver.isMatched(Breakpoints.Large)) {
		//   this.currentBreakpoint = Breakpoints.Large;
		// } else if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
		//   this.currentBreakpoint = Breakpoints.Medium;
		// }

		this.screenEnum = ScreenEnum.LARGE;

		if (this.breakpointObserver.isMatched(Breakpoints.XSmall)) {
			this.screenEnum = ScreenEnum.SMALL;
		}

		// switch(this.screenEnum)
		// {
		//   case ScreenEnum.SMALL:
		//     this.showHome = false;
		//   break;
		// }
		// else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
		//   this.currentBreakpoint = '(min-width: 500px)';
		// }

		//alert(this.screenEnum)
	}

	goHome() {
		switch (this.screenEnum) {
			case ScreenEnum.SMALL:
				this.showHome = true;
				this.showAccount = false;
				this.showBetHistory = false;
				this.showDeposit = false;
				this.showTransactions = false;
				this.showWithdrawal = false;
				this.showBonuses = false;
				this.showRG = false;
				this.showKyc = false;
				break;
		}
	}

	handleClose(event) {
		console.log("Event", event)
		// if (event === "home") this.goHome();
		// else if (event === "transaction") this.toggleTransactions();
		this.goHome();
	}
	handleOpen(event){
		if(event===true){
			this.toggleTransactions();
		}
	}

	handleCloseKyc(event: boolean) {
		this.toggleMyAccount();
		this.goHome();
	}

	getUserBalance() {
		const requestBody = {
			products: ['sportsbook', 'casino'],
		};

		this.balance.getUserBalance(requestBody).subscribe(
			(data: UserBalance) => {

				console.log("UsageBalance", data)
				this.withdrawableBalance = data.real.analytics.filter(x => x.type.toLowerCase() == 'withdrawable')[0].balance.amount;
				this.lockedBalance = data.real.analytics.filter(x => x.type.toLowerCase() == 'non withdrawable')[0].balance.amount;
				this.userBalanceDetails = data;
			},
			(error) => {
				console.error('Error:', error);
			}
		);
	}

	toggleTransactions() {
		this.pageTitle = 'My Transactions';

		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showAccount = false;

			// Optionally, you may want to hide other sections here
			this.showTransactions = true;
			this.showBetHistory = false;
			this.showDeposit = false;
			this.showHome = false;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showDeposit = false;
			this.showTransactions = true;
			this.showBetHistory = false;
			this.showHome = true;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showKyc = false;
		}
	}

	toggleRG() {
		this.pageTitle = 'Responsible Gaming';

		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showAccount = false;

			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showDeposit = false;
			this.showHome = false;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = true;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showDeposit = false;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = true;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = true;
			this.showKyc = false;
		}
	}

	toggleBonuses() {
		this.pageTitle = 'My Bonuses';

		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showAccount = false;

			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showDeposit = false;
			this.showHome = false;
			this.showWithdrawal = false;
			this.showBonuses = true;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showDeposit = false;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = true;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showBonuses = true;
			this.showKyc = false;
		}
	}

	toggleBetHistory() {
		this.pageTitle = 'Bet History';

		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showAccount = false;

			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showDeposit = false;
			this.showBetHistory = true;
			this.showHome = false;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showDeposit = false;
			this.showTransactions = false;
			this.showBetHistory = true;
			this.showHome = true;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showKyc = false;
		}
	}

	toggleMyAccount() {
		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showAccount = this.showAccount;

			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = false;
			this.showDeposit = false;
			this.showWithdrawal = false;
			this.showBonuses = false;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = true;
			this.showDeposit = false;
			this.showWithdrawal = false;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showBonuses = false;
			this.showHome = true;
			this.showRG = false;
			this.showKyc = false;
		}
	}

	toggleDeposit() {
		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showDeposit =  true;
			this.showAccount = false;
			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = false;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showDeposit =  true;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showBonuses = false;
			this.showWithdrawal = false;
			this.showHome = true;
			this.showRG = false;
			this.showKyc = false;
		}
	}

	toggleWithdrawal() {
		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showWithdrawal =  true;
			this.showAccount = false;
			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = false;
			this.showBonuses = false;
			this.showDeposit = false;
			this.showRG = false;
			this.showKyc = false;
		} else {
			this.showAccount = false;
			this.showWithdrawal =  true;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showBonuses = false;
			this.showDeposit = false;
			this.showHome = true;
			this.showRG = false;
			this.showKyc = false;
		}
	}

	toggleKyc() {
		this.pageTitle = 'KYC';

		this.checkScreenWidth(); // Check screen width before toggling

		if (this.screenEnum === ScreenEnum.SMALL) {
			// For screen sizes less than 1025, toggle the showAccount field
			this.showKyc =  true;
			this.showAccount = false;
			// Optionally, you may want to hide other sections here
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showHome = false;
			this.showBonuses = false;
			this.showDeposit = false;
			this.showRG = false;
			this.showWithdrawal = false;
		} else {
			this.showAccount = false;
			this.showKyc = true;
			this.showTransactions = false;
			this.showBetHistory = false;
			this.showBonuses = false;
			this.showDeposit = false;
			this.showHome = true;
			this.showRG = false;
			this.showWithdrawal = false;
		}
	}
	private checkScreenWidth() {
		const screenWidth = window.innerWidth;

		if (screenWidth < 1025) {
			this.screenEnum = ScreenEnum.SMALL;
			this.showAccount = !this.showAccount;
		} else {
			this.screenEnum = ScreenEnum.LARGE;
		}
	}

	toggleHome() {
		switch (this.screenEnum) {
			case ScreenEnum.SMALL:
				this.showHome = false;
				break;
		}

		this.showHome = !this.showHome;
		this.showTransactions = false;
		this.showBetHistory = false;
		this.showAccount = false;
		this.showDeposit = false;
		this.showBonuses = false;
		this.showWithdrawal = false;
		this.showRG = false;
	}

	private handleLogout() {
		// Reset or hide the fields as needed after logout
		this.isLoggedOut = true;
		// ... other changes

		// Optionally, you can navigate to a different component or perform other actions
	}

	logout() {
		this.isLoading = true;
		const signOutUrl = environment.Sign_Out_API;

		// const access_token = this.authService.getAccessToken();
		const fnc_accessToken = localStorage.getItem('fnc_accessToken');
		const accessToken = localStorage.getItem('accessToken');

		if (fnc_accessToken && accessToken) {
			const headers = new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
				fnc_token: `Bearer ${fnc_accessToken}`,
			});

			console.log('logout header >>>', headers);
			this.http.post<ApiResponse>(signOutUrl, {}, { headers }).subscribe(
				(response) => {
					this.isLoading = false;
					if (response.status === 'SUCCESS') {
						this.authService.clearAccessToken();
						this.authLogoutService.logout();
						this.loaderService.setLoggedIn(false);
						localStorage.removeItem('email');
						localStorage.removeItem('phone_number');
						localStorage.removeItem('fnc_accessToken');
						localStorage.removeItem('user_id');
						localStorage.removeItem('notificationShown');
						localStorage.removeItem('betBasketId');
						// window.location.href = '#/login-account';
						this.router.navigate(['/auth/login-account']);
						this.bettingService.setLoginStatus(false);
						this.userBalanceService.removeUserBalance();
						this.clearChatUser();
						
					} else {
						// console.error('Sign-Out failed:', response);
					}
				},
				(error) => {
					this.isLoading = false;
					this.authService.clearAccessToken();
					// if there is an error logging out a user from the server, clear user details on FE and redirect user to login page
					// this.errorMessage = error.error.message_key;
					// this.showErrorToast(this.errorMessage);
					//window.location.href = '#/login-account';
					this.loaderService.setLoggedIn(false);
					localStorage.removeItem('email');
					localStorage.removeItem('phone_number');
					localStorage.removeItem('user_id');
					localStorage.removeItem('fnc_accessToken');
					this.userBalanceService.removeUserBalance();
					this.router.navigate(['/auth/login-account']);
					this.clearChatUser();
				}
			);
		}
	}
	showErrorToast(message: string) {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}

	showComponent(showComponent: ShowComponentEnum) {
		this.showAccount = false;
		this.showBetHistory = false;
		this.showHome = false;
		this.showTransactions = false;
		this.showDeposit = false;
		this.showBonuses = false;
		this.showWithdrawal = false;
		this.showRG = false;

		switch (showComponent) {
			case ShowComponentEnum.HOME:
				this.showHome = true;
				break;

			case ShowComponentEnum.ACCOUNT:
				this.showAccount = true;
				break;

			case ShowComponentEnum.BET_HISTORY:
				this.showBetHistory = true;
				break;

			case ShowComponentEnum.TRANSACTION_HISTORY:
				this.showTransactions = true;
				break;

			case ShowComponentEnum.DEPOSIT:
				this.showDeposit = true;
				break;
			case ShowComponentEnum.WITHDRAWAL:
				this.showBonuses = true;
				break;
			case ShowComponentEnum.BONUSES:
				this.showBonuses = true;
				break;
			case ShowComponentEnum.RG:
				this.showRG = true;
				break;
		}
	}

	checkKycStatus() {
		const signature = this.encryptionService.generateKYCSignature();
		const payload = {
			signature: signature,
			timestamp: this.encryptionService.timeStamp,
			user_id: localStorage.getItem('user_id'),
			job_id: localStorage.getItem('user_id'),
			partner_id: this.kycService.partnerId,
			image_links: true,
			history: false,
		};

		this.kycService.checkKycStatus(payload).subscribe({
			next: (response: Kyc) => {
				const successCodes = ['1012', '0810'];
				this.kycStatus = response;
				this.kycResult = response?.result;
				if (this.kycResult && successCodes.includes(this.kycResult['ResultCode'])) {
					this.isKycSuccess = 1;
				} else if(this.kycResult && this.kycResult['ResultCode'] !== '1012'){
					this.isKycSuccess = 0;
				}
			},
			error: (error) => {},
		});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
    	this.destroy$.unsubscribe();
	}

	clearChatUser() {
		(window as any).fcWidget.user.clear().then();
	}
}
