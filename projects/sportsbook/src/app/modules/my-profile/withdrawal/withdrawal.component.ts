import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WithdrawalService } from './withdrawal.services';
import { HttpClient } from '@angular/common/http';
import { DepositService } from '../deposit/deposit.service';
import { validator } from 'fast-json-patch';

export interface PaymentRoute {
	paymentRouteId: string;
	paymentInstrumentTemplateId: string;
	paymentProvider: string;
	paymentProviderName: string;
	paymentMethod: string;
	paymentMethodName: string;
	paymentInstrumentFields: PaymentInstrumentField[];
	currencies: Currency[];
	canSubmitNewInstruments: boolean;
}

export interface PaymentInstrumentField {
	key: string;
	type: string;
	label: string;
	isMandatory: boolean;
	isSensitive: boolean;
	format: string;
	isHiddenForNew: boolean;
	isHiddenForExisting: boolean;
	selectSource: any;
}

export interface Currency {
	currency: string;
	minAmount: string;
	maxAmount: string;
}

@Component({
	selector: 'app-withdrawal',
	templateUrl: './withdrawal.component.html',
	styleUrls: ['./withdrawal.component.css'],
})
export class WithdrawalComponent implements OnInit {
	accountNumber: string | null = '';
	selectedAmount: number | null = null;
	selectedBank: string | null = '';
	enteredAccountNumber: string | null = '';
	uploadNIN = false;
	showAddNewModal = false;
	showWithdrawModal = false;
	accountNumberPlaceholder: string = 'Enter Account number';
	isFormSubmitted: boolean = false;
	paymentAccounts = [];
	newAccountAdded: boolean = false;
	activeIndex: number = 0;
	selectAmountActive: number | null = 0;
	inputValue = null;
	@Output()
	close: EventEmitter<string> = new EventEmitter<string>();
	@Output() open: EventEmitter<boolean> = new EventEmitter<boolean>();

	paymentMethod = 'opay';
	selectedAmountOpay: number = 0;
	opayWithdrawlForm: FormGroup;
	addBankDebitInfo: boolean = true;
	withdrawlAmountScreen: boolean = false;
	paystackWithdrawlForm: FormGroup;
	paystackCardWithdrawlForm: FormGroup;
	cryptostackWithdrawlForm: FormGroup;
	selectedCrypto: any = 'ETH';
	selectedAmountPaystack: number = 0;
	selectedAmountCoindiect: number = 0;
	paymentRouteDetails: PaymentRoute;
	paymentInstrumentTemplateId: string;
	paymentMethodName: string;
	paymentProvider: string;
	paymentProviderName: string;
	paymentRouteId: string;
	paymentMethodId: string;
	paymentMethodsList: { paymentMethod: string; paymentMethodName: string }[];
	paymentInstrumentInfo: any;
	isPhoneNumberInvalid: boolean = false;
	validNumber: boolean = false;
	invalidPhoneNumber: number;
	temporaryWithdrawlResponse: any;
	returnPaymentLinks: any;
	paymentInstrumentId: any;
	isLoading = false;
	isOpayExpanded: boolean = false;
	ispayStackExpanded: boolean = false;
	panelOpenState: string | null = null;
	isNumberRequired: boolean = true;

	withdrawalData = {
		paymentInstrument: {
			paymentInstrumentId: '1000000999',
		},
		paymentRouteId: 'card_withdrawal_paysafemix_TFP_v1',
		currency: 'EUR',
		amount: '3',
	};

	isWithdrawalSuccess: boolean = false;
	isWithdrawlInprocess: boolean = false;
	paymentRoute_id: any;
	instrumentEmail: any;
	paymentInstrumentName: any;
	paymentInstrumentTemplate_id: any;
	isexcitingInstrument: boolean = false;
	isnewInstrument: boolean = false;
	providerRoutes: any;
	bankUrl: any;
	bankList: any;
	isApcopay: boolean = false;
	coinPhoneNumber: any;
	selectedAmountPaystackCard: number = 0;
	CryptoCurrency: any;
	minimumAmount: any;
	intialAccountNumber: any;
	initalemailValue: any;
	loadingInstruments: boolean = false;
	transactions: any;
	currentDate = this.formatDate(new Date());
	deposit: boolean = true;
	history: boolean = false;

	constructor(
		private fb: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private withdrawalService: WithdrawalService,
		private sharedService: SharedService,
		private http: HttpClient,
		private depositService: DepositService
	) {
		this.opayWithdrawlForm = this.fb.group({
			phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
			email: [
				'',
				[
					Validators.required,
					Validators.email,
					Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
				],
			],
			amount: ['', [Validators.required]],
		});

		this.paystackCardWithdrawlForm = this.fb.group({
			bank: ['', [Validators.required]],
			email: ['', [Validators.required]],
			amount: ['', [Validators.required]],
		});

		this.paystackWithdrawlForm = this.fb.group({
			bankAccount: ['', [Validators.required]],
			banklist: ['', [Validators.required]],
			amount: ['', [Validators.required]],
			email: ['', [Validators.required]],
		});
		this.cryptostackWithdrawlForm = this.fb.group({
			phone: [null],
			email: [null],
			Crypto: ['', [Validators.required]],
			walletaddress: ['', [Validators.required]],
			amount: ['', [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
		});
		// this.f()
	}
	get f() {
		return this.cryptostackWithdrawlForm.controls;
	}

	ngOnInit(): void {
		this.getPaymentMethods();
		this.postData();
		// this.getPaymentRoute('OPAY', 'WITHDRAWAL');
		this.getPaymentRoutesOPAY('OPAY', 'WITHDRAWAL', 'OPAY_V1.1');

		this.opayWithdrawlForm.get('amount').valueChanges.subscribe((value) => {
			const amountValues = [1000, 5000, 10000, 50000, 100000];
			if (amountValues.includes(value)) this.selectedAmountOpay = value;
			else this.selectedAmountOpay = 0;
		});
		this.paystackCardWithdrawlForm
			.get('amount')
			.valueChanges.subscribe((value) => {
				const amountValues = [1000, 5000, 10000, 50000, 100000];
				if (amountValues.includes(value)) this.selectedAmountPaystack = value;
				else this.selectedAmountPaystack = 0;
			});
		this.paystackWithdrawlForm.get('amount').valueChanges.subscribe((value) => {
			const amountValues = [1000, 5000, 10000, 50000, 100000];
			if (amountValues.includes(value)) this.selectedAmountPaystackCard = value;
			else this.selectedAmountPaystackCard = 0;
		});
		this.cryptostackWithdrawlForm
			.get('amount')
			.valueChanges.subscribe((value) => {
				const amountValues = [1000, 5000, 10000, 50000, 100000];
				if (amountValues.includes(value)) this.selectedAmountCoindiect = value;
				else this.selectedAmountCoindiect = 0;
			});
	}

	oninput(userInputValue: Event) {
		this.enteredAccountNumber = (
			userInputValue.target as HTMLInputElement
		).value;
	}

	updateAccountPlaceholder(value: string) {
		this.selectedBank = value;
	}

	selectAmount(amount: number) {
		this.selectAmountActive = amount;
		this.selectedAmount = amount;
	}

	openAddNewModal() {
		this.enteredAccountNumber = null;
		this.selectedBank = null;
		this.newAccountAdded = false;
		this.showAddNewModal = true;
	}

	openWithdrawModal() {
		if (!this.isPhoneNumberInvalid) {
			this.showWithdrawModal = true;
			this.isWithdrawlInprocess = true;
			this.paystackCardWithdrawlForm.reset();
			this.panelOpenState = null;
		} else {
			this.proceedWithdrawl();
		}
	}

	updateSelectedBankAndAccount(
		selectedBank: string,
		enteredAccountNumber: string,
		index: number
	) {
		this.activeIndex = index;
		this.selectedBank = selectedBank;
		this.enteredAccountNumber = enteredAccountNumber;
	}

	maskAccountNumber(accountNumber: string): string {
		if (accountNumber.length < 9) {
			return accountNumber;
		}
		const maskedPart = accountNumber
			.substring(3, accountNumber.length - 2)
			.replace(/./g, '*');
		return (
			accountNumber.substring(0, 3) +
			maskedPart +
			accountNumber.substring(accountNumber.length - 2)
		);
	}

	oncancel() {
		this.showWithdrawModal = false;
	}

	onconfirm() {
		this.isLoading = true;
		if (this.isApcopay) {
			this.checkWithdrawalUpdatedStatus();
		} else {
			this.sharedService
				.resumeWithdrawal(
					this.temporaryWithdrawlResponse['paymentRequestId'],
					this.temporaryWithdrawlResponse['version']
				)
				.subscribe({
					next: (res) => {
						this.temporaryWithdrawlResponse = res;
						this.checkWithdrawalUpdatedStatus();
					},
					error: (error) => {
						this.isLoading = false;
					},
				});
		}
	}

	onsave() {
		const infoOfAccount = {
			selectedBank: this.selectedBank,
			enteredAccountNumber: this.enteredAccountNumber,
		};
		this.paymentAccounts.push(infoOfAccount);

		this.isFormSubmitted = true;
	}

	goHome() {
		this.close.emit('home');
	}

	payment(paymentmethod) {
		this.paymentMethod = paymentmethod;
		if (paymentmethod === 'PAYSTACK') {
			this.getPaymentRoutes('Paystack', 'WITHDRAWAL');
		}
		if (paymentmethod === 'coindirect') {
			this.getPaymentRoutes('APCOPAY', 'WITHDRAWAL');
		}
		if (paymentmethod === 'opay') {
			this.getPaymentRoutesOPAY('OPAY', 'WITHDRAWAL', 'OPAY_V1.1');
		}
	}

	selectAmountOpayF(amount: number) {
		if (amount === this.selectedAmountOpay) {
			this.selectedAmountOpay = 0;
		} else {
			this.selectedAmountOpay = amount;
			console.log('1234567890-', this.selectedAmountOpay);
		}
		this.opayWithdrawlForm.patchValue({ amount: this.selectedAmountOpay });
	}

	getPaymentRoutes(provider: string, request: string) {
		this.sharedService.getPaymentRoutes(provider, request).subscribe((res) => {
			this.providerRoutes = res;
			console.log(this.providerRoutes[0].currencies[0].minAmount);
			this.minimumAmount = this.providerRoutes[0].currencies[0];
			const bankDebitRoute = this.providerRoutes.find(
				(route) => route.paymentMethodName === 'Bank debit'
			);
			if (bankDebitRoute) {
				this.bankUrl =
					bankDebitRoute.paymentInstrumentFields[1].selectSource.request.url;
				this.paymentInstrumentTemplateId =
					bankDebitRoute.paymentInstrumentTemplateId;
				this.paymentRouteId = bankDebitRoute.paymentRouteId;
				this.getBanksList();
			}
			this.paymentRoute_id = res[0].paymentRouteId;
			let paymentInstrumentFieldsArray = res[0].paymentInstrumentFields;
			let cryptoCurrencyField = paymentInstrumentFieldsArray.find(
				(field) => field.key === 'crypto_currency'
			);
			if (cryptoCurrencyField) {
				this.CryptoCurrency = cryptoCurrencyField.selectSource.data;
			}
			this.updateValidationPaystackForm();
		});
	}
	getBanksList() {
		this.http.get(this.bankUrl).subscribe((res) => {
			this.bankList = res['data'];
		});
	}
	getPaymentRoute(paymentMethod: string, requestType: string) {
		this.sharedService
			.getPaymentRoute(paymentMethod, requestType)
			.subscribe((res: PaymentRoute) => {
				this.paymentRouteDetails = res;
				this.minimumAmount = this.paymentRouteDetails.currencies[0];

				this.paymentInstrumentTemplateId = res['paymentInstrumentTemplateId'];
				this.paymentMethodId = res['paymentMethodId'];
				this.paymentMethodName = res['paymentMethodName'];
				this.paymentProvider = res['paymentProvider'];
				this.paymentProviderName = res['paymentProviderName'];
				this.paymentRouteId = res['paymentRouteId'];
				this.updateValidationOpayForm();
			});
	}

	updateValidationOpayForm() {
		this.opayWithdrawlForm.get('amount').setValidators([Validators.required, Validators.min(this.minimumAmount?.minAmount), Validators.max(this.minimumAmount?.maxAmount)]);
		this.opayWithdrawlForm.updateValueAndValidity();
	}

	updateValidationPaystackForm() {
		this.paystackCardWithdrawlForm.get('amount').setValidators([Validators.required, Validators.min(this.minimumAmount?.minAmount), Validators.max(this.minimumAmount?.maxAmount)]);
		this.paystackWithdrawlForm.get('amount').setValidators([Validators.required, Validators.min(this.minimumAmount?.minAmount), Validators.max(this.minimumAmount?.maxAmount)]);
		this.paystackCardWithdrawlForm.updateValueAndValidity();
		this.paystackWithdrawlForm.updateValueAndValidity();
	}
	getPaymentRoutesOPAY(
		paymentMethod: string,
		requestType: string,
		paymentProvider: string
	) {
		this.sharedService
			.getPaymentRoutesO(paymentMethod, requestType, paymentProvider)
			.subscribe((res: PaymentRoute) => {
				this.paymentRouteDetails = res[0];
				this.minimumAmount = this.paymentRouteDetails.currencies[0];

				this.paymentInstrumentTemplateId =
					this.paymentRouteDetails['paymentInstrumentTemplateId'];
				this.paymentMethodId = this.paymentRouteDetails['paymentMethodId'];
				this.paymentMethodName = this.paymentRouteDetails['paymentMethodName'];
				this.paymentProvider = this.paymentRouteDetails['paymentProvider'];
				this.paymentProviderName =
					this.paymentRouteDetails['paymentProviderName'];
				this.paymentRouteId = this.paymentRouteDetails['paymentRouteId'];
			});
	}
	onExpansion(data: any) {
		this.loadingInstruments = true;
		this.isexcitingInstrument = false;
		this.getPaymentInstrument(data);
	}

	getPaymentMethods() {
		this.sharedService.getPaymentMethods('WITHDRAWAL').subscribe((res: any) => {
			this.paymentMethodsList = res;
		});
	}

	getPaymentInstrument(data: string) {
		this.sharedService.getPaymentInstrument(data).subscribe((res: any) => {
			this.paymentInstrumentInfo = res;
			if (res.length > 0) {
				this.isexcitingInstrument = true;
				this.loadingInstruments = false;
				this.instrumentEmail = this.paymentInstrumentInfo[0].values.email;
				this.paymentInstrumentName =
					this.paymentInstrumentInfo[0].paymentInstrumentName;
				this.paymentInstrumentId =
					this.paymentInstrumentInfo[0].paymentInstrumentId;
				this.paymentInstrumentTemplate_id =
					this.paymentInstrumentInfo[0].paymentInstrumentTemplateId;
				this.intialAccountNumber =
					this.paymentInstrumentInfo[0].paymentInstrumentName;
				this.initalemailValue = this.paymentInstrumentInfo[0].values.email;
				if (this.initalemailValue && this.intialAccountNumber) {
					this.paystackCardWithdrawlForm
						.get('email')
						.setValue(this.initalemailValue);
					this.paystackCardWithdrawlForm
						.get('bank')
						.setValue(this.intialAccountNumber);
				}

				// this.paystackCardWithdrawlForm
				// 	.get('email')
				// 	.setValue(this.instrumentEmail);
				// this.paystackCardWithdrawlForm
				// 	.get('bank')
				// 	.setValue(this.paymentInstrumentName);
			} else {
				this.isexcitingInstrument = false;
				this.loadingInstruments = false;
				this.isnewInstrument =
					this.paymentInstrumentInfo?.[0]?.instrumentType === 'Bank card';
			}
		});
	}

	proceedWithdrawl() {
		if (
			this.opayWithdrawlForm.invalid ||
			!this.opayWithdrawlForm.value.phone ||
			!this.opayWithdrawlForm.value.email ||
			!this.opayWithdrawlForm.value.amount
		) {
			this.showErrorToast('All fields are required for Opay');
			return;
		}
		this.isLoading = true;
		const payload = {
			paymentInstrument: {
				values: {
					phone: '+234' + this.opayWithdrawlForm.value.phone,
					email: this.opayWithdrawlForm.value.email,
				},
				paymentInstrumentTemplateId: this.paymentInstrumentTemplateId,
			},
			paymentRouteId: this.paymentRouteId,
			currency: 'NGN',
			amount: this.opayWithdrawlForm.value.amount.toString(),
		};
		this.sharedService.withdrawalAmount(payload).subscribe({
			next: (res) => {
				this.temporaryWithdrawlResponse = res;
				this.paymentInstrumentId = res['paymentInstrumentId'];
				this.returnPaymentLinks = res['links'];
				// this.isPhoneNumberInvalid = false;
				this.isLoading = false;
				this.openWithdrawModal();
				setTimeout(() => {
					// this.onconfirm();
					this.checkWithdrawalUpdatedStatus();
				}, 5000);
			},
			error: (error) => {
				if (error.error['code'] === 'limits_mismatch') {
					this.toastr.error('Amount does not adhere to limits.');
					this.isLoading = false;
				} else if (
					error.error['code'] === 'payment_provider_place_order_error' ||
					error.error['code'] === 'forbidden_value'
				) {
					this.invalidPhoneNumber = this.opayWithdrawlForm.value.phone;
					this.isPhoneNumberInvalid = true;
					this.addBankDebitInfo = false;
					// this.withdrawlAmountScreen = true;
					this.isLoading = false;
				} else this.isLoading = false;
				return;
			},
		});
	}

	changePhoneNumber(number) {
		this.opayWithdrawlForm.get('phone').setValue(number);
	}
	selectAmountPaystackF(amount: number) {
		if (amount === this.selectedAmountPaystack) {
			this.selectedAmountPaystack = 0;
		} else {
			this.selectedAmountPaystack = amount;
		}
		this.paystackCardWithdrawlForm.patchValue({
			amount: this.selectedAmountPaystack,
		});
	}

	selectAmountCoindiectF(amount: number) {
		if (amount === this.selectedAmountCoindiect) {
			this.selectedAmountCoindiect = 0;
		} else {
			this.selectedAmountCoindiect = amount;
		}
		this.cryptostackWithdrawlForm.patchValue({
			amount: this.selectedAmountCoindiect,
		});
	}

	showErrorToast(message: string) {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}

	// proceedWithdrawl() {

	// 	// Check if any field is empty
	// 	if (this.opayWithdrawlForm.invalid || !this.opayWithdrawlForm.value.phone || !this.opayWithdrawlForm.value.email || !this.opayWithdrawlForm.value.amount) {
	// 	  this.showErrorToast('All fields are required for Opay');
	// 	  return;
	// 	}

	// 	this.withdrawlAmountScreen = true;
	// 	this.addBankDebitInfo = false;
	// 	this.uploadNIN = true;
	//   }
	proceedPaystackWithdrawl(type: string) {
		// if (this.paystackWithdrawlForm.invalid) {
		// 	this.showErrorToast('All fields are required for Paystack Withdrawal');
		// 	return;
		//   }
		this.isLoading = true;
		this.isNumberRequired = false;
		let payload = {};

		if (type == 'bank') {
			payload = {
				paymentInstrument: {
					values: {
						email: this.instrumentEmail,
					},
					paymentInstrumentTemplateId: this.paymentInstrumentTemplate_id,
					paymentInstrumentId: this.paymentInstrumentId,
				},
				paymentRouteId: this.paymentRoute_id,
				currency: 'NGN',
				amount: this.paystackCardWithdrawlForm.value.amount.toString(),
				onApprove: {
					returnUrl:
						'https://tripay.uat.zebet.link/withdraw-details?resume=true',
					returnUrlRequestIdParam: 'id',
					cancelUrl: 'https://tripay.uat.zebet.link/withdraw-history',
				},
			};
		} else {
			payload = {
				paymentInstrument: {
					values: {
						bank: this.paystackWithdrawlForm.get('banklist').value,
						email: this.paystackWithdrawlForm.get('email').value,
						account_number: this.paystackWithdrawlForm.get('bankAccount').value,
					},
					paymentInstrumentTemplateId: this.paymentInstrumentTemplateId,
					paymentInstrumentId: null,
				},
				paymentRouteId: this.paymentRouteId,
				currency: 'NGN',
				amount: this.paystackWithdrawlForm.value.amount.toString(),
				onApprove: {
					returnUrl:
						'https://tripay.uat.zebet.link/withdraw-details?resume=true',
					returnUrlRequestIdParam: 'id',
					cancelUrl: 'https://tripay.uat.zebet.link/withdraw-history',
				},
			};
		}

		// payload.paymentInstrument.values.phoneNumber = 'your_phone_number_value';
		this.sharedService.withdrawalAmount(payload).subscribe({
			next: (res) => {
				this.temporaryWithdrawlResponse = res;
				this.paymentInstrumentId = res['paymentInstrumentId'];
				this.returnPaymentLinks = res['links'];
				// this.addBankDebitInfo = false;
				// this.withdrawlAmountScreen = true;
				// this.isPhoneNumberInvalid = false;
				this.isLoading = false;
				this.openWithdrawModal();
				this.paystackWithdrawlForm.reset();
				if (this.temporaryWithdrawlResponse.status === 'COMPLETE') {
					this.checkWithdrawalUpdatedStatus();
				} else {
					setTimeout(() => {
						// this.onconfirm();
						this.checkWithdrawalUpdatedStatus();
					}, 20000);
				}
			},
			error: (error) => {
				console.log(error);
				this.isLoading = false;

				if (error.error.message) {
					// this.invalidPhoneNumber = this.opayWithdrawlForm.value.phone;
					// this.isPhoneNumberInvalid = true;
					// this.addBankDebitInfo = false;
					// this.withdrawlAmountScreen = true;
					this.showErrorToast(error.error.message);
				} else this.showErrorToast('Something Wents wrong');
				this.isLoading = false;
				return;
			},
		});

		// this.withdrawlAmountScreen = true;
		// this.addBankDebitInfo = false;
		// this.uploadNIN = true;
	}

	proceedCryptoWithdrawl() {
		this.isApcopay = true;
		// Check if any field is empty for CryptostackWithdrawlForm
		//   if (this.cryptostackWithdrawlForm.invalid   || !this.cryptostackWithdrawlForm.value.walletaddress || !this.cryptostackWithdrawlForm.value.amount) {
		// 	this.showErrorToast('All fields are required for Cryptostack Withdrawal');
		// 	return;
		//   }
		this.isLoading = true;
		this.coinPhoneNumber = this.cryptostackWithdrawlForm.get('phone').value;
		let payload = {
			paymentInstrument: {
				values: {
					phone: this.cryptostackWithdrawlForm.get('phone').value || null,
					email: this.cryptostackWithdrawlForm.get('email').value || null,
					crypto_currency: this.cryptostackWithdrawlForm.get('Crypto').value,
					wallet_address:
						this.cryptostackWithdrawlForm.get('walletaddress').value,
				},
				paymentInstrumentTemplateId: 'bvnk_withdrawal_apcopay',
				paymentInstrumentId: null,
			},
			paymentRouteId: 'bvnk_withdrawal_apcopay_ZEBET_v1',
			currency: 'NGN',
			amount: this.cryptostackWithdrawlForm.value.amount.toString(),
			onApprove: {
				returnUrl: 'https://tripay.uat.zebet.link/withdraw-details?resume=true',
				returnUrlRequestIdParam: 'id',
				cancelUrl: 'https://tripay.uat.zebet.link/withdraw-history',
			},
		};

		this.sharedService.withdrawalAmount(payload).subscribe({
			next: (res) => {
				this.temporaryWithdrawlResponse = res;
				this.paymentInstrumentId = res['paymentInstrumentId'];
				this.returnPaymentLinks = res['links'];

				this.isLoading = false;
				this.openWithdrawModal();
				this.cryptostackWithdrawlForm.reset();
				if (this.temporaryWithdrawlResponse.status === 'COMPLETE') {
					this.checkWithdrawalUpdatedStatus();
				} else {
					setTimeout(() => {
						// this.onconfirm();
						this.checkWithdrawalUpdatedStatus();
					}, 30000);
				}
			},
			error: (error) => {
				console.log(error);
				if (error.error.message) {
					this.showErrorToast(error.error.message);

					// this.invalidPhoneNumber = this.opayWithdrawlForm.value.phone;
					// this.isPhoneNumberInvalid = true;
					// this.addBankDebitInfo = false;
					// this.withdrawlAmountScreen = true;
					this.isLoading = false;
				} else this.showErrorToast('Something Wents wrong');
				this.isLoading = false;
				return;
			},
		});
		// this.withdrawlAmountScreen = true;
		// this.addBankDebitInfo = false;
		// this.uploadNIN = true;
	}

	// cryptoDropdownItems = [
	//     { key: 'Bitcoin', name: 'BTC', value: '' },
	//     { key: 'Ethereum', name: 'ETH', value: '' },
	//     { key: 'Tether', name: 'USDUSDT', value: 'ERC20' },
	//     { key: 'Tether', name: 'USDUSDT', value: 'TRC20' },
	//     { key: 'Ripple', name: 'XRP', value: '' },
	//     { key: 'Litecoin', name: 'LTC', value: '' },
	//     { key: 'Bitcoin Cash', name: 'BCH', value: '' },
	//     { key: 'Dai', name: 'DAI', value: 'ERC20' },
	//     { key: 'Dogecoin', name: 'DOGE', value: '' },
	//     { key: 'USD Coin  ', name: 'USDC', value: 'ERC20' },
	//     { key: 'Cardano', name: 'ADA', value: '' },
	//     { key: 'Algorand', name: 'ALGO', value: '' },
	//     { key: 'Solana', name: 'SOL', value: '' },
	//     { key: 'Tronix', name: 'TRX', value: '' },
	//     { key: 'Binance Coin ', name: 'BNB', value: '' },

	//     // Add more items as needed
	//   ];

	reloadCurrentRoute(): void {
		const currentUrl = this.router.url;
		this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
			this.router.navigate([currentUrl]);
		});
	}
	initiateWithdrawal() {
		this.withdrawalService.initiateWithdrawal(this.withdrawalData).subscribe(
			(data) => {
				console.log('Withdrawal successful:', data);
				// Update UI or show success message
			},
			(error) => {
				console.error('Withdrawal failed:', error);
				// Display error message to the user
			}
		);
	}

	backArrowClicked() {
		this.isWithdrawalSuccess = false;
		this.isWithdrawlInprocess = false;
		this.showWithdrawModal = false;
		this.withdrawlAmountScreen = false;
		this.addBankDebitInfo = true;
		this.opayWithdrawlForm.reset();
		this.resetOpayWithdrawal();
	}

	resetOpayWithdrawal() {
		this.temporaryWithdrawlResponse = null;
		this.paymentInstrumentId = null;
		this.returnPaymentLinks = null;
	}

	checkWithdrawalUpdatedStatus() {
		this.sharedService
			.getWithdrawalStatus(this.returnPaymentLinks[0].href)
			.subscribe({
				next: (status: any) => {
					if (status[0].status === 'DENIED') {
						this.toastr.error('Withdrawal failed');
					} else if (
						status[0].status === 'WAITING_FOR_APPROVAL' ||
						status[0].status === 'PROCESSING'
					) {
						this.open.emit(true);
						this.toastr.warning(
							status[0].statusName + '. ' + 'Kindly, click on refresh'
						);
					} else if (status[0].status === 'COMPLETE') {
						this.toastr.success('Withdrawal Success');
						this.postData();
					}
					this.isNumberRequired = true;
					this.backArrowClicked();
					this.isLoading = false;
				},
				error: (error) => {
					this.isLoading = false;
					this.toastr.error('Some error occurred, please try again later. ');
				},
			});
	}

	selectAmountPaystackdebit(amount: number) {
		if (amount === this.selectedAmountPaystackCard) {
			this.selectedAmountPaystackCard = 0;
		} else {
			this.selectedAmountPaystackCard = amount;
		}
		this.paystackWithdrawlForm.patchValue({
			amount: this.selectedAmountPaystackCard,
		});
	}
	onPanelOpened(panel: string): void {
		this.panelOpenState = panel;
		this.isexcitingInstrument = false;
		this.loadingInstruments = true;
	}
	updateEmail(event: any): void {
		const value = (event.target as HTMLSelectElement).value;
		// Find the selected payment instrument
		const selectedInstrument = this.paymentInstrumentInfo.find(
			(item) => item.paymentInstrumentName === value
		);
		if (selectedInstrument) {
			this.paymentInstrumentId = selectedInstrument.paymentInstrumentId;
			// Set the email value in the form control
			this.paystackCardWithdrawlForm
				.get('email')
				.setValue(selectedInstrument.values.email);
		}
	}

	
	depositClick() {
		this.deposit = true;
		this.history = false;
	}

	historyClick() {
		this.history = true;
		this.deposit = false;
	}
	postData() {
		let startDate = this.appendTimezone(this.currentDate, 'start');
		let enddate = this.appendTimezone(this.currentDate, 'end');

		this.depositService
			.getdepositHistory(startDate, enddate, 'withdrawal', 0, 0)
			.subscribe(
				(transactions: any[]) => {
					this.transactions = transactions;
					console.log(transactions);

					const currentDate = new Date().toISOString().split('T')[0];
					// Filter objects for the current date
					const currentDateObjects = this.transactions.filter((obj) =>
						obj.createdAt.startsWith(currentDate)
					);
					console.log(currentDateObjects);

					// Sort the filtered array based on the timestamp
					const sortedCurrentDateObjects = currentDateObjects
						.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
						.slice(0, 5);
					this.transactions = sortedCurrentDateObjects;
				},
				(error) => {
					console.error('Error:', error);
				}
			);
	}
	appendTimezone(date, status = 'start') {
		if (status == 'start') return `${date}T00:00:00Z`;
		else return `${date}T23:59:59Z`;
	}
	formatDate(date) {
		var dd = date.getDate();
		var mm = date.getMonth() + 1; //January is 0!
		var yyyy = date.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		//return dd + '/' + mm + '/' + yyyy;
		return yyyy + '-' + mm + '-' + dd;
	}
}
