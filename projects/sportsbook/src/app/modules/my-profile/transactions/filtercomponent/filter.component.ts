import {
	Component,
	EventEmitter,
	OnInit,
	Output,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductTransactionService } from '../product-transaction.service';
import { TransactionsService } from '../transaction.service';
import { AllProductTransactionService } from '../products.service';


@Component({
	selector: 'app-filtercomponent',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.css'],
})
export class FilterCalenderComponent implements OnInit {
	@Output()
	close: EventEmitter<boolean> = new EventEmitter<boolean>();

	isDataLoaded: boolean = false;
	calendarDates: number[] = [];
	transactions: any[] = [];
	transactionsType: any[] = [];
	cvcf;
	selectedDate: Date;
	formattedDate: string;
	formattedTransactions: { transaction: any; formattedTime: string }[] = [];
	showFilterModal = false;
	startDate = this.formatDate(new Date());
	endDate = this.formatDate(new Date());

	constructor(private dialogRef: MatDialogRef<FilterCalenderComponent>, 
		private allProductTransactionService: AllProductTransactionService,
		private productTransactionService: ProductTransactionService,
		private transactionsService: TransactionsService,) {
		for (let i = 1; i <= 30; i++) {
			this.calendarDates.push(i);
		}
		this.selectDate(25);
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

	postData() {
		const requestBody = {
			productId: ['pay'],
			transactionTypeId: [
				'DEPOSIT_SUCCEED',
				'DEPOSIT_FAILED',
				'WITHDRAWAL_SUCCEED',
				'WITHDRAWAL_FAILED',
				'INSTANT_DEPOSIT',
				'INIT_DEPOSIT',
				'INIT_WITHDRAWAL',
			],
		};

		const limit = 10;
		this.isDataLoaded = false;

		this.productTransactionService
			.productTransactionType(requestBody, limit)
			.subscribe(
				(transactions: any[]) => {
					this.transactions = transactions;
					this.isDataLoaded = true;
				},
				(error) => {
					console.error('Error:', error);
				}
			);
	}

	filterData() {
		const filterRequestBody = {
			productId: ['pay'],
			transactionTypeId: [
				'DEPOSIT_SUCCEED',
				'DEPOSIT_FAILED',
				'WITHDRAWAL_SUCCEED',
				'WITHDRAWAL_FAILED',
			],

			dateFrom: this.appendTimezone(this.startDate),
			dateTo: this.appendTimezone(this.endDate, 'end'),
		};

		const limit = 15;

		this.isDataLoaded = false;

		this.productTransactionService
			.productTransactionType(filterRequestBody, limit)
			.subscribe(
				(transactions: any[]) => {
					this.transactions = transactions;
					this.isDataLoaded = true;
				},
				(error) => {
					console.error('Error:', error);
					this.isDataLoaded = true;
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

	ngOnInit(): void {
		this.allProductTransactionService
			.getAllProducts()
			.subscribe((data) => console.log('all products >>>>>>', data));

		this.postData();
		this.getTransactionsType();
	}

	selectDate(date) {
		this.selectedDate = new Date(2023, 8, date);
		const day = this.selectedDate.getDate();
		const month = this.selectedDate.toLocaleString('default', {
			month: 'short',
		});
		const year = this.selectedDate.getFullYear();

		this.formattedDate = `${day}th ${month} ${year}`;
	}

	isDateActive(date: number) {
		if (this.selectedDate) {
			const selected = this.selectedDate.getDate();
			return date === selected;
		}
		return false;
	}

	openFilterModal() {
		this.showFilterModal = true;
	}

	closeDialog(): void {
		this.dialogRef.close(); // Close the dialog
	}

}
