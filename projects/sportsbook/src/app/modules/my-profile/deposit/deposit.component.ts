/* eslint-disable require-jsdoc */
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {Dialog} from '@angular/cdk/dialog';
import { DepositPopUpComponent } from './deposit-pop-up/deposit-pop-up.component';
import { DepositRequest, DepositResponse, DepositResumeResponse, ExistingInstrument, PaymentProvider } from './deposit.data';
import { DepositService } from './deposit.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/sportsbook/src/environments/environment';
import { TransactionsService } from '../transactions/transaction.service';
import { ProductTransactionService } from '../transactions/product-transaction.service';
import { DepositValidationPopUpComponent } from './deposit-validation-pop-up/deposit-validation-pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import { TokenService } from '../../../services/token-service';
import { ProfileService } from '../my-profile/profile.service';
import { UserBalanceService } from '../../header/header/balance.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent {
  selectedAmount: number | null = null;
  selectAmountActive: number | null = 0;
  deposit: boolean = false;
  history: boolean = false;
  paymentMethod = 'opay';
  selectedIndex = 0;
  paymentMethods = [
    { key: 'OPAY_V1.1', name: 'Opay', icon: 'assets/img/opay.png' }, 
    { key: 'paystack', name: 'Paystack', icon: 'assets/svg/Paystack.svg' },
    { key: 'paymentmode', name: 'GTBank', icon: 'assets/svg/Payment-mode.svg' },
    // { key: 'APCOPAY', name: 'Coindirect', icon: 'assets/svg/coindirect.svg' },
    // { key: 'woven', name: 'Woven', icon: 'assets/svg/Woven.svg' },

    // Add more payment methods as needed
  ];
  showDepositDetails:boolean= true;
  showAccordiansDetails:boolean=false;
  panelOpenState = false;
  carouselOptions: OwlOptions = {};
  paymentProviders: PaymentProvider[] = [];
  selectedPaymentProvider: PaymentProvider;
  @Output()
  close: EventEmitter<boolean> = new EventEmitter<boolean>();

  authToken: string;
  paymentSelectOptions: any;
  toastr = inject(ToastrService);
  existingInstruments: ExistingInstrument[];
  selectedInstrument: ExistingInstrument | null;
  selectedInstrumentId: string;
  newInstrumentButtonSelected: boolean = true;
  showDepositStatus: DepositResumeResponse | null = null;
  showWithdrawModal:boolean = true;
  isLoading:boolean = true;
	userBalanceDetails: any = {};
	transactionsType: any[] = [];
	transactions: any[] = [];
  paymentRequestId: string;
  entityVersion: string;
  showApprove:boolean = false;
  instrumentFieldModel = {
    email: '',
    phone: '',
    bank: '',
    account_number: ''
  }
	currentDate = this.formatDate(new Date());


  constructor( private _tokenService: TokenService, public matDialog: MatDialog,
    public sharedService: SharedService, public dialog: Dialog, private depositService: DepositService, public profileService: ProfileService,private balance: UserBalanceService,private transactionsService: TransactionsService,private productTransactionService: ProductTransactionService) {

      this.depositService.showApproveBtnSubject.subscribe((show: boolean) => {
        this.showApprove = show;
      });

      
      this.depositService.depositStatusSubject.subscribe((data) => {
        if(data) {
          if(data.version) localStorage.setItem('Entity-Version', data.version);
          
          this.showDepositStatus = data;
          console.log("this.showDepositStatus", this.showDepositStatus);
          this.showWithdrawModal = true;

        } else {
          this.showDepositStatus = null;
          this.showWithdrawModal = false;
        }
      });
    }

  selectAmount(index, amount: number) {
    this.selectAmountActive = amount;
    this.paymentProviders[index].amount = amount;
  }

  ngOnInit() {

    this.profileService.depostiSubject.next(true);

    this.getTransactionsType();
    this.postData();
		this.getUserBalance();
    this.payment(this.paymentMethods[0].key)
    this.deposit = true;
    this.carouselOptions = {
      loop: false,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      rewind: false,
      navSpeed: 700,
      items: 4,
      responsive: {
        0: {
          items: 4
        },
        768: {
          items: 4
        }
      },
      autoWidth: true,
      navText: ['<img src="assets/svg/next.svg">', '<img src="assets/svg/prev.svg">'],
      nav: true,
    }

  };
  
  openDialog(): void {
    const dialogRef = this.dialog.open<DepositPopUpComponent>(DepositPopUpComponent, {
      width: '750px',
      panelClass: 'trend-dialog',
      closeOnDestroy : true
    });
    dialogRef.closed.subscribe(val=>{
      this.closedDialog(val);
    })
  };
  
  closedDialog(val?){
    if(this.lastSelected!=''){
      this.payment(this.lastSelected)
    }
  }
  navigateCarousel(direction: 'left' | 'right') {
    console.log(direction)
    const numItems = 5; // Number of items in the carousel
    if (direction === 'left') {
      this.selectedIndex = (this.selectedIndex - 1 + numItems) % numItems;
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % numItems;
    }
  }
  lastSelected : string = '';
  loadingMethods = false;
  payment(paymentmethod) {
    console.log(paymentmethod)
    if(this.paymentMethod === 'paymentmode') this.lastSelected = paymentmethod;
    else this.lastSelected = this.paymentMethod;
    this.paymentMethod = paymentmethod;
    this.paymentProviders = [];
    if(paymentmethod==='paymentmode'){
      this.openDialog();
      return;
    }
    this.loadingMethods = true;
    console.log("loginMethodsss", this.loadingMethods)
    this.depositService.getPaymentProvider(paymentmethod).subscribe({
      next : data => {
        data?.map((method) => {
          method.paymentInstrumentFields?.map((field) => {
            if(field.type === 'select') {
              
              if(method.paymentRouteId === 'bank_debit_deposit_paystack_lv_ZEBET_v1') {
                this.paymentSelectOptions = field.selectSource.data;
              } else {
                this.depositService.getPaymentSelectOptions(field.selectSource.request).subscribe((res: any) => {
                  this.paymentSelectOptions = res.data;
                }) 
              }
            }
          })
        });
        this.paymentProviders = data;
        this.loadingMethods = false;
      },
      error : data => {
        console.log(data, "error");
        this.loadingMethods = false;
      }
    })

  }
  openLink() {
    const link = 'https://www.gtbank.com/';
    window.open(link, '_blank');
  }

  depositClick() {
    this.deposit = true;
    this.history = false;
  }

  historyClick() {
    this.history = true;
    this.deposit = false;
  };
  goHome() {
    this.close.emit(true);
  }

  onDeposit(index, formValues: any) {
    console.log("formValues", formValues);
    const amount = formValues['amount'];
    const existingInstrument = formValues['existingInstrument'];


    for (const [key, value] of Object.entries(formValues)) {
      if (!value) {
          delete formValues[key];
      }
    }

    this.paymentProviders[index].isLoading = true;
    this.selectedPaymentProvider = this.paymentProviders[index];

    let req;
    if(formValues.existingInstrument && formValues.existingInstrument !==  null) {
      req = this.depositRequestBuilder(this.selectedPaymentProvider, formValues, true);
    } else {
      req = this.depositRequestBuilder(this.selectedPaymentProvider, formValues, false);
    }

    this.depositService.doDepositOperation(req).subscribe(
      {
        next: data => {
          if(data) {

            this.paymentProviders[index].isLoading = false;
              localStorage.setItem("paymentRequestId", data.paymentRequestId);
              localStorage.setItem("Entity-Version", data.version);
              localStorage.setItem("altResumeApi", data.links[1].href);
            this.switchMethod(data, this.paymentProviders[index].paymentProvider, req);
          }
        },
        error: error => {
          if(error.error.code === 'limits_mismatch' &&  error.error.payload) {
            if(error.error.payload.minAmount) {
              this.toastr.error(`Minimum amount limit is ${error.error.payload.minAmount}`);
            } else if(error.error.payload.maxAmount) {
              this.toastr.error(`Maximum amount limit is ${error.error.payload.maxAmount}`);
            }
            return;
          }
          this.toastr.error(error.error.message);
          this.paymentProviders[index].isLoading = false;
        }
    });
    formValues['amount'] = amount;
    formValues['existingInstrument'] = existingInstrument;

  }

  // Paystack Bank Card
  openDepositDialog(res: any, refreshUrl: string) {
    const dialogRef = this.matDialog.open( DepositValidationPopUpComponent , {
        panelClass: '',
        data: {
          placeholder: res.instructions[0].description,
          type: res?.instructions[0].payload.approvalType
        }
      }
      );
  
      dialogRef.afterClosed().subscribe((input: string) => {
          if (input) {
              const payload = {
                  approval: {
                      type: res.instructions[0].payload.approvalType,
                      token: input
                  }
              };
              console.log(payload);
             this.resumePaymentRequest(res.paymentRequestId, res.version, payload, refreshUrl);
          }
      });
  }
  
resumePaymentRequest(paymentRequestId: string, version: string, payload: any, refreshUrl: string) {
      this.depositService.paymentRequestResume(paymentRequestId, version, payload).subscribe(
          (res: DepositResumeResponse) => {
              if (res.instructions) {
                 this.openDepositDialog(res, refreshUrl);
              } else {
                 this.handleDepositSuccess(refreshUrl);
              }
          },
          (error: any) => {
             this.toastr.error(error.message)
          }
      );
  }
  
 handleDepositSuccess(refreshUrl: string) {
      this.depositService.paystackBankDebitRefresh(refreshUrl).subscribe((res: DepositResumeResponse[]) => {
          this.depositService.depositStatusSubject.next(res[0]);
          this.depositService.showApproveBtnSubject.next(false);
      });
  }
  
  switchMethod(res: DepositResponse, paymentProvider: string, req: any) {
  
    console.log("reqqqq", req);
    switch(this.selectedPaymentProvider.paymentMethod)
    {
        case "BANK_CARD":
        if(paymentProvider === "PAYSTACK") {
          let refreshUrl: string;
          let flag:boolean = false;
          for(const link of res.links) {
            if(link.rel === 'self') {
              refreshUrl = link.href;          
            } else if(link.rel === 'approve') {
              console.log(link.rel);
              flag = true;
              window.location.replace(link.href);
              break;
            }
            else if(res.instructions?.length && link.rel !='approve'){
              this.openDepositDialog(res,refreshUrl);
            } if(!flag && refreshUrl && !res.instructions){
              this.handleDepositSuccess(refreshUrl)
            }
            
          }
          
         
        } else {
          window.location.replace(res.links[0].href);
        }
        break;

        case "BANK_DEBIT":
          if(paymentProvider === "OPAY_V1.1") {
            window.location.replace(res.links[0].href);
          } else if(paymentProvider === "PAYSTACK") {
            const dialogRef = this.matDialog.open( DepositValidationPopUpComponent , {
              panelClass: '',
              data: {
                placeholder: res.instructions[0].description,
                type: res.instructions[0].payload.approvalType
              }
            });
            dialogRef.afterClosed().subscribe((birthDate: string) => {
              if(birthDate) {
                const payload = {
                  approval: {
                      type: res.instructions[0].payload.approvalType,
                      token: birthDate
                  }
                }

                this.depositService.paymentRequestResume(res.paymentRequestId,res.version, payload).subscribe((res: DepositResumeResponse)=> {
                  if(res) {
                    const dialogRef = this.matDialog.open( DepositValidationPopUpComponent , {
                      panelClass: '',
                      data: {
                        placeholder: res.instructions[0].description,
                        type: res.instructions[0].payload.approvalType
                      }
                    });
                    dialogRef.afterClosed().subscribe((otp: string) => {  
                      if(otp) {
                        const payload = {
                          approval: {
                              type: res.instructions[0].payload.approvalType,
                              token: otp
                          }
                        }

                        this.depositService.paymentRequestResume(res.paymentRequestId, res.version, payload).subscribe((otpRes: DepositResumeResponse) => {
                          if(otpRes) {
                            const dialogRef = this.matDialog.open(DepositValidationPopUpComponent, {
                              panelClass: '',
                              data: {
                                placeholder: res.instructions[0].description,
                                type: otpRes.instructions[0].payload.approvalType
                              }
                            });
                            dialogRef.afterClosed().subscribe((otp2: string) => {
                              if(otp2) {
                                const payload = {
                                  approval: {
                                      type: otpRes.instructions[0].payload.approvalType,
                                      token: otp
                                  }
                                }
                                this.depositService.paymentRequestResume(otpRes.paymentRequestId, otpRes.version, payload).subscribe((otpRes2: DepositResumeResponse) => {
                                  this.showWithdrawModal = true;
                                  this.showDepositStatus = otpRes2;
                                });
                              }
                            });
                          }
                        },(error: any) => {
                          if(error.error.code === 'payment_provider_place_order_error') {
                            this.toastr.error("Invalid OTP");
                          }
                        });
                      }
                    });
                  }
                },(error: any) => {
                  if(error.error.code === 'payment_provider_place_order_error') {
									  this.toastr.error("Invalid OTP");
                  }
                });
              }
            }); 
          }
        break;

        case "BANK_TRANSFER":
          window.location.replace(res.links[0].href);
        break;

        case "OPAY":  //opay wallet
          window.location.replace(res.links[0].href);
        break;

        case "USSD":
          if(paymentProvider === "PAYSTACK") {
            this.showApprove = false;
            let refreshUrl: string;
            let flag:boolean = false;
            for(const link of res.links) {
              if(link.rel === 'self') {
                refreshUrl = link.href;
              } else if(link.rel === 'approve') {
                flag = true;
                window.location.replace(link.href);
                break;
              }
            }
  
            if(!flag && refreshUrl) {
              this.depositService.paystackBankDebitRefresh(refreshUrl).subscribe((res: DepositResumeResponse[]) => {
                this.depositService.depositStatusSubject.next(res[0]);
                this.depositService.showApproveBtnSubject.next(false);
              });
            }
            
          } else {
            window.location.replace(res.links[0].href);
          }
        break;

        case "QR_CODE":
          if(paymentProvider === "PAYSTACK") {
            this.showApprove = false;
            let refreshUrl: string;
            let flag:boolean = false;
            for(const link of res.links) {
              if(link.rel === 'self') {
                refreshUrl = link.href;
              } else if(link.rel === 'approve') {
                flag = true;
                window.location.replace(link.href);
                break;
              }
            }
  
            if(!flag && refreshUrl) {
              this.depositService.paystackBankDebitRefresh(refreshUrl).subscribe((res: DepositResumeResponse[]) => {
                this.depositService.depositStatusSubject.next(res[0]);
                this.depositService.showApproveBtnSubject.next(false);
              });
            }
            
          }
        break;

        case "BVNK":
          if(res.links)
          window.location.replace(res.links[0].href);
    }
    
  }

  swapOpen(index: number) {
    this.paymentProviders[index].isOpen = !this.paymentProviders[index].isOpen;
  }

  depositRequestBuilder(paymentProvider: PaymentProvider, formValues: any, isExistingInstrument: boolean): DepositRequest {
    console.log("paymentProvider",paymentProvider);

    let amount: string;
    
    if(formValues.hasOwnProperty('amount')) {
      amount = formValues.amount.toString();
      delete formValues['amount'];
    }
    
    let depositRequest: any;
    const existingInstrumentId: string = formValues.existingInstrument;
    delete formValues['existingInstrument'];
    // let paymentRequestId;

    depositRequest = {
      paymentRouteId: paymentProvider.paymentRouteId,
      currency: paymentProvider.currencies[0].currency,
      amount: amount,
      onApprove: {
        returnUrl: `${environment.redirect_url}/edit-profile?deposit=true`,
        cancelUrl: `${environment.redirect_url}/edit-profile?deposit=true`,
      }
    }

    if(isExistingInstrument) {
      depositRequest['paymentInstrument'] = {
        paymentInstrumentId: existingInstrumentId,
      }
    } else {
      depositRequest['paymentInstrument'] = {
          paymentInstrumentTemplateId: paymentProvider.paymentInstrumentTemplateId,
          values: formValues
      }
    }
    console.log("Sequ", JSON.stringify(depositRequest))

    return depositRequest;
  }

  loadingInstruments = false;
  onDepositMethodExpand(paymentInstrumentTemplateId: string): void {
    this.resetInstrumentFields();
    this.selectedInstrument = null;
    this.selectedInstrumentId = '';
    this.existingInstruments = [];
    this.loadingInstruments = true;
    this.depositService.getPaymentInstrument(paymentInstrumentTemplateId).subscribe({
      next: data => {
        this.existingInstruments = data;
        if(this.existingInstruments?.length<1) this.newInstrumentButtonSelected = true;
        this.loadingInstruments = false;
      },
      error: error => {
        this.loadingInstruments = false;
      }
    });
  }

  onInstrumentSelected(selectedInstrument: any): void {
    if(this.newInstrumentButtonSelected) this.newInstrumentButtonSelected = false; 

    if(!selectedInstrument) {
      this.newInstrumentButtonSelected = true;
      this.selectedInstrument = null;
      this.selectedInstrumentId = "";
      this.resetInstrumentFields();

    } else {
      console.log("this.existingInstrumenttt", this.existingInstruments);
      this.selectedInstrument = this.existingInstruments.find((instrument) => instrument?.paymentInstrumentId === selectedInstrument);
      this.selectedInstrumentId = this.selectedInstrument?.paymentInstrumentId;
      if(this.selectedInstrument) {
        this.fillInstrumentFields(this.selectedInstrument);
      }
    }
    console.log("this.selectedInstrument", this.selectedInstrument);
  }

  fillInstrumentFields(selectedInstrument: ExistingInstrument): void {
    
    if (selectedInstrument.values) {
      for (const key in selectedInstrument.values) {
        if (this.instrumentFieldModel.hasOwnProperty(key)) {
          this.instrumentFieldModel[key] = selectedInstrument.values[key];
        }
      }
    }
  }

  resetInstrumentFields(): void {
    for (const key in this.instrumentFieldModel) {
      if (this.instrumentFieldModel.hasOwnProperty(key)) {
        this.instrumentFieldModel[key] = '';
      }
    }
  }

  selectNewInstrumentToggle() {
    this.newInstrumentButtonSelected != this.newInstrumentButtonSelected;
    this.resetInstrumentFields();
    this.selectedInstrumentId = "";
  }

  onDepositStatusBack() {
    this.depositService.depositStatusSubject.next(null);
    localStorage.removeItem('paymentRequestId');
    localStorage.removeItem('Entity-Version');
    localStorage.removeItem('altResumeApi');
  }

  onDepositApprove(status: DepositResumeResponse) {
    localStorage.setItem('paymentRequestId', status.paymentRequestId);
    localStorage.setItem('Entity-Version', status.version);
    localStorage.setItem('altResumeApi', status.links[1].href);
    window.location.href = status.links[0].href;
  }

  getUserBalance() {
		const requestBody = {
			products: ['sportsbook', 'casino'],
		};

		this.balance.getUserBalance(requestBody).subscribe(
			(data: any[]) => {
				this.userBalanceDetails = data;
				console.log(this.userBalanceDetails);
			},
			(error) => {
				console.error('Error:', error);
			}
		);
	}
  getTransactionsType() {
		const requestBody = {
			productId: ['pay'],
		};

		this.transactionsService.getTransactionsHistoryData(requestBody).subscribe(
			(type: any[]) => {
				this.transactionsType = type;
			},
			(error) => {
				console.error('Error:', error);
			}
		);
	}
  postData() {
		
	
    let startDate = this.appendTimezone(this.currentDate,'start');
    let enddate = this.appendTimezone(this.currentDate,'end');
		
		this.depositService.getdepositHistory(startDate, enddate,'deposit',0,0)
			.subscribe(
				(transactions: any[]) => {
					this.transactions = transactions;
          console.log(transactions)

				
    const currentDate = new Date().toISOString().split('T')[0];
    // Filter objects for the current date
    const currentDateObjects = this.transactions.filter(obj => obj.createdAt.startsWith(currentDate));
    console.log(currentDateObjects)

    // Sort the filtered array based on the timestamp
    const sortedCurrentDateObjects = currentDateObjects.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
    this.transactions = sortedCurrentDateObjects;

				},
				(error) => {
					console.error('Error:', error);
				}
			);
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
  appendTimezone(date, status = 'start') {
		if (status == 'start') return `${date}T00:00:00Z`;
		else return `${date}T23:59:59Z`;
	}

  ngOnDestroy() {
    this.profileService.depostiSubject.next(false);
  }
 }