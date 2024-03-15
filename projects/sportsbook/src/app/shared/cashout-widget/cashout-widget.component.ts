import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { BetHistoryData, CashoutReq, CashoutRule } from '../bet-history/bet-history.data';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StompHeaders } from '@livedoc';
import { ToastrService } from 'ngx-toastr';
import { AuthFNCService } from '../../auth-fnc.service';
import { CashoutOffer } from '../../dto/cashout.offer.dto';
import { BettingService } from '../../services/betting-service';
import { LoaderService } from '../../services/loader.service';
import { BetHistoryService } from '../bet-history/bet-history.service';
import { DialogService } from '../shared/dialog.service';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-cashout-widget',
  standalone: true,
  templateUrl: './cashout-widget.component.html',
  styleUrls: ['./cashout-widget.component.css'],
  imports: [CommonModule, MatSliderModule]
})
export class CashoutWidgetComponent {
  isOpen: boolean = false;
  showAutoCashout: boolean = false;
  showPartialCashout: boolean = false;
  openBar = true;
  all = true;
  live = false;
  items = [1, 2, 3];
  isOpen2 = false;
  isOpen3 = false;
  cashOut = false;
  cashOut2 = false;
  showOptions = false;
  showNumberOptions2 = false;
  showFilterModal = false;
  autoCO: boolean = true;
  partialCO: boolean = true;
  showWinModal = false;
  CoUnavailable = false;
  odds = false;
  cash = false;
  autoCoClicked = false;
  partialCoClicked = false;
  cashoutReturnClicked = false;
  showBtnMobile: boolean = true;
  
  MODE = "PARTIAL";

  isMyBet = true;
  isBetHistory = false;

  loaderMsg = "No Cashout history available";

  bettingService = inject(BettingService);
  betHistoryService = inject(BetHistoryService)
  authService = inject(AuthFNCService);
  breakpointObserver = inject(BreakpointObserver);
  toastr = inject(ToastrService);
  dialogService = inject(DialogService);
  loaderService = inject(LoaderService);

  currentTime = new Date();

  
  startDate = "";
  endDate = this.formatDate(new Date());

  @Output()
  close: EventEmitter <boolean> = new EventEmitter <boolean> ();

  
  isDataLoaded: boolean = false;
  calendarDates: number[] = [];
  selectedDate: Date; 
  formattedDate: string;
  showOptions2 = false;
  showNumberOptions = false;
  mobileOpen = false;
 
  isLoading: boolean = false;

  isSelectedWin: boolean = false;
  isSelectedLoss: boolean = false;

  authToken: string;


  currdate: string;

  private _selected: BetHistoryData = {};

  @Input()
  set item(value: BetHistoryData) {
    this._selected = value;
  }

  get item(): BetHistoryData {
    return this._selected;
  }

  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth();
 
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
  isMobile: boolean;
  range: any;
  bg: '#FFC600';
  slider: string = '#FFFFFF';
  vall: number;

  constructor() {
    

  }

  

  ngOnInit() {
    //console.log("Init")
    
      
    this.authService.newToken(localStorage.getItem("fnc_accessToken"));

    
  }

  ngAfterViewInit(): void {
    this.isMobile = this.breakpointObserver.isMatched(Breakpoints.Handset);

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }

  closeDialog(){
    //this.dialogService.closeDialog()
    this.loaderService.toggleMyBetVisibility();
    
  }



  appendTimezone(date, status = 'start'){
    if(status == 'start')
      return `${date}T00:00:00Z`;
    else
      return `${date}T23:59:59Z`;
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

  livegame() {
    this.live = true;
    this.cash = false;
    this.all = false;
  }

  allBtn() {
    this.live = false;
    this.all = true;
    this.cash = false;
  }


  changeRangeAuto(e) {
    this.item.autoCashoutValueRange = e.target.value;

    this.item.partialCashoutValue = this.item.autoCashoutValueRange;
    this.item.partialCashoutValueRange = this.item.autoCashoutValueRange;

    
        // this.range.setAttribute(
        //     'style',
        //     `background:linear-gradient(to right,${this.slider},${this.slider} ${e.target.value}%,${this.bg} ${e.target.value}%) `
        // )
  }

  changeRangePartial( e) {
    //alert(e.target.value)
    this.item.partialCashoutValueRange = e.target.value;
  }

  onPartialCheckboxChange(e) {
    //alert(e.target.checked)
    this.item.partialReturnChecked = e.target.checked;
    this.item.partialCashoutValue = this.item.autoCashoutValueRange;
    this.item.partialCashoutValueRange = this.item.autoCashoutValueRange;
  }

  autoCo() {
    this.isOpen = false;
    this.autoCO = true;
    this.autoCoClicked = true;
    this.partialCoClicked = false;
    this.openBar = false;

    // this.item.partialCoClicked = false;
    // this.item.partialCo = true;
    this.item.autoCoClicked = !this.item.autoCoClicked;
    this.item.partialReturnChecked = false;
    this.item.partialCo = false;
    this.item.confirmFullCashout = false;
    this.item.openBar = false;
    //this.item.isOpen = true;

    this.showBtnMobile = false;
  }

  confirmAutoCashout() {
    this.item.confirmAutoCashout = !this.item.confirmAutoCashout;
  }

  doAutoCashout() {
    this.item.isAutoLoading = true;

    let cashoutReturnTargetOC: number = this.item.partialCashoutValueRange;
    let whenReturnExceedsOC: number = this.item.autoCashoutValueRange;

    let req: CashoutRule = {
      betId: this.item.betId,
      cashoutReturnTargetOC,
      whenReturnExceedsOC,
      allRemainingStake: this.item.partialReturnChecked ? false : true
    };
    this.betHistoryService.createCashoutRule(req).subscribe(
      {
        next: data => {
          console.log("Result", data);
          this.item.confirmAutoCashout = !this.item.confirmAutoCashout;
          this.toastr.success('Cashout Rule created successfully');
          this.item.openBar = true;
          this.item.autoCoClicked = false;
          this.item.autoCashoutRule = data;
          this.item.isAutoLoading = false;
      },
      error: error => {
          
        this.showErrorToast(error.error.message)
          console.error('There was an error!', error.error.message);
          this.item.isAutoLoading = false;
      }
    });
      
    
  }

  cancelAutoCashout() {
    this.item.confirmAutoCashout = false;
    this.item.openBar = true;
    this.item.autoCoClicked = false;
  }

  removeAutoCashout() {

    

    this.betHistoryService.getCashoutRule(this.item.betId).subscribe(
      {
        next: data => {
          console.log("Result", data);

          this.performRemoveRule(data.version);
        
      },
      error: error => {
          
        this.showErrorToast(error.error.message)
          console.error('There was an error!', error.error.message);
      }
    });
      
      
    
  }

  performRemoveRule(version) {
    this.betHistoryService.deleteCashoutRule(this.item.betId, version).subscribe(
      {
        next: data => {
          console.log("Result", data);
        this.toastr.success('Cashout Rule removed successfully');
        this.item.confirmAutoCashout = false;
        this.item.openBar = true;
        this.item.autoCoClicked = false;
        this.item.autoCashoutRule = null;
      },
      error: error => {
          
        this.toastr.error(error.error.message)
          console.error('There was an error!', error.error.message);
      }
    });
  }

  cashoutPartial() {

  }

  confirmPartialCashout() {
    this.item.confirmPartialCashout = !this.item.confirmPartialCashout;
    this.item.confirmFullCashout = false;
  }

  doPartialCashout() {
    let betId = this.item.betId;
    this.item.isPartialLoading = true;
    let cashoutReturn: number = this.item.partialCashoutValueRange;
    let cashoutStake: number = (this.item.placeStake - this.item.cashedoutStake)* this.item.partialCashoutValueRange /this.item.availableCashoutAmount

    let data: CashoutReq = {
      betId,
      cashoutReturn,
      cashoutStake,
      fullCashout: false
    }


    this.betHistoryService.performCashout(data).subscribe(
      {
        next: data => {
          console.log("Result", data);
        this.item.confirmPartialCashout = !this.item.confirmPartialCashout;
        this.toastr.success('Partial Cashout performed successfully');
        this.item.openBar = true;
        this.item.partialCo = false;
        this.item.partialCoClicked = false;
        this.item.isPartialLoading = false;
      },
      error: error => {
        this.item.isPartialLoading = false;
        this.toastr.error(error.error.message)
          console.error('There was an error!', error.error.message);
          this.cancelPartialCashout()
      }
    });
      
  }

  cancelPartialCashout() {
    this.item.confirmPartialCashout = false;
    this.item.openBar = true;
    this.item.partialCo = false;
    this.item.partialCoClicked = false;
  }

  doFullCashout() {

    this.item.isFullLoading = true;
    let betId = this.item.betId;
    const amt = this.item.availableCashoutAmount;
    let data: CashoutReq = {
      betId,
      cashoutReturn: amt,
      cashoutStake: amt,
      fullCashout: true
    }

    this.betHistoryService.performCashout(data).subscribe(
      //res =>
      {
        next: data => {
          console.log("Result", data);
          this.item.confirmFullCashout = false;
          this.toastr.success(`Cashout of amount ${amt} processed successfully`);
          this.item.openBar = true;
          this.item.partialCo = false;
          this.item.partialCoClicked = false;
          this.item.autoCoClicked = false;

          
          this.removeItem(this.item);
          this.item.isFullLoading = false;
          this.bettingService.betCheckOutCheck = true;
          
        },
        error: error => {
          this.item.isPartialLoading = false;
          this.toastr.error(error.error.message)
            console.error('There was an error!', error.error.message);
            this.cancelFullCashout()
            this.item.isFullLoading = false;
        }
      });
    
  }

  confirmFullCashout() {
    this.item.confirmFullCashout = true;
    this.item.confirmPartialCashout = false;
    this.item.autoCoClicked = false;
    this.item.partialCo = false;
    this.item.partialReturnChecked = false;
    this.item.partialCoClicked = false;
  }

  cancelFullCashout() {
    this.item.confirmFullCashout = false;
    this.item.partialReturnChecked = false;
    this.item.openBar = true;
    this.item.partialCo = false;
    this.item.partialCoClicked = false;
  }

  partialCo() {
    this.isOpen = false;
    this.partialCO = true;
    this.partialCoClicked = true;
    this.autoCoClicked = false;
    this.showBtnMobile = false;

    this.item.openBar = false;

    this.item.partialCoClicked = !this.item.partialCoClicked;
    this.item.partialCo = !this.item.partialCo;
    this.item.autoCoClicked = false;
    this.item.confirmFullCashout = false;
    //this.item.isOpen = true;
    this.item.autoCoClicked = false;
    this.item.partialCashoutValue = this.item.availableCashoutAmount;
    this.item.partialCashoutValueRange = this.item.availableCashoutAmount;
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

  loadMyBet(){
    this.isMyBet = true;
    this.isBetHistory = false;
  }

  loadBetHistory() {
    this.isMyBet = false;
    this.isBetHistory = true;
  }

  showSuccessToast(message: string) {
		this.toastr.error(message, 'Success', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}

  showErrorToast(message: string) {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}

  ngOnChanges(changes: SimpleChanges) {
    const {startDateQuery, endDateQuery, canSearch, currentTab } = changes;

    console.log("Changes", changes)
    
    // if (startDateQuery && endDateQuery && canSearch && currentTab) {
    //   {
    //     this.startDate = startDateQuery.currentValue;
    //     this.endDate = endDateQuery.currentValue;
    //     this.currentTab = currentTab.currentValue;
    //     this.loadData();
    //   }
      
    // }
  }

  @Output() removeItemEvent = new EventEmitter<BetHistoryData>();

  removeItem(value: BetHistoryData) {
    this.removeItemEvent.emit(value);
  }
}
