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
import { MyBetEnum } from './my-bet.enum';
import { DialogService } from '../shared/dialog.service';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-cashout-offer',
  standalone: true,
  templateUrl: './cashout-offer.component.html',
  styleUrls: ['./cashout-offer.component.css'],
  imports: [CommonModule, MatSliderModule]
})
export class CashoutOfferComponent {
  @Output()
  cashout: EventEmitter <BetHistoryData> = new EventEmitter <BetHistoryData> ();
  currentInnerTab: MyBetEnum = MyBetEnum.ALL;
  isOpen: boolean = false;
  showAutoCashout: boolean = false;
  showPartialCashout: boolean = false;
  // @Input() item: BetHistoryData;
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

  loaderMsg = "No Open Bet history available";

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
  currentTab = "ALL";
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

  private _selected: BetHistoryData = {};

  @Input()
  set item(value: BetHistoryData) {
    this._selected = value;
  }

  get item(): BetHistoryData {
    return this._selected;
  }

  @Input()
  set isMobileScreen(value: boolean) {
    this.isMobile = value;
  }

  get isMobileScreen(): boolean {
    return this.isMobile;
  }

  ngOnInit() {
 
    // this.authService.newToken(localStorage.getItem("fnc_accessToken"))

    // this.loadData();
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

    this.currentTime.setDate(this.currentTime.getDate() - 90);
    this.startDate = this.formatDate(this.currentTime);

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
    betHistoryData.forEach(data => {
      splitData = data.placedTimestamp.split("T");
      //console.log("split data", splitData)
      splitData = splitData[0].split("-");
      data.formattedDate = splitData[2] + "/" + splitData[1];

      splitData = data.placedTimestamp.split("T");
      //console.log("split data", splitData)
      splitData = splitData[1].split(":");
      data.formattedTime = splitData[0] + ":" + splitData[1];

      data.totalOdds = 0;
      data.availableCashoutAmount = 0;

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

  swapOpen(index) {
    this.item.isOpen = !this.item.isOpen;
    this.item.openBar = !this.item.openBar;
    this.item.openAuto = !this.item.openAuto;
    this.item.openPartial = !this.item.openPartial;

    this.item.autoCoClicked = false;
    this.item.partialCo = false;
    this.item.partialCoClicked = false;

    if(this.item.isOpen)
      this.item.openBar = false;
    else
      this.item.openBar = true;

  }

  changeRangeAuto( e) {
    //alert(e.target.value)
    this.item.autoCashoutValueRange = e.target.value;

    this.item.partialCashoutValue = this.item.autoCashoutValueRange;
    this.item.partialCashoutValueRange = this.item.autoCashoutValueRange;


    // this.range.setAttribute(
    //     'style',
    //     `background:linear-gradient(to right,${this.slider},${this.slider} ${e.target.value}%,${this.bg} ${e.target.value}%) `
    // )
  }

  changeRangePartial(e) {
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
    let betId = this.item.betId;
    let cashoutReturnTargetOC: number = this.item.partialCashoutValueRange;
    let whenReturnExceedsOC: number = this.item.autoCashoutValueRange;

    let req: CashoutRule = {
      betId,
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
    let cashoutReturn: number = this.item.partialCashoutValueRange
    let cashoutStake: number = (this.item.placeStake - this.item.cashedoutStake)* this.item.partialCashoutValueRange /this.item.availableCashoutAmount

    let data: CashoutReq = {
      betId,
      cashoutReturn,
      cashoutStake,
      fullCashout: false
    }

    console.log("Partial", data)

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
    let cashoutReturn: number = this.item.availableCashoutAmount;
    let cashoutStake: number = this.item.availableCashoutAmount;

    let data: CashoutReq = {
      betId,
      cashoutReturn,
      cashoutStake,
      fullCashout: true
    }

    console.log("Full Cashout", JSON.stringify(data))

    this.betHistoryService.performCashout(data).subscribe(
      //res =>
      {
        next: data => {
          console.log("Result", data);
          this.item.confirmFullCashout = false;
          this.toastr.success(`Cashout of amount ${cashoutReturn} processed successfully`);
          this.item.openBar = true;
          this.item.partialCo = false;
          this.item.partialCoClicked = false;
          this.item.autoCoClicked = false;

          this.betHistoryData = this.betHistoryData.filter( data => data.betId != betId);
          this.betDataSet = this.betDataSet.filter( data => data.betId != betId);

          this.item.isFullLoading = false;
          this.bettingService.betCheckOutCheck = true;
          this.removeItem(this.item)
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

        this.betHistoryData.sort(this.compare);
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
    if(this.item.betLegs.length) 
    {
      this.bettingService.generateBetbasketId();
      this.item.betLegs.map((eachMarket) => {
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

  @Output() removeItemEvent = new EventEmitter<BetHistoryData>();

  removeItem(value: BetHistoryData) {
    this.removeItemEvent.emit(value);
  }

}
