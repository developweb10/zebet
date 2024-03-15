import { trigger } from '@angular/animations';
import {
	Component,
	EventEmitter,
	HostListener,
	OnInit,
	Output,
} from '@angular/core';
import { AllProductTransactionService } from './products.service';
import { ProductTransactionService } from './product-transaction.service';
import { TransactionsService } from './transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { FilterCalenderComponent } from './filtercomponent/filter.component';
import { DateSelectorEnum } from '../../../shared/bet-history/bet-history.enum';
import { DateLoader } from '../../../shared/calender/date-loader';
import { DepositService } from '../deposit/deposit.service';
// import { DepositService } from '../deposit/deposit.service';
// import { DateSelectorEnum } from '../bet-history/bet-history.enum';
// import { DateLoader } from '../calender/date-loader';

@Component({
	selector: 'app-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
	@Output()
	close: EventEmitter<string> = new EventEmitter<string>();
	showDatePicker: boolean = false;
	isDataLoaded: boolean = true;
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
	combinedHistory: any[] = [];
	isLoading: boolean = true;
	currentPage: number = 0;
	currentPages: number = 1;
	itemsPerPage: number = 10;
	initalCreatedAt: string;
	loadingData: boolean = false;
	initalDate: string;
	isSelectedStartDate;
	date = new Date();
	year = this.date.getFullYear();
	month = this.date.getMonth();
	currdate: string;
	dateSelectorEnum: DateSelectorEnum = DateSelectorEnum.START_DATE;
	isSelectedEndDate: boolean = false;
	calendarDateLoaders: DateLoader[] = [];
	months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	limit: number = 10;
	offset: number = 0;
	hideLoader: boolean = true;
	noTransactionsMessage: boolean = true;
	isPagination: boolean = false;
	nextPagecheck: boolean =false;

	constructor(
		private allProductTransactionService: AllProductTransactionService,
		private productTransactionService: ProductTransactionService,
		private transactionsService: TransactionsService,
		private dialog: MatDialog,
		private depositService: DepositService
	) {
		for (let i = 1; i <= 30; i++) {
			this.calendarDates.push(i);
		}
		// this.selectDate(25);
		let currentDate: Date = new Date();

		// Get the date 90 days back
		let date90DaysBack: Date = new Date();
		date90DaysBack.setDate(currentDate.getDate() - 90);
		this.initalDate = this.formatDate(date90DaysBack);
		this.initalCreatedAt = this.appendTimezone(this.initalDate, 'start');
	}
	ngOnInit(): void {
		// this.getDeopsitHistory();
		// this.getWithdrawaltHistory();
		this.manipulate();
		this.combineHistory();
		// this.allProductTransactionService
		// 	.getAllProducts()
		// 	.subscribe((data) => console.log('all products >>>>>>', data));

		// this.postData();
		// this.getTransactionsType();
	}

	// get totalPages(): number {
	// 	return Math.ceil(this.combinedHistory.length / this.itemsPerPage);
	// }
	// generatePageArray(): number[] {
	// 	return Array(this.totalPages)
	// 		.fill(0)
	// 		.map((x, i) => i + 1);
	// }

	// get visibleTransactions(): any[] {
	// 	const startIndex = (this.currentPage - 1) * this.itemsPerPage;
	// 	const endIndex = startIndex + this.itemsPerPage;
	// 	return this.combinedHistory.slice(startIndex, endIndex);
	// }

	nextPage() {
		this.nextPagecheck = true;
		this.hideLoader = false;
		this.noTransactionsMessage = false;
		this.currentPage++;
		this.currentPages++;
		this.offset = this.currentPage * this.limit;
		this.combineHistory();
		this.noTransactionsMessage = false;

	}

	prevPage() {
		this.hideLoader = false;
		this.noTransactionsMessage = false;

		if (this.currentPage >= 0) {
			this.currentPage--;
			this.currentPages--;
			this.offset = this.currentPage * this.limit;
			this.combineHistory();
		}
	}
	// setPage(pageNumber: number) {
	// 	if (pageNumber > 0 && pageNumber <= this.totalPages) {
	// 		this.currentPage = pageNumber;
	// 	}
	// }

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

	// postData() {
	// 	const requestBody = {
	// 		productId: ['pay'],
	// 		transactionTypeId: [
	// 			'DEPOSIT_SUCCEED',
	// 			'DEPOSIT_FAILED',
	// 			'WITHDRAWAL_SUCCEED',
	// 			'WITHDRAWAL_FAILED',
	// 			'INSTANT_DEPOSIT',
	// 			'INIT_DEPOSIT',
	// 			'INIT_WITHDRAWAL',
	// 		],
	// 	};

	// 	const limit = 10;
	// 	this.isDataLoaded = false;

	// 	this.productTransactionService
	// 		.productTransactionType(requestBody, limit)
	// 		.subscribe(
	// 			(transactions: any[]) => {
	// 				this.transactions = transactions;
	// 				this.isDataLoaded = true;
	// 			},
	// 			(error) => {
	// 				console.error('Error:', error);
	// 			}
	// 		);
	// }

	filterData(type: string) {
		this.currentPages = 1;
		this.currentPage = 0;
		this.limit = 10;
		this.offset = 0;
		this.isDataLoaded = false;
		this.initalCreatedAt = this.appendTimezone(this.startDate);
		this.combineHistory();
	}

	// getTransactionsType() {
	// 	const requestBody = {
	// 		productId: ['pay'],
	// 	};

	// 	this.transactionsService.getTransactionsHistoryData(requestBody).subscribe(
	// 		(type: any[]) => {
	// 			this.transactionsType = type;
	// 		},
	// 		(error) => {
	// 			console.error('Error:', error);
	// 		}
	// 	);
	// };

	allData() {
		this.isDataLoaded = false;
		this.initalCreatedAt = this.appendTimezone(this.initalDate, 'start');
		this.combineHistory();
	}
	combineHistory() {
		if (this.hideLoader) {
			this.loadingData = true;
		} else {
			this.loadingData = false;
		}

		let enddate = this.appendTimezone(this.endDate, 'end');
		this.depositService
			.getdepositHistory(
				this.initalCreatedAt,
				enddate,
				'all',
				this.limit,
				this.offset
			)
			.subscribe((res) => {
				if(this.nextPagecheck){
					this.combinedHistory = res;
				this.isPagination = this.combinedHistory.length > 0;
				this.noTransactionsMessage = false;
				this.loadingData = false;
				this.isDataLoaded = true;
				}else{
					this.combinedHistory = res;
					this.isPagination = this.combinedHistory.length > 0;
					this.noTransactionsMessage = !this.isPagination;
					this.loadingData = false;
					this.isDataLoaded = true;
				}
				
			});
	}

	refreshStatus(data: any, index: any) {
		this.combinedHistory[index].isLoading = true;
		const selfObjects = data.links.filter((obj) => obj.rel === 'self');

		this.depositService.getStatus(selfObjects[0].href).subscribe((res) => {
			if (res) {
				this.combinedHistory[index].isLoading = false;
			}
			this.combinedHistory[index].statusName = res[0].statusName;
		});
	}
	// selectDate(date) {
	// 	const currentDate = new Date(); // Get current date
	// 	this.selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date); // Set year and month from current date
	// 	const day = this.selectedDate.getDate();
	// 	const month = this.selectedDate.toLocaleString('default', {
	// 		month: 'short',
	// 	});
	// 	const year = this.selectedDate.getFullYear();

	// 	this.formattedDate = `${day}th ${month} ${year}`;
	// }
	selectDate(date) {
		const currentDate = new Date(); // Get current date
		this.selectedDate = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			date
		); // Set year and month from current date
		const day = this.selectedDate.getDate();
		const month = this.selectedDate.getMonth() + 1; // Adding 1 since getMonth() returns zero-based index
		const year = this.selectedDate.getFullYear();

		// Ensure day, month, and year are formatted with leading zeros if necessary
		const formattedDay = day < 10 ? '0' + day : day;
		const formattedMonth = month < 10 ? '0' + month : month;

		this.formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
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

	goHome() {
		this.close.emit('home');
	}

	openCalenderModel(): void {
		const dialogRef = this.dialog.open(FilterCalenderComponent, {
			// You can add configuration options for your dialog here
			width: '100vw',
			panelClass: 'filtterComponent',
			// Other options...
		});
	}
	navigateTo(nav) {
		// Check if the icon is "calendar-prev"
		// or "calendar-next"

		console.log('Date Tracker before', this.month, this.year);
		this.month = nav === 'previous' ? this.month - 1 : this.month + 1;

		// Check if the month is out of range
		if (this.month < 0 || this.month > 11) {
			// Set the date to the first day of the
			// month with the new year
			this.date = new Date(this.year, this.month, new Date().getDate());

			// Set the year to the new year
			this.year = this.date.getFullYear();

			// Set the month to the new month
			this.month = this.date.getMonth();
		} else {
			// Set the date to the current date
			this.date = new Date();
		}

		console.log('Date Tracker', this.month, this.year);

		// Call the manipulate function to
		// update the calendar display
		this.manipulate();
	}
	manipulate() {
		//console.log("Manipulate", this.date)

		this.calendarDateLoaders = [];

		// Get the first day of the month
		let dayone = new Date(this.year, this.month, 1).getDay();
		//alert(dayone)

		// Get the last date of the month
		let lastdate = new Date(this.year, this.month + 1, 0).getDate();

		// Get the day of the last date of the month
		let dayend = new Date(this.year, this.month, lastdate).getDay();

		// Get the last date of the previous month
		let monthlastdate = new Date(this.year, this.month, 0).getDate();

		// Variable to store the generated calendar HTML
		let lit = '';

		// Loop to add the last dates of the previous month
		for (let i = dayone; i > 0; i--) {
			lit += `<div class="calendar-day">${monthlastdate - i + 1}</div>`;
			this.calendarDates.push(monthlastdate - i + 1);
			this.calendarDateLoaders.push({
				day: monthlastdate - i + 1,
				month: this.month - 1,
				year: this.year,
			});
		}

		// Loop to add the dates of the current month
		for (let i = 1; i <= lastdate; i++) {
			// Check if the current date is today
			let isToday =
				i === this.date.getDate() &&
				this.month === new Date().getMonth() &&
				this.year === new Date().getFullYear()
					? true
					: false;
			lit += `<div class="calendar-day active">${i}</div>`;
			this.calendarDates.push(i);

			this.calendarDateLoaders.push({
				day: i,
				month: this.month,
				year: this.year,
			});

			if (isToday)
				this.selectDateMobile({
					day: i,
					month: this.month,
					year: this.year,
				});
		}

		// Loop to add the first dates of the next month
		for (let i = dayend; i < 6; i++) {
			lit += `<div class="calendar-day">${i - dayend + 1}</div>`;
			this.calendarDates.push(i - dayend + 1);

			this.calendarDateLoaders.push({
				day: i - dayend + 1,
				month: this.month + 1,
				year: this.year,
			});
		}

		// Update the text of the current date element
		// with the formatted current month and year
		this.currdate = `${this.months[this.month]} ${this.year}`;

		console.log('Current Date Tracker', this.month, this.year);

		// update the HTML of the dates element
		// with the generated calendar
		//this.cal = lit;
	}
	setLabel(label) {
		switch (label) {
			case 'FROM':
				this.dateSelectorEnum = DateSelectorEnum.START_DATE;
				this.isSelectedStartDate = true;
				this.isSelectedEndDate = false;
				break;

			case 'TO':
				this.dateSelectorEnum = DateSelectorEnum.END_DATE;
				this.isSelectedStartDate = false;
				this.isSelectedEndDate = true;
				break;
		}
	}
	selectDateMobile(date: DateLoader, checkDate: boolean = false) {
		//console.log(date);

		switch (this.dateSelectorEnum) {
			case DateSelectorEnum.START_DATE:
				this.startDate = this.formatDate(
					new Date(date.year, date.month, date.day)
				);
				this.dateSelectorEnum = checkDate
					? DateSelectorEnum.END_DATE
					: DateSelectorEnum.START_DATE;
				break;

			case DateSelectorEnum.END_DATE:
				this.endDate = this.formatDate(
					new Date(date.year, date.month, date.day)
				);
				this.dateSelectorEnum = DateSelectorEnum.START_DATE;
				break;
		}
		this.selectedDate = new Date(date.year, date.month, date.day);
		const day = this.selectedDate.getDate();
		const month = this.selectedDate.toLocaleString('default', {
			month: 'short',
		});
		const year = this.selectedDate.getFullYear();

		this.formattedDate = `${day}th ${month} ${year}`;
	}
	isDateActiveMobile(date: DateLoader) {
		if (this.selectedDate) {
			const selectedDay = this.selectedDate.getDate();
			const selectedMonth = this.selectedDate.getMonth();
			return date.day === selectedDay && date.month == selectedMonth;
		}
		return false;
	}
	filterCustomDate() {
		this.currentPages = 1;
		this.currentPage = 0;
		this.limit = 10;
		this.offset = 0;
		this.showFilterModal = false;
		console.log('Date', this.startDate, this.endDate);
		this.initalCreatedAt = this.appendTimezone(this.startDate);
		this.combineHistory();
	}
	handleStartDateChange(event) {
		this.startDate = this.formatDate(event.value);
	}
	getToday(): string {
		// Get the current date in the format 'YYYY-MM-DD'
		const today = new Date();
		const year = today.getFullYear();
		const month = (today.getMonth() + 1).toString().padStart(2, '0');
		const day = today.getDate().toString().padStart(2, '0');

		return `${year}-${month}-${day}`;
	}
	handleEndDateChange(event) {
		this.endDate = this.formatDate(event.value);
	}
}
