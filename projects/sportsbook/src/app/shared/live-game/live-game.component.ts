import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { StompHeaders } from '@livedoc';
import { BettingService } from '../../services/betting-service';
import { AuthFNCService } from '../../auth-fnc.service';
import { CashoutOffer } from '../../dto/cashout.offer.dto';
import { BetHistoryData, CashoutReq, CashoutRule } from '../bet-history/bet-history.data';
import { combineLatest } from 'rxjs';
import { BetHistoryService } from '../bet-history/bet-history.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { LiveGameEnum } from './live-game.enum';
import { DialogService } from '../shared/dialog.service';
import { LoaderService } from '../../services/loader.service';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { MatSlider, MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-live-game',
  standalone: true,
  templateUrl: './live-game.component.html',
  styleUrls: ['./live-game.component.css'],
  imports: [CommonModule, MatSliderModule]
})
export class LiveGameComponent {
  currentInnerTab: LiveGameEnum = LiveGameEnum.ALL;
  isOpen: boolean = false;
  showBonus = false;
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

  @Input() checkUpdate: string;
  
  isDataLoaded: boolean = false;
  calendarDates: number[] = [];
  selectedDate: Date; 
  formattedDate: string;
  showOptions2 = false;
  showNumberOptions = false;
  mobileOpen = false;
  betHistoryData?: BetHistoryData[] = [];
  betHistoryDataSorted?: BetHistoryData[] = [];
  betDataSet?: BetHistoryData[] = [];
  dataSize = 10;
  isSelectedStartDate: boolean = true;
  isSelectedEndDate: boolean = false;
  isLoading: boolean = false;

  isSelectedWin: boolean = false;
  isSelectedLoss: boolean = false;

  authToken: string;


  currdate: string;

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

    this.sharedService.filter$.subscribe(data => {
      console.log("SharedData", data)

      if(data)
      {
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.loadData();
      }
    })
    
    //this.loadData();

      //this.range = document.querySelector('#range')
      // this.bg = getComputedStyle(this.range).getPropertyValue('--background');
      // this.slider = getComputedStyle(this.range).getPropertyValue('--slider');
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

  loadCashout() {
    this.betHistoryData = this.betDataSet.filter(data => {
      return data.availableCashoutAmount > 0;
    });

    this.loaderMsg = "No Cashout available";

    this.cash = true; 
    this.live = false; 
    this.all = false
  }

  loadAll() {
    this.betHistoryData.length = 0;
    this.betHistoryData.push(...this.betDataSet);

    this.loaderMsg = "No Open Bet available";

    this.cash = false; 
    this.live = false; 
    this.all = true
  }

  loadLive() {
    this.betHistoryData = this.betDataSet.filter(data => {
      return data.betLegs.some(bet => bet.currentlyLive == true);
    });

    this.loaderMsg = "No Live bet available";

    this.cash = false; 
    this.live = true; 
    this.all = false
  }
  
  loadData(){

    this.betDataSet.length = 0;
    this.betHistoryData.length = 0;
    this.isDataLoaded = false;
    this.isLoading = true;

    // this.currentTime.setDate(this.startDateQuery.getDate());
    // this.startDate = this.formatDate(this.currentTime);
    // this.endDate = this.formatDate(this.endDateQuery);

    combineLatest([
      

      this.betHistoryService.getBetHistory({
        "endDate": this.appendTimezone(this.endDate, 'end'),
        "language": "EN",
        "page": 1,
        "settlementStatus": "U",
        "size": this.dataSize,
        "startDate": this.appendTimezone(this.startDate)
      })
    ]).subscribe(data => { 
      
      data.forEach(item => {
        if(item.bets)
        {
          //this.betDataSet = this.processHistoryData(item.bets);
          this.betHistoryData.push(...this.processHistoryData(item.bets));
          
        }
        
      })
      this.betDataSet.push(...this.betHistoryData);

      if(this.isLiveGame)
      {
        this.loaderMsg = "No Open Game available"
        this.betHistoryData = this.betDataSet.filter(data => {
          return data.betLegs.some(bet => bet.currentlyLive == true);
        });
      }
      
      //this.betHistoryData = this.betHistoryData.filter(betHistory => betHistory)

      //this.betHistoryDataSorted.push(...this.betHistoryData)

      // this.swapTab("ALL");
      console.log("dataLoader", this.betHistoryData);
      this.isDataLoaded = true;
      this.isLoading = false;

      this.subscribeToCashoutOffer();
    })
   }

   processHistoryData(betHistoryData: BetHistoryData[]){
    let splitData = [];
    let betData: BetHistoryData[] = [];
    let promoType = "";
    betHistoryData.forEach(data => {
      splitData = data.placedTimestamp.split("T");
      // console.log("split data", splitData)
      splitData = splitData[0].split("-");
      data.formattedDate = splitData[2] + "/" + splitData[1] + "/" + splitData[0];

      splitData = data.placedTimestamp.split("T");
      //console.log("split data", splitData)
      splitData = splitData[1].split(":");
      data.formattedTime = splitData[0] + ":" + splitData[1];

      data.totalOdds = 0;
      data.availableCashoutAmount = 0;

      if(data.promoType !== null && data.promoType !== undefined)
        promoType = data.promoType.toUpperCase();

      data.promoType = promoType;

      data.autoCashoutValue = data.potentialReturn;
      data.autoCashoutValueRange = data.potentialReturn;
      data.openBar= true;

      data.betLegs.forEach((bet, index) => {
        //console.log("Price", bet.price.decimal)
        data.totalOdds += bet.price.decimal
        data.betLegs[index].events = bet.event.split(" v ");
        data.betLegs[index].fullResult = this.swithBetResult(bet.result);

        splitData = bet.anticipatedStartTime.split("T");
        //console.log("split data", splitData)
        splitData = splitData[0].split("-");
        data.betLegs[index].formattedDate = splitData[2] + "/" + splitData[1];

        splitData = bet.anticipatedStartTime.split("T");
        //console.log("split data", splitData)
        splitData = splitData[1].split(":");
        data.betLegs[index].formattedTime = splitData[0] + ":" + splitData[1];
      })

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
           return dd + '/' + mm + '/' + yyyy;
                // return yyyy + '-' + mm + '-' +dd ;
   
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

  swapOpen(index) {
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

  changeRangeAuto(index: number, e) {
    this.betHistoryData[index].autoCashoutValueRange = e.target.value;

    this.betHistoryData[index].partialCashoutValue = this.betHistoryData[index].autoCashoutValueRange;
    this.betHistoryData[index].partialCashoutValueRange = this.betHistoryData[index].autoCashoutValueRange;

    
        // this.range.setAttribute(
        //     'style',
        //     `background:linear-gradient(to right,${this.slider},${this.slider} ${e.target.value}%,${this.bg} ${e.target.value}%) `
        // )
  }

  changeRangePartial(index: number, e) {
    //alert(e.target.value)
    this.betHistoryData[index].partialCashoutValueRange = e.target.value;
  }

  onPartialCheckboxChange(e, index) {
    //alert(e.target.checked)
    this.betHistoryData[index].partialReturnChecked = e.target.checked;
    this.betHistoryData[index].partialCashoutValue = this.betHistoryData[index].autoCashoutValueRange;
    this.betHistoryData[index].partialCashoutValueRange = this.betHistoryData[index].autoCashoutValueRange;
  }

  autoCo(index) {
    this.isOpen = false;
    this.autoCO = true;
    this.autoCoClicked = true;
    this.partialCoClicked = false;
    this.openBar = false;

    // this.betHistoryData[index].partialCoClicked = false;
    // this.betHistoryData[index].partialCo = true;
    this.betHistoryData[index].autoCoClicked = !this.betHistoryData[index].autoCoClicked;
    this.betHistoryData[index].partialReturnChecked = false;
    this.betHistoryData[index].partialCo = false;
    this.betHistoryData[index].confirmFullCashout = false;
    this.betHistoryData[index].openBar = false;
    //this.betHistoryData[index].isOpen = true;

    this.showBtnMobile = false;
  }

  confirmAutoCashout(index) {
    this.betHistoryData[index].confirmAutoCashout = !this.betHistoryData[index].confirmAutoCashout;
  }

  doAutoCashout(index) {
    this.betHistoryData[index].isAutoLoading = true;

    let req: CashoutRule = {
      betId: this.betHistoryData[index].betId,
      cashoutReturnTargetOC: this.betHistoryData[index].partialCashoutValueRange,
      whenReturnExceedsOC: this.betHistoryData[index].autoCashoutValueRange,
      allRemainingStake: this.betHistoryData[index].partialReturnChecked ? false : true
    };
    this.betHistoryService.createCashoutRule(req).subscribe(
      {
        next: data => {
          console.log("Result", data);
          this.betHistoryData[index].confirmAutoCashout = !this.betHistoryData[index].confirmAutoCashout;
          this.toastr.success('Cashout Rule created successfully');
          this.betHistoryData[index].openBar = true;
          this.betHistoryData[index].autoCoClicked = false;
          this.betHistoryData[index].autoCashoutRule = data;
          this.betHistoryData[index].isAutoLoading = false;
      },
      error: error => {
          
        this.showErrorToast(error.error.message)
          console.error('There was an error!', error.error.message);
          this.betHistoryData[index].isAutoLoading = false;
      }
    });
      
    
  }

  cancelAutoCashout(index) {
    this.betHistoryData[index].confirmAutoCashout = false;
    this.betHistoryData[index].openBar = true;
    this.betHistoryData[index].autoCoClicked = false;
  }

  removeAutoCashout(index) {

    

    this.betHistoryService.getCashoutRule(this.betHistoryData[index].betId).subscribe(
      {
        next: data => {
          console.log("Result", data);

          this.performRemoveRule(index, data.version);
        
      },
      error: error => {
          
        this.showErrorToast(error.error.message)
          console.error('There was an error!', error.error.message);
      }
    });
      
      
    
  }

  performRemoveRule(index, version) {
    this.betHistoryService.deleteCashoutRule(this.betHistoryData[index].betId, version).subscribe(
      {
        next: data => {
          console.log("Result", data);
        this.toastr.success('Cashout Rule removed successfully');
        this.betHistoryData[index].confirmAutoCashout = false;
        this.betHistoryData[index].openBar = true;
        this.betHistoryData[index].autoCoClicked = false;
        this.betHistoryData[index].autoCashoutRule = null;
      },
      error: error => {
          
        this.toastr.error(error.error.message)
          console.error('There was an error!', error.error.message);
      }
    });
  }

  cashoutPartial(index) {

  }

  confirmPartialCashout(index) {
    this.betHistoryData[index].confirmPartialCashout = !this.betHistoryData[index].confirmPartialCashout;
    this.betHistoryData[index].confirmFullCashout = false;
  }

  doPartialCashout(index) {
    let selectedBetId = this.betHistoryData[index].betId;
    this.betHistoryData[index].isPartialLoading = true;
    let data: CashoutReq = {
      betId: this.betHistoryData[index].betId,
      cashoutReturn: this.betHistoryData[index].partialCashoutValueRange,
      cashoutStake:  (this.betHistoryData[index].totalStake - this.betHistoryData[index].cashedoutStake)* this.betHistoryData[index].partialCashoutValueRange /this.betHistoryData[index].availableCashoutAmount ,
      //cashoutStake: this.betHistoryData[index].cashoutStake,
      fullCashout: false
    }

    // (this.betHistoryData[index].totalStake - this.betHistoryData[index].cashedoutStake)* this.betHistoryData[index].partialCashoutValueRange /this.betHistoryData[index].availableCashoutAmount

  console.log("Partial", data)

    this.betHistoryService.performCashout(data).subscribe(
      {
        next: data => {
          console.log("Result", data);
        this.betHistoryData[index].confirmPartialCashout = !this.betHistoryData[index].confirmPartialCashout;
        this.toastr.success('Partial Cashout performed successfully');
        this.betHistoryData[index].openBar = true;
        this.betHistoryData[index].partialCo = false;
        this.betHistoryData[index].partialCoClicked = false;
        this.betHistoryData[index].isPartialLoading = false;
      },
      error: error => {
        this.betHistoryData[index].isPartialLoading = false;
        this.toastr.error(error.error.message)
          console.error('There was an error!', error.error.message);
          this.cancelPartialCashout(index)
      }
    });
      
  }

  cancelPartialCashout(index) {
    this.betHistoryData[index].confirmPartialCashout = false;
    this.betHistoryData[index].openBar = true;
    this.betHistoryData[index].partialCo = false;
    this.betHistoryData[index].partialCoClicked = false;
  }

  doFullCashout(index) {

    this.betHistoryData[index].isFullLoading = true;
    let selectedBetId = this.betHistoryData[index].betId;
    let data: CashoutReq = {
      betId: this.betHistoryData[index].betId,
      cashoutReturn: this.betHistoryData[index].availableCashoutAmount,
      cashoutStake: this.betHistoryData[index].availableCashoutAmount,
      fullCashout: true
    }

    console.log("Full Cashout", data)

    this.betHistoryService.performCashout(data).subscribe(
      //res =>
      {
        next: data => {
          console.log("Result", data);
          this.betHistoryData[index].confirmFullCashout = false;
          this.toastr.success(`Cashout of amount ${this.betHistoryData[index].availableCashoutAmount} processed successfully`);
          this.betHistoryData[index].openBar = true;
          this.betHistoryData[index].partialCo = false;
          this.betHistoryData[index].partialCoClicked = false;
          this.betHistoryData[index].autoCoClicked = false;

          this.betHistoryData = this.betHistoryData.filter( data => data.betId != selectedBetId);
          this.betDataSet = this.betDataSet.filter( data => data.betId != selectedBetId);

          this.betHistoryData[index].isFullLoading = false;
        },
        error: error => {
          this.betHistoryData[index].isPartialLoading = false;
          this.toastr.error(error.error.message)
            console.error('There was an error!', error.error.message);
            this.cancelFullCashout(index)
            this.betHistoryData[index].isFullLoading = false;
        }
      });
    
  }

  confirmFullCashout(index) {
    this.betHistoryData[index].confirmFullCashout = true;
    this.betHistoryData[index].confirmPartialCashout = false;
    this.betHistoryData[index].autoCoClicked = false;
    this.betHistoryData[index].partialCo = false;
    this.betHistoryData[index].partialReturnChecked = false;
    this.betHistoryData[index].partialCoClicked = false;
  }

  cancelFullCashout(index) {
    this.betHistoryData[index].confirmFullCashout = false;
    this.betHistoryData[index].partialReturnChecked = false;
    this.betHistoryData[index].openBar = true;
    this.betHistoryData[index].partialCo = false;
    this.betHistoryData[index].partialCoClicked = false;
  }

  partialCo(index) {
    this.isOpen = false;
    this.partialCO = true;
    this.partialCoClicked = true;
    this.autoCoClicked = false;
    this.showBtnMobile = false;

    this.betHistoryData[index].openBar = false;

    this.betHistoryData[index].partialCoClicked = !this.betHistoryData[index].partialCoClicked;
    this.betHistoryData[index].partialCo = !this.betHistoryData[index].partialCo;
    this.betHistoryData[index].autoCoClicked = false;
    this.betHistoryData[index].confirmFullCashout = false;
    //this.betHistoryData[index].isOpen = true;
    this.betHistoryData[index].autoCoClicked = false;
    this.betHistoryData[index].partialCashoutValue = this.betHistoryData[index].availableCashoutAmount;
    this.betHistoryData[index].partialCashoutValueRange = this.betHistoryData[index].availableCashoutAmount;
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

        this.betHistoryData.sort(this.compare)
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

  rebet(index: number){
    //this.bettingService.setMyBetRebet({})
    if(this.betHistoryData[index].betLegs.length) 
    {
      this.bettingService.generateBetbasketId();
      this.betHistoryData[index].betLegs.map((eachMarket) => {
        const newSub = this.bettingService
        .getMarkets(`markets/${eachMarket.marketId}`)
        .subscribe({
          next: (data) => {
              console.log("Market Data", data)
              data.selections[0][0].isSelected = true;
              data.selections[0][0].marketId = data.selections[0][0].id;
              this.bettingService.betBasketAdd(data.selections[0][0]);
              
            
          },
          error: (e) => { },
          complete: () => { },
        });
        
      });
    } 
    
  }

  @Input() startDateQuery: string;
  @Input() endDateQuery: string;
  @Input() canSearch: boolean;
  @Input() isLiveGame: boolean;
  @Input() currentTab: string;

  sharedService = inject(SharedService);

  


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
  
}
