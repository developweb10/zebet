import { DatePipe } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { TimeLimitService } from '../../../shared/responsible-gaming/time-limit.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-add-gaming-limit',
  templateUrl: './add-gaming-limit.component.html',
  styleUrls: ['./add-gaming-limit.component.css']
})
export class AddGamingLimitComponent {
  selectedLimit: string
  

  onLimitChange() {
    // Update local storage when the gender changes
    this.selectedLimit = this.selectedLimit;
  }

  setLimit(){

  }

  closeModal() {
	this.dialogRef.close(null);
  }

  getToday(): string {
	// Get the current date in the format 'YYYY-MM-DD'
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');

	return `${year}-${month}-${day}`;
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
				return yyyy + '-' + mm + '-' +dd ;
   
   }

   	canSelect = false;
  	startDate = this.formatDate(new Date());
  	endDate = this.formatDate(new Date());
	isSubmitting: boolean = false;
	addTimeLimit = false;
	addFinancialLimit = false;
	addExclusion = false;
	addTimeLimitMobile = false;
	addFinancialLimitMobile = false;
	addExclusionMobile = false;
	selectedOption: string = '';
	selectedSubOption: string = 'Daily';
	selectedSubOptionType: string = 'Deposit';
	selectedCustomType: string;
	isCustom: boolean = true;
	activeBtn: string = '';
	selectedAmount = '';
	date = '';
	formattedDate = '';
	duration: any;
	limit: boolean = false;
	timeLimitData: any[] = [];
	financialLimitData: any[] = [];
	exclusionsData: any[] = [];

	selfExclusionId: string = '';
	tempBreakId: string = '';

	dailyId: string = '';
	weeklyId: string = '';
	monthlyId: string = '';

	dailyRecordId: string = '';
	weeklyRecordId: string = '';
	monthlyRecordId: string = '';

	updateLimit: boolean = false;
	updateFinancialLimit: boolean = false;
	updateExclusion: boolean = false;

	updateLimitMobile: boolean = false;
	updateFinancialLimitMobile: boolean = false;
	updateExclusionMobile: boolean = false;

	showTimeLimits: boolean = false;
	showFinancialLimits: boolean = true;
	showExclusions: boolean = false;

	dailyDeposit: any;
	weeklyDeposit: any;
	monthlyDeposit: any;

	dailyLoss: any;
	weeklyLoss: any;
	monthlyLoss: any;

	dailyWager: any;
	weeklyWager: any;
	monthlyWager: any;

	dailyDepositId: string = '';
	weeklyDepositId: string = '';
	monthlyDepositId: string = '';

	dailyLossId: string = '';
	weeklyLossId: string = '';
	monthlyLossId: string = '';

	dailyWagerId: string = '';
	weeklyWagerId: string = '';
	monthlyWagerId: string = '';

	dailyDepositRecordId: string = '';
	weeklyDepositRecordId: string = '';
	monthlyDepositRecordId: string = '';

	dailyLossRecordId: string = '';
	weeklyLossRecordId: string = '';
	monthlyLossRecordId: string = '';

	dailyWagerRecordId: string = '';
	weeklyWagerRecordId: string = '';
	monthlyWagerRecordId: string = '';
	toastr = inject(ToastrService);
	canAdd: boolean;
	canEdit: boolean;
	selfExclusion: any;
	tempBreak: any;

	selectedRecordId: string;
	optionLabel:string;

	constructor(
		private datePipe: DatePipe,
		private timeLimit: TimeLimitService,
		public dialogRef: MatDialogRef<AddGamingLimitComponent>, @Inject(MAT_DIALOG_DATA) public data: any
	) {}

	ngOnInit(): void {
		this.selectedOption = this.data.selectedOption;
		this.canAdd = this.data.canAdd;
		

		//alert(this.selectedOption)
		// this.getPlayerLimits();
		// this.getFinancialLimits();
		// this.getPlayerExclusions();
		combineLatest([
			this.timeLimit.getFinancialLimits(),
			this.timeLimit.getExclusions()
		])
		.subscribe(limits => {

			console.log("Limits",limits)

			//Financial Limit
			let financialLimits = limits[0];
			this.financialLimitData = financialLimits;

			this.dailyDepositId = financialLimits[0].settingsInfo.id;
			this.dailyDepositRecordId = financialLimits[0].id;
			this.dailyDeposit = financialLimits[0];

			this.weeklyDepositId = financialLimits[1].settingsInfo.id;
			this.weeklyDepositRecordId = financialLimits[1].id;
			this.weeklyDeposit = financialLimits[1];

			this.monthlyDepositId = financialLimits[2].settingsInfo.id;
			this.monthlyDepositRecordId = financialLimits[2].id;
			this.monthlyDeposit = financialLimits[2];

			this.dailyLossId = financialLimits[3].settingsInfo.id;
			this.dailyLossRecordId = financialLimits[3].id;
			this.dailyLoss = financialLimits[3];

			this.weeklyLossId = financialLimits[4].settingsInfo.id;
			this.weeklyLossRecordId = financialLimits[4].id;
			this.weeklyLoss = financialLimits[4];

			this.monthlyLossId = financialLimits[5].settingsInfo.id;
			this.monthlyLossRecordId = financialLimits[5].id;
			this.monthlyLoss = financialLimits[5];

			this.dailyWagerId = financialLimits[6].settingsInfo.id;
			this.dailyWagerRecordId = financialLimits[6].id;
			this.dailyWager = financialLimits[6];

			this.weeklyWagerId = financialLimits[7].settingsInfo.id;
			this.weeklyWagerRecordId = financialLimits[7].id;
			this.weeklyWager = financialLimits[7];

			this.monthlyWagerId = financialLimits[8].settingsInfo.id;
			this.monthlyWagerRecordId = financialLimits[8].id;
			this.monthlyWager = financialLimits[8];

			//Exclusions
			let playerExclusions = limits[1];
			this.exclusionsData = playerExclusions;
			this.selfExclusionId = playerExclusions[0].settingsInfo.id;
			this.selfExclusion = playerExclusions[0];
			this.tempBreakId = playerExclusions[1].settingsInfo.id;
			this.tempBreak = playerExclusions[1];

			switch(this.selectedOption)
			{
				case 'FinancialLimit':
					this.optionLabel = 'Financial Limit';
					this.setSubOption("Daily");
					this.setSubOptionType("Deposit")
				break;

				case 'Exclusion':
					this.setSubOption("Temporary");
					this.optionLabel = 'Self Exclusion';
				break;
			}

			
		})
	}

	getPlayerLimits() {
		this.timeLimit.getLimits().subscribe((playerLimits) => {
			this.timeLimitData = playerLimits;
			this.dailyId = playerLimits[0].settingsInfo.id;
			this.dailyRecordId = playerLimits[0].id;
			this.weeklyId = playerLimits[1].settingsInfo.id;
			this.weeklyRecordId = playerLimits[1].id;
			this.monthlyId = playerLimits[2].settingsInfo.id;
			this.monthlyRecordId = playerLimits[2].id;
		});
	}

	getPlayerExclusions() {
		this.timeLimit.getExclusions().subscribe((playerExclusions) => {
			this.exclusionsData = playerExclusions;
			this.selfExclusionId = playerExclusions[0].settingsInfo.id;
			this.selfExclusion = playerExclusions[0];
			this.tempBreakId = playerExclusions[1].settingsInfo.id;
			this.tempBreak = playerExclusions[1];
		});
	}

	getFinancialLimits() {
		this.timeLimit.getFinancialLimits().subscribe((financialLimits) => {
			this.financialLimitData = financialLimits;

			this.dailyDepositId = financialLimits[0].settingsInfo.id;
			this.dailyDepositRecordId = financialLimits[0].id;
			this.dailyDeposit = financialLimits[0];

			this.weeklyDepositId = financialLimits[1].settingsInfo.id;
			this.weeklyDepositRecordId = financialLimits[1].id;
			this.weeklyDeposit = financialLimits[1];

			this.monthlyDepositId = financialLimits[2].settingsInfo.id;
			this.monthlyDepositRecordId = financialLimits[2].id;
			this.monthlyDeposit = financialLimits[2];

			this.dailyLossId = financialLimits[3].settingsInfo.id;
			this.dailyLossRecordId = financialLimits[3].id;
			this.dailyLoss = financialLimits[3];

			this.weeklyLossId = financialLimits[4].settingsInfo.id;
			this.weeklyLossRecordId = financialLimits[4].id;
			this.weeklyLoss = financialLimits[4];

			this.monthlyLossId = financialLimits[5].settingsInfo.id;
			this.monthlyLossRecordId = financialLimits[5].id;
			this.monthlyLoss = financialLimits[5];

			this.dailyWagerId = financialLimits[6].settingsInfo.id;
			this.dailyWagerRecordId = financialLimits[6].id;
			this.dailyWager = financialLimits[6];

			this.weeklyWagerId = financialLimits[7].settingsInfo.id;
			this.weeklyWagerRecordId = financialLimits[7].id;
			this.weeklyWager = financialLimits[7];

			this.monthlyWagerId = financialLimits[8].settingsInfo.id;
			this.monthlyWagerRecordId = financialLimits[8].id;
			this.monthlyWager = financialLimits[8];
		});
	}

	setExclusion() {
		this.isSubmitting = true;
		if (this.selectedOption === 'Exclusion' && this.selectedSubOption == "Permanent") {
			const requestBody = {
				settingsId: this.selfExclusionId,
				duration: 99,
				period: 'y',
			};

			this.timeLimit.setExclusion(requestBody).subscribe(
				(res: any[]) => {
					this.toastr.success("Permanent Exclusion set Successfully")
					this.isSubmitting = false;
					this.closeModal();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					this.isSubmitting = false;
					this.toastr.error(error);
				}
			);
		}

		else if (this.selectedOption === 'Exclusion' && this.selectedSubOption == "Temporary") {

			const date1 = new Date(this.startDate);
			const date2 = new Date(this.endDate);
			const differenceInTime = date2.getTime() - date1.getTime();
			const differenceInDays = differenceInTime / (1000 * 3600 * 24);

			if(differenceInDays <= 0)
			{
				alert("Check the data");
				return;
			}
				
			const requestBody = {
				settingsId: this.tempBreakId,
				duration: differenceInDays,
				period: 'd',
			};

			this.timeLimit.setExclusion(requestBody).subscribe(
				(res: any[]) => {
					this.toastr.success("Temporary Exclusion set Successfully")
					this.getPlayerExclusions();
					this.addExclusion = false;
					this.exclusionsData.length !== 0;
					this.isSubmitting = false;
					this.closeModal()
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					this.toastr.error(error);
					this.isSubmitting = false;
				}
			);
		}

		
	}
	setFinancialLimit() {
		//alert(this.selectedSubOptionType)
		// Deposits

		if(this.selectedAmount == '')
		{
			alert("Please Add Limit Amount");
			return;
		}

		this.isSubmitting = true
		if (this.selectedSubOption === 'Daily') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					settingsId: this.dailyDepositId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						console.log("FinRes", res)
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					settingsId: this.dailyLossId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					settingsId: this.dailyWagerId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			
		}
		else if (this.selectedSubOption === 'Weekly') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					settingsId: this.weeklyDepositId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit set Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					settingsId: this.weeklyLossId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					settingsId: this.weeklyWagerId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			
		}
		else if (this.selectedSubOption === 'Monthly') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					settingsId: this.monthlyDepositId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						console.error('Error:', error);
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					settingsId: this.monthlyLossId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					settingsId: this.monthlyWagerId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.setFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false
						this.toastr.success("Financial Limit set Successfully")
						this.dialogRef.close({section: 'FinancialLimit', operation: 'set'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			
		}

		// if (
		// 	this.activeBtn === 'Monthly' &&
		// 	this.selectedOption === 'financialLimitsDeposit'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.monthlyDepositId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// // Loss

		// if (
		// 	this.activeBtn === 'Day' &&
		// 	this.selectedOption === 'financialLimitsLoss'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.dailyLossId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// if (
		// 	this.activeBtn === 'Week' &&
		// 	this.selectedOption === 'financialLimitsLoss'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.weeklyLossId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// if (
		// 	this.activeBtn === 'Month' &&
		// 	this.selectedOption === 'financialLimitsLoss'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.monthlyLossId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// Wager Limits

		// if (
		// 	this.activeBtn === 'Day' &&
		// 	this.selectedOption === 'financialLimitsWager'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.dailyWagerId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// if (
		// 	this.activeBtn === 'Week' &&
		// 	this.selectedOption === 'financialLimitsWager'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.weeklyWagerId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }

		// if (
		// 	this.activeBtn === 'Month' &&
		// 	this.selectedOption === 'financialLimitsWager'
		// ) {
		// 	const requestBody = {
		// 		settingsId: this.monthlyWagerId,
		// 		amount: parseFloat(this.selectedAmount),
		// 		currency: 'NGN',
		// 	};

		// 	this.timeLimit.setFinancialLimit(requestBody).subscribe(
		// 		(res: any[]) => {
		// 			this.getFinancialLimits();
		// 			this.addFinancialLimit = false;
		// 			this.timeLimitData.length !== 0;
		// 		},
		// 		(error) => {
		// 			console.error('Error:', error);
		// 			// Todo : Implement toast notification
		// 			alert('unable to add limit. Bad parameters');
		// 		}
		// 	);
		// }
	}

	editFinancialLimit(recordId = "") {
		this.isSubmitting = true;
		if (this.selectedSubOption === 'Daily') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					recordId: this.dailyDepositRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					recordId: this.dailyLossRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					recordId: this.dailyWagerRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			
		}
		else if (this.selectedSubOption === 'Weekly') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					recordId: this.weeklyDepositRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					recordId: this.weeklyLossRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					recordId: this.weeklyWagerRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			
		}
		else if (this.selectedSubOption === 'Monthly') {

			if(this.selectedSubOptionType === 'Deposit')
			{
				const requestBody = {
					recordId: this.monthlyDepositRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Loss')
			{
				const requestBody = {
					recordId: this.monthlyLossRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error);
					}
				);
			}
			else if(this.selectedSubOptionType === 'Wager')
			{
				const requestBody = {
					recordId: this.monthlyWagerRecordId,
					amount: parseFloat(this.selectedAmount),
					currency: 'NGN',
				};
	
				this.timeLimit.updateFinancialLimit(requestBody).subscribe(
					(res: any[]) => {
						this.isSubmitting = false;
						this.toastr.success("Financial Limit updated Successfully");
						this.dialogRef.close({section: 'FinancialLimit', operation: 'update'});
					},
					(error) => {
						this.isSubmitting = false;
						this.toastr.error(error)
					}
				);
			}
			
		}

		
	}
	
	setSubOption(option: string){
		this.selectedSubOption = option;
		this.selectedOption == 'FinancialLimit' ? this.selectedSubOptionType = "Deposit" : "";

		this.checkCondition();

		
	}

	setSubOptionType(data) {
		this.selectedSubOptionType = data;

		this.checkCondition();
	}

	handleStartDateChange(event) {
		this.startDate = this.formatDate(event.value);
	}
	
	handleEndDateChange(event) {
		this.endDate = this.formatDate(event.value);
	}

	revokeTimeLimit(id: string) {
		if (id === this.dailyRecordId) {
			// this ensures I'm revoking the daily
			const requestBody = {
				recordId: this.dailyRecordId,
			};

			this.timeLimit.revokeTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successful');
					this.getPlayerLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.weeklyRecordId) {
			// this ensures I'm revoking the weekly
			const requestBody = {
				recordId: this.weeklyRecordId,
			};

			this.timeLimit.revokeTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successful');
					this.getPlayerLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.monthlyRecordId) {
			// this ensures I'm revoking the monthly
			const requestBody = {
				recordId: this.monthlyRecordId,
			};

			this.timeLimit.revokeTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successful');
					this.getPlayerLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}
	}

	// revoking financial limits

	revokeFinancialLimit(id: string) {
		if (id === this.dailyDepositRecordId) {
			const requestBody = {
				recordId: this.dailyDepositRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.weeklyDepositRecordId) {
			const requestBody = {
				recordId: this.weeklyDepositRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.monthlyDepositRecordId) {
			const requestBody = {
				recordId: this.monthlyDepositRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		// revoke loss limits

		if (id === this.dailyLossRecordId) {
			const requestBody = {
				recordId: this.dailyLossRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.weeklyLossRecordId) {
			const requestBody = {
				recordId: this.weeklyLossRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.monthlyLossRecordId) {
			const requestBody = {
				recordId: this.monthlyLossRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		// revoke wager limits

		if (id === this.dailyWagerRecordId) {
			const requestBody = {
				recordId: this.dailyWagerRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.weeklyWagerRecordId) {
			const requestBody = {
				recordId: this.weeklyWagerRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}

		if (id === this.monthlyWagerRecordId) {
			const requestBody = {
				recordId: this.monthlyWagerRecordId,
			};

			this.timeLimit.revokeFinancialLimit(requestBody).subscribe(
				(res: any[]) => {
					alert('Successfully initiated limit revoke');
					this.getFinancialLimits();
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('An error occured');
				}
			);
		}
	}

	checkCondition() {
		if(this.selectedOption == 'FinancialLimit')
		{
			if (this.selectedSubOption === 'Daily') {

				if(this.selectedSubOptionType === 'Deposit')
				{
					if(this.dailyDeposit.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.dailyDeposit.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
					
				}
				else if(this.selectedSubOptionType === 'Loss')
				{
					if(this.dailyLoss.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.dailyLoss.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				else if(this.selectedSubOptionType === 'Wager')
				{
					if(this.dailyWager.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.dailyWager.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				
			}
			else if (this.selectedSubOption === 'Weekly') {
	
				if(this.selectedSubOptionType === 'Deposit')
				{
					if(this.weeklyDeposit.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.weeklyDeposit.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				else if(this.selectedSubOptionType === 'Loss')
				{
					if(this.weeklyLoss.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.weeklyLoss.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				else if(this.selectedSubOptionType === 'Wager')
				{
					if(this.weeklyWager.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.weeklyWager.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				
			}
			else if (this.selectedSubOption === 'Monthly') {
	
				if(this.selectedSubOptionType === 'Deposit')
				{
					if(this.monthlyDeposit.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.monthlyDeposit.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				else if(this.selectedSubOptionType === 'Loss')
				{
					if(this.monthlyLoss.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.monthlyLoss.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				else if(this.selectedSubOptionType === 'Wager')
				{
					if(this.monthlyWager.actions.includes('set'))
					{
						this.canAdd = true;
						this.canEdit = false;
					}
					else if(this.monthlyWager.actions.includes('update'))
					{
						this.canAdd = false;
						this.canEdit = true;
					}
				}
				
			}
		}
		else if(this.selectedOption == 'Exclusion')
		{
			if (this.selectedSubOption === 'Temporary') {

				if(this.tempBreak.actions.includes('set'))
				{
					this.canAdd = true;
					this.canEdit = false;
				}
				else if(this.tempBreak.actions.includes('update'))
				{
					this.canAdd = false;
					this.canEdit = true;
				}
				
			}
			else if (this.selectedSubOption === 'Permanent') {
				
				if(this.selfExclusion.actions.includes('set'))
				{
					this.canAdd = true;
					this.canEdit = false;
				}
				else if(this.selfExclusion.actions.includes('update'))
				{
					this.canAdd = false;
					this.canEdit = true;
				}
				
			}
			
		}
		
	}

	openUpdateModal(id: string) {
		if (
			id === this.dailyRecordId ||
			id === this.dailyDepositRecordId ||
			id === this.dailyLossRecordId ||
			id === this.dailyWagerRecordId
		) {
			this.addTimeLimit = true;
			this.addFinancialLimit = true;
			this.updateLimit = true;
		}

		if (
			id === this.weeklyRecordId ||
			id === this.weeklyDepositRecordId ||
			id === this.weeklyLossRecordId ||
			id === this.weeklyWagerRecordId
		) {
			this.addTimeLimit = true;
			this.addFinancialLimit = true;
			this.updateLimit = true;
		}

		if (
			id === this.monthlyRecordId ||
			id === this.monthlyDepositRecordId ||
			id === this.monthlyLossRecordId ||
			id === this.monthlyWagerRecordId
		) {
			this.addTimeLimit = true;
			this.addFinancialLimit = true;
			this.updateLimit = true;
		}
	}

	updateTimeLimit() {
		if (this.activeBtn === 'Day') {
			const requestBody = {
				recordId: this.dailyRecordId,
				duration: parseFloat(this.duration),
				period: 'h',
			};

			this.timeLimit.updateTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					this.getPlayerLimits();
					this.addTimeLimit = false;
					this.timeLimitData.length !== 0;
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('unable to update limit. Bad parameters');
				}
			);
		}

		// update weekly limit

		if (this.activeBtn === 'Week') {
			const requestBody = {
				recordId: this.weeklyRecordId,
				duration: parseFloat(this.duration),
				period: 'd',
			};

			this.timeLimit.updateTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					this.getPlayerLimits();
					this.addTimeLimit = false;
					this.timeLimitData.length !== 0;
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('unable to update limit. Bad parameters');
				}
			);
		}

		// update monthly limit

		if (this.activeBtn === 'Month') {
			const requestBody = {
				recordId: this.monthlyRecordId,
				duration: parseFloat(this.duration),
				period: 'd',
			};

			this.timeLimit.updateTimeLimit(requestBody).subscribe(
				(res: any[]) => {
					this.getPlayerLimits();
					this.addTimeLimit = false;
					this.timeLimitData.length !== 0;
				},
				(error) => {
					console.error('Error:', error);
					// Todo : Implement toast notification
					alert('unable to update limit. Bad parameters');
				}
			);
		}
	}

	activeBtnClick(active) {
		this.activeBtn = active;
	}
	onSelectChange(event: any) {
		this.selectedOption = event.target.value;
		
		switch(this.selectedOption)
		{
			case 'FinancialLimit':
				this.setSubOption("Daily");
				this.setSubOptionType("Deposit")
			break;

			case 'Exclusion':
				this.setSubOption("Temporary");
			break;
		}
		
	}
	enteredamount(event) {
		this.selectedAmount = event.target.value;
		// this.limits.push(`NGN ${this.selectedAmount}.00`);
	}
	onDateChange(event2) {
		this.formattedDate = this.datePipe.transform(event2, 'dd/MM/yyyy');
	}

	enteredDuration(event) {
		this.duration = event.target.value;
	}

	demoSubmit() {
		this.addTimeLimit = false;
		this.timeLimitData.length !== 0;
	}

	closeAddModal() {
		this.addTimeLimit = false;
		this.addFinancialLimit = false;
		this.addExclusion = false;
		this.timeLimitData.length !== 0;
	}

	// goHome(): void {
	// 	this.close.emit(true);
	// }

	renderTimeLimits() {
		this.showTimeLimits = true;
		this.showFinancialLimits = false;
		this.showExclusions = false;
	}

	renderFinancialLimits() {
		this.showTimeLimits = false;
		this.showExclusions = false;
		this.showFinancialLimits = true;
	}

	renderExclusions() {
		this.showTimeLimits = false;
		this.showFinancialLimits = false;
		this.showExclusions = true;
	}
  
}
