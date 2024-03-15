import { Component, EventEmitter, HostListener, Inject, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BetHistoryService } from './bet-history.service';
import { Subject, Subscription, combineLatest } from 'rxjs';
import { BetHistoryData, BetLeg } from './bet-history.data';
import { CommonModule, DatePipe } from '@angular/common';
import { DateLoader } from '../calender/date-loader';
import { DateSelectorEnum } from './bet-history.enum';
import { BettingService } from '../../services/betting-service';
import { take, takeUntil } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';
import { StompHeaders } from '@livedoc';
import { CashoutOffer } from '../../dto/cashout.offer.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CashoutWidgetComponent } from '../cashout-widget/cashout-widget.component';
import { LiveGameComponent } from '../live-game/live-game.component';
import { CashoutOfferComponent } from '../cashout-offer/cashout-offer.component';
import { GameStatComponent } from '../../components/game-stat/game-stat.component';
import { MatInputModule } from '@angular/material/input';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthFNCService } from '../../auth-fnc.service';

@Component({
  selector: 'app-bet-history',
  standalone: true,
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.css'],

  imports: [CommonModule, MatInputModule ,MatFormFieldModule, MatDatepickerModule, FormsModule, CashoutWidgetComponent, LiveGameComponent, CashoutOfferComponent, GameStatComponent],
})
export class BetHistoryComponent implements OnInit, OnDestroy {

  @Output()
  close: EventEmitter <boolean> = new EventEmitter <boolean> ();

  notifier = new Subject();

  MODE: string = "FULL";

  currentIndex = 0;

  private _dataSection: string = "PROFILE";

  @Input()
  set SECTION(value: string) {
    //alert(value)
    if(value != "")
    {
      this._dataSection = value;
      if(value == 'PROFILE')
        this.MODE = 'FULL';
      else if(value == 'MYBET')
        this.MODE = 'PARTIAL';
    }
    
    // this.isDataLoaded = false;
    // this.loadData();
  }

  get SECTION(): string {
    return this._dataSection;
  }

  currentPage: number = 1;
	itemsPerPage: number = 10;
  
  authService = inject(AuthFNCService);

  isDataLoaded: boolean = false;
  calendarDates: number[] = [];
  selectedDate: Date; 
  formattedDate: string;
  showFilterModal = false;
  showOptions = false;
  showOptions2 = false;
  showNumberOptions = false;
  showNumberOptions2 = false;
  isOpen = false;
  mobileOpen = false;
  tabOpen = false;
  startDate = this.formatDate(new Date());
  endDate = this.formatDate(new Date());
  betHistoryData?: BetHistoryData[] = [];
  currentTab = "ALL";
  betDataSet?: BetHistoryData[] = [];
  dataSize = 10;
  dateSelectorEnum: DateSelectorEnum = DateSelectorEnum.START_DATE;
  isSelectedStartDate: boolean = true;
  isSelectedEndDate: boolean = false;
  isLoading: boolean = false;

  isBetHistory = false;
  isCashout = false;
  isLiveGame = false;

  isSelectedWin: boolean = false;
  isSelectedLoss: boolean = false;

  statData : Subject<string> = new Subject<string>();
	statData$ = this.statData.asObservable()
  
  calendarDateLoaders: DateLoader[] = [];
  currdate: string;

  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth();

  canSearch = false;

  canShare = false;

  betttingService = inject(BettingService);

  sharedService = inject(SharedService);
 
  cal = "";
 
// Array of month names
 months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
  modalSubscribe: Subscription;

  currentTime = new Date();
  bettingService = inject(BettingService);
  breakpointObserver = inject(BreakpointObserver);
  isMobile: boolean;

  constructor(private betHistoryService: BetHistoryService, public datepipe: DatePipe) {
    this.manipulate();

    this.modalSubscribe = this.bettingService.myBetLoader$.subscribe(data => {
        //alert(data)
        this.MODE = data;
      })
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    
    this.modalSubscribe.unsubscribe();
    console.log('Items destroyed');
  }
  
  ngOnInit(): void {

    this.currentTime.setDate(this.currentTime.getDate() - 90);
    this.startDate = this.formatDate(this.currentTime);

    this.authService.newToken(localStorage.getItem("fnc_accessToken"))

    this.loadData();
  }

  ngAfterViewInit(): void {
    this.isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  get totalPages(): number {
		return Math.ceil(this.betHistoryData.length / this.itemsPerPage);
	}
	generatePageArray(): number[] {
		return Array(this.totalPages)
			.fill(0)
			.map((x, i) => i + 1);
	}

	get visibleTransactions(): any[] {
		const startIndex = (this.currentPage - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage;
		return this.betHistoryData.slice(startIndex, endIndex);
	}

	nextPage() {
		if (this.currentPage < this.totalPages) {
			this.currentPage++;
		}
	}

	prevPage() {
		if (this.currentPage > 1) {
			this.currentPage--;
		}
	}
	setPage(pageNumber: number) {
		if (pageNumber > 0 && pageNumber <= this.totalPages) {
			this.currentPage = pageNumber;
		}
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

  selectDateMobile(date: DateLoader, checkDate: boolean = false) {

    //console.log(date);
    
    switch(this.dateSelectorEnum)
    {
      case DateSelectorEnum.START_DATE:
        this.startDate = this.formatDate(new Date(date.year, date.month, date.day));
        this.dateSelectorEnum = checkDate ? DateSelectorEnum.END_DATE : DateSelectorEnum.START_DATE;
      break;

      case DateSelectorEnum.END_DATE:
        this.endDate = this.formatDate(new Date(date.year, date.month, date.day));
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

  @HostListener('window:resize', []) updateDays() {
    if (window.innerWidth <= 800) {
      this.tabOpen = false;
    }
  }

  getClassOf(item: BetHistoryData) {
    let cssClass = '';
    // if (item.betStatus == 'O') {
    //   cssClass = 'bg-[#FFC600]';
    // } 
    if (item.betStatus == 'L') {
      cssClass = 'bg-[#FF5353]';
    } 
    else if (item.betStatus == 'W') {
      cssClass = 'bg-[#4CAF50]';
    } 

    return cssClass;
    
  }

  removeItem(item: BetHistoryData) {
    this.loadData();
  }

  processHistoryData(betHistoryData: BetHistoryData[], isHistory = false){
    let splitData = [];
    let betData: BetHistoryData[] = [];
    let promoType = '';
    betHistoryData.forEach(data => {
      ++this.currentIndex;
      promoType = '';
      splitData = data.placedTimestamp.split("T");
      //console.log("split data", splitData)
      splitData = splitData[0].split("-");
      //data.formattedDate = splitData[2] + "/" + splitData[1];

      data.formattedDate = splitData[2] + "/" + splitData[1] + "/" + splitData[0];

      splitData = data.placedTimestamp.split("T");
      //console.log("split data", splitData)
      splitData = splitData[1].split(":");
      data.formattedTime = splitData[0] + ":" + splitData[1];

      if(data.potentialReturn && data.placeStake)
      data.totalOdds = data.potentialReturn / data.placeStake;
      data.availableCashoutAmount = 0;

      data.autoCashoutValue = data.potentialReturn;
      data.autoCashoutValueRange = data.potentialReturn;
      data.openBar= true;

      data.isHistory = isHistory;
      

      if(data.promoType !== null && data.promoType !== undefined)
        promoType = data.promoType.toUpperCase();

      data.promoType = promoType;
      data.isRunning = data.betLegs.some(betLeg => betLeg.currentlyLive == true)
      
      data.betLegs.forEach((bet, index) => {
        data.betLegs[index].events = bet.event.split(" v ");
        data.betLegs[index].fullResult = this.swithBetResult(bet.result);

        splitData = bet.anticipatedStartTime.split("T");
        splitData = splitData[0].split("-");
        data.betLegs[index].formattedDate = splitData[2] + "/" + splitData[1] + "/" + splitData[0];

        splitData = bet.anticipatedStartTime.split("T");
        splitData = splitData[1].split(":");
        data.betLegs[index].formattedTime = splitData[0] + ":" + splitData[1];
      })

      data.index = this.currentIndex;
      betData.push(data);
    })

    return betData;
    
  }

  appendTimezone(date, status = 'start'){
    if(status == 'start')
      return `${date}T00:00:00Z`;
    else
      return `${date}T23:59:59Z`;
  }

  swapOpen(selectedIndex){
    //alert(index)
    // let bet = this.betHistoryData[index];
    // bet.isOpen = !bet.isOpen;
    // this.betHistoryData[index] = bet;

    const index = this.betHistoryData.findIndex((element) => element.index === selectedIndex)

    this.betHistoryData[index].isOpen = !this.betHistoryData[index].isOpen;
    this.betHistoryData[index].openBar = !this.betHistoryData[index].openBar;
    this.betHistoryData[index].openAuto = !this.betHistoryData[index].openAuto;
    this.betHistoryData[index].openPartial = !this.betHistoryData[index].openPartial;

    this.betHistoryData[index].autoCoClicked = false;
    this.betHistoryData[index].partialCo = false;
    this.betHistoryData[index].partialCoClicked = false;

    if(this.betHistoryData[index].isOpen)
      this.betHistoryData[index].openBar = false;
    else
      this.betHistoryData[index].openBar = true;
  }

  swapTab(label){
    this.currentPage = 1;
    this.currentTab = label;
    this.canSearch = false;
    switch(label)
    {
      case "ALL":
        this.betHistoryData.length = 0;
        this.betHistoryData.push(...this.betDataSet);
        this.isBetHistory = true;
        this.isCashout = false;
        this.isLiveGame = false;
      break;

      case "SETTLED":
        this.betHistoryData.length = 0;
        this.betHistoryData = this.betDataSet.filter(data => {
          return data.betStatus == 'X' || data.betStatus == 'L' || data.betStatus == 'W'
        });

        this.isBetHistory = true;
        this.isCashout = false;
        this.isLiveGame = false;

      break;

      case "UNSETTLED":
        this.betHistoryData.length = 0;
        this.betHistoryData = this.betDataSet.filter(data => {
          return data.betStatus == 'O'
        });
        this.isBetHistory = true;
        this.isCashout = false;
        this.isLiveGame = false;
      break;

      case "CASHOUT":
        this.isBetHistory = false;
        this.isCashout = true;
        this.isLiveGame = false;
        this.canSearch = true;
        this.sharedService.filterSubject.next({startDate: this.startDate, endDate: this.endDate, canSearch: this.canSearch})
      break;

      case "IN-PLAY":
        this.betHistoryData.length = 0;
        this.betHistoryData = this.betDataSet.filter(data => {
          return data.betStatus == 'O' && data.betLegs.some(bet => bet.currentlyLive)
        });
        this.isBetHistory = false;
        this.isCashout = true;
        this.isLiveGame = true;
        this.canSearch = true;
        this.sharedService.filterSubject.next({startDate: this.startDate, endDate: this.endDate, canSearch: this.canSearch})
      break;

      default: 
        alert("Not Implemented")
      break;
    }
  }

  handleCashout(event) {
		console.log("CashoutEvent", event)

	}

  getToday(): string {
    // Get the current date in the format 'YYYY-MM-DD'
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  Filter(){

    if(this.currentTab === 'CASHOUT' || this.currentTab === 'IN-PLAY')
    {
      this.canSearch = true;
      this.sharedService.filterSubject.next({startDate: this.startDate, endDate: this.endDate, canSearch: this.canSearch})
    }
      
    else
      this.loadData();
  }

  swithBetResult(status){
    let response = '';
    switch(status)
    {
      case 'W':
        response = 'WON';
      break;

      case 'L':
        response = 'LOST';
      break;

      case 'O':
        response = 'OPEN';
      break;
    }

    return response;
  }

  handleStartDateChange(event) {
    this.startDate = this.formatDate(event.value);
  }

  handleEndDateChange(event) {
    this.endDate = this.formatDate(event.value);
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
          //  return dd + '/' + mm + '/' + yyyy;
                return yyyy + '-' + mm + '-' +dd ;
   
   }

   

   loadData(){

    //alert(this.MODE)

    this.betDataSet.length = 0;
    this.betHistoryData.length = 0;
    this.isDataLoaded = false;
    this.isLoading = true;

    

    combineLatest([
      this.betHistoryService.getBetHistory({
        "endDate": this.appendTimezone(this.endDate, 'end'),
        "language": "EN",
        "page": 1,
        "settlementStatus": "S",
        "size": this.dataSize,
        "startDate": this.appendTimezone(this.startDate)
      }),

      this.betHistoryService.getBetHistory({
        "endDate": this.appendTimezone(this.endDate, 'end'),
        "language": "EN",
        "page": 1,
        "settlementStatus": "U",
        "size": this.dataSize,
        "startDate": this.appendTimezone(this.startDate)
      }),
      this.betHistoryService.getBetHistoryV2({
        "username": localStorage.getItem("phone_number"),
        "start_date": '2022-11-28T00:00:00Z',
        "end_date": this.appendTimezone(this.endDate, 'end'),
      })
    ]).subscribe(data => { 
      console.log("Bet Data", data)
      let isHistory = false;
      data.forEach((item, index) => {
        if(item.bets)
        {
          //this.betDataSet = this.processHistoryData(item.bets);
          if(index == 2)
          isHistory = true;
          this.betHistoryData.push(...this.processHistoryData(item.bets, isHistory));
          
        }
        
      })
      this.betHistoryData.sort((a, b) => {
        var dateA = new Date(a.placedTimestamp).getTime();
        var dateB = new Date(b.placedTimestamp).getTime();

        // Compare the dates and return either -1, 0, or 1
        // depending on whether dateA is before, the same as,
        // or after dateB
        if (dateA < dateB) return 1;
        if (dateA > dateB) return -1;
        return 0
      });
      //this.betHistoryData.sort((a, b) => new Date(b.placedTimestamp).getTime() - new Date(a.placedTimestamp).getTime());
      this.betDataSet.push(...this.betHistoryData);
      this.swapTab("ALL");
      console.log("sortedbethistorydata", this.betHistoryData);
      this.isDataLoaded = true;
      this.isLoading = false;

      this.subscribeToCashoutOffer();
    })
   }

   public subscribeToCashoutOffer(): void {
    let header: StompHeaders = {};

    console.log("Subscribe Cashout")

    this.bettingService
      .upcomingGames(`user/cashoutoffer/`, header)

      .subscribe(
        (data: CashoutOffer) => {
        console.log('Cashout Data games', JSON.stringify(Object.keys(data)));
        console.log('Cashout Data pAYLOAD', JSON.stringify(data));
        this.betHistoryData.map(betHistory => {

          if(data[betHistory.betId] !== undefined && data[betHistory.betId] !== null && data[betHistory.betId])
          {
            betHistory.availableCashoutAmount = data[betHistory.betId]['cashoutOffer'];
            betHistory.cashoutStake = data[betHistory.betId]['cashedoutStake'];
            betHistory.cashedoutStake = data[betHistory.betId]['cashedoutStake'];
            // betHistory.autoCashoutValue = betHistory.availableCashoutAmount;
            // betHistory.autoCashoutValueRange = betHistory.availableCashoutAmount;

            betHistory.partialCashoutValue = betHistory.availableCashoutAmount;
            betHistory.partialCashoutValueRange = betHistory.availableCashoutAmount;
          }
            
        })

        // this.betHistoryData.sort(this.compare);
      }
      );
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
  
  
    let comparison = 0;
    if (a.availableCashoutAmount < b.availableCashoutAmount) {
      comparison = 1;
    } else if (a.availableCashoutAmount > b.availableCashoutAmount) {
      comparison = -1;
    }
    return comparison;
  }

  compareOpen(a, b) {
    // Use toUpperCase() to ignore character casing
  
  
    let comparison = 0;
    if (a.availableCashoutAmount < b.availableCashoutAmount) {
      comparison = 1;
    } else if (a.availableCashoutAmount > b.availableCashoutAmount) {
      comparison = -1;
    }
    return comparison;
  }

  compareLive(a, b) {
    // Use toUpperCase() to ignore character casing
  
  
    let comparison = 0;
    if (a.availableCashoutAmount < b.availableCashoutAmount) {
      comparison = 1;
    } else if (a.availableCashoutAmount > b.availableCashoutAmount) {
      comparison = -1;
    }
    return comparison;
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
    let monthlastdate = new Date(this.year,this. month, 0).getDate();
 
    // Variable to store the generated calendar HTML
    let lit = "";
 
    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit +=
            `<div class="calendar-day">${monthlastdate - i + 1}</div>`;
            this.calendarDates.push(monthlastdate - i + 1 );
            this.calendarDateLoaders.push({
              day: monthlastdate - i + 1,
              month: this.month - 1,
              year: this.year
            });
    }
 
    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
 
        // Check if the current date is today
        let isToday = i === this.date.getDate()
            && this.month === new Date().getMonth()
            && this.year === new Date().getFullYear()
            ? true
            : false;
        lit += `<div class="calendar-day active">${i}</div>`;
        this.calendarDates.push(i);

        this.calendarDateLoaders.push({
          day: i,
          month: this.month,
          year: this.year
        })

        if(isToday)
        this.selectDateMobile({
          day: i,
          month: this.month,
          year: this.year
        });
    }
 
    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<div class="calendar-day">${i - dayend + 1}</div>`
        this.calendarDates.push(i - dayend + 1);

        this.calendarDateLoaders.push({
          day: i - dayend + 1,
          month: this.month + 1,
          year: this.year
        })
    }
 
    // Update the text of the current date element 
    // with the formatted current month and year
    this.currdate = `${this.months[this.month]} ${this.year}`;

    console.log("Current Date Tracker", this.month, this.year);
 
    // update the HTML of the dates element 
    // with the generated calendar
    //this.cal = lit;
  }

  openModal(bet: BetLeg){

    console.log("Event Data",bet);
    //alert(bet.eventId)
    this.modalSubscribe = this.betttingService.upcomingGames(`events/${bet.eventId}`)
    // .pipe(takeUntil(this.notifier))
    .subscribe(data => 
      {
        console.log("Event-Data-Click",data);
        this.statData.next(data.externalId);

        this.notifier.next();
        this.notifier.complete();
      })
  
		
	}

  navigateTo(nav) {
    // Check if the icon is "calendar-prev"
        // or "calendar-next"

        console.log("Date Tracker before", this.month, this.year);
        this.month = nav === "previous" ? this.month - 1 : this.month + 1;
 
        // Check if the month is out of range
        if (this.month < 0 || this.month > 11) {
 
            // Set the date to the first day of the 
            // month with the new year
            this.date = new Date(this.year, this.month, new Date().getDate());
 
            // Set the year to the new year
            this.year = this.date.getFullYear();
 
            // Set the month to the new month
            this.month = this.date.getMonth();
        }
 
        else {
 
            // Set the date to the current date
            this.date = new Date();
        }

        console.log("Date Tracker", this.month, this.year);
 
        // Call the manipulate function to 
        // update the calendar display
        this.manipulate();
  }

  filterCustomDate() {
    this.showFilterModal = false;
    console.log("Date", this.startDate, this.endDate);
    this.loadData();
  }

  setLabel(label){
    switch(label)
    {
      case "FROM":
        this.dateSelectorEnum = DateSelectorEnum.START_DATE;
        this.isSelectedStartDate = true;
        this.isSelectedEndDate = false;
      break;

      case "TO":
        this.dateSelectorEnum = DateSelectorEnum.END_DATE;
        this.isSelectedStartDate = false;
        this.isSelectedEndDate = true;
      break;
    }
    //alert(this.dateSelectorEnum)
  }

  showModalFilter(state: boolean){
    this.showFilterModal = state;
    this.isSelectedStartDate = false;
    this.isSelectedEndDate = false;

    if(state)
      this.isSelectedStartDate = true;
  }

  filterBySettledState(state){
    // if(this.currentTab !== 'SETTLED')
    // return;
    console.log("state", state);
    switch(state)
    {
      case 'WIN':
        this.isSelectedWin = !this.isSelectedWin;
        break;

      case 'LOST':
        this.isSelectedLoss = !this.isSelectedLoss;
        break;
    }

    if(this.isSelectedWin && this.isSelectedLoss)
    {
      this.betHistoryData.length = 0;
      this.betHistoryData = this.betDataSet.filter(data => {
        return data.betStatus == 'L' || data.betStatus == 'W'
      });
    }
    else if(!this.isSelectedWin && this.isSelectedLoss)
    {
      this.betHistoryData.length = 0;
      this.betHistoryData = this.betDataSet.filter(data => {
        return data.betStatus == 'L'
      });
    }
    else if(this.isSelectedWin && !this.isSelectedLoss)
    {
      this.betHistoryData.length = 0;
      this.betHistoryData = this.betDataSet.filter(data => {
        return data.betStatus == 'W'
      });
    }
    else
    {
      this.betHistoryData.length = 0;
      this.betHistoryData.push(...this.betDataSet);
    }

    console.log("IsSelected Win", this.isSelectedWin);
    console.log("IsSelected Loss", this.isSelectedLoss);
  }

  goHome(){
    this.close.emit(true)
  }

  
}
