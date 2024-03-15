/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable require-jsdoc */
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { BettingService } from '../../../services/betting-service';
import { Selection } from '../../../dto/odd-data.dto';
import { BETSLIP_TAB } from '../../../util/enum';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../../util/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, Subscription } from 'rxjs';

import { environment } from 'projects/sportsbook/src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import('preline');
import { LoaderService } from '../../../services/loader.service';
import { UserBalanceService } from '../../header/header/balance.service';
import { SharedService } from '../../sports-book/sports/shared.service';
import { ToastrService } from 'ngx-toastr';
import * as domtoimage from 'dom-to-image';
import { Router } from '@angular/router';

export interface BetBasketResponse {
  brandId: string;
  currency: string;
  id: string;
  playerId: string;
  potReturn: string;
  singles: any; // Change 'any' to the correct type if 'singles' has a specific structure
  stake: string;
  status: string;
  updatedAt: string;
}

@Component({
  selector: 'app-bet-slip-desktop',
  templateUrl: './bet-slip-desktop.component.html',
  styleUrls: ['./bet-slip-desktop.component.css'],
})
export class BetSlipDesktopComponent implements OnInit {
  selections: Selection[] = [];
  @ViewChild('accStakeInput') accStakeInput: ElementRef;

  @Output() hideBetSlip = new EventEmitter();
  tab: string = 'Single';
  betslipTab: BETSLIP_TAB = BETSLIP_TAB.SINGLE;
  betSlip: Selection[] = [];
  betSlipLoader: Selection[] = [];
  totalOdds: number = 0;
  singleBetslipForm: FormGroup;
  firstTab: string = 'Open Bets(0)';
  _localStorageService = inject(LocalStorageService);
  isLoggedIn: boolean = false;
  betShow: boolean = true;
  stakeAmount = 0;
  stakeAmountSingle = 0;
  stakeAmountCombi: number[] = [];
  potentialWinning: any = 0;
  thirdTab: string = 'Betslip';
  allowOddChanges: boolean = false;
  oddChangePlaceBet: boolean = false;
  oddShowMsg: boolean = false;
  authWait: boolean = false;
  isModalVisible: boolean = false;
  betSlipData: any;
  betSlipCode: string = '';
  optionsSet: string[] = [];
  categorizedCombinations: { label: string; combinations: string[][] }[] = [];
  totalStakeAmount: number = 0;
  multipliedValues: number[] = [];
  totalNumberEvents: number = 0;
  private inputValues: { value: number; length: number }[] = [];

  responseData: any;
  accaApiResoponse: any;
  betBasketId: any;
  totalStakeAcca: number = 0;
  totalOddsCalculate: any;
  totalpotentialCombi: number = 0;
  totalpotentialSingle: number = 0;
  totalpotentialAcca: number = 0;
  showBets: boolean = false;
  private unsubscribeAll = new Subject<void>();
  marketId: any;
  marketsFeedLink: any;
  betSelectionData: any;
  betbasketLink: string = 'user/betbasket/';
  betSlipButtonText: string = 'Place Bet';
  betPlacedResponse: any;
  betplaceModal: boolean = false;
  activeButton: string = 'Single';
  betplaceinProcess: boolean = false;
  private debounceTimer: any;
  private subscription: Subscription;
  rejectedBets: any[] = [];
  placedBets: any[] = [];
  placedBetsMultiple: any[] = [];
  rejectedBetsMultiple: any[] = [];
  betReOfferedSingle: any[] = [];
  betReOfferedMultiple: any[] = [];
  isPriceIncreased: boolean = false;
  isPriceDecreased: boolean = false;
  betSuspended: boolean = false;
  combiNotAvail: boolean = false;
  stakeNotAvailSingle: boolean = true;
  stakeNotAvail: boolean = true;
  bookingCode: any;
  bookingCodeInput: string = '';
  bookingCodeUrl: string;
  hideDoneButton: boolean = false;

  headers = new HttpHeaders({
    accept: 'application/x.finbet.competitions+json',
    'Content-Type': 'application/x.finbet.sport.id+json',
  });

  headersLogged = new HttpHeaders({
    accept: 'application/x.finbet.competitions+json',
    'Content-Type': 'application/x.finbet.sport.id+json',
    Authorization: `Bearer ${localStorage.getItem('fnc_accessToken')}`,
  });
  betsDataStatus: any;
  accaTotalOdds: any;
  combiBetsData: any[] = [];
  totalStakeSingle: number = 0;
  totalStakeCombi: number = 0;
  buttonText = '';
  teamName = '';
  team: string = '';
  secondTeam: string = '';
  router: any;
  showArrow: boolean = false;
  priceChanged: boolean = false;
  activeTab: string = "Single";
  combiAccaItem: any;
  activeButtonTab: string;
  reofferSingle: any;
  reofferMultiple: any[] = [];
  mismatchedSingles: any;
  betsPriceData: any[];
  freeBetData: any;
  isFeebetvisible: boolean[] = [];
  reofferMultipleArray: any[] = [];
  private betBasketSubscription: Subscription;
  isMismatch: any;
  minimumStake: boolean = false;


  constructor(
    private bettingService: BettingService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private balance: UserBalanceService,
    private loaderService: LoaderService,
    private location: Location,
    private toastr: ToastrService,
    private el: ElementRef,
    private route: Router,
    private renderer: Renderer2
  ) {
    this.singleBetslipForm = this.fb.group({
      betslipItems: this.fb.array([]),
    });
    this.bettingService.getResponseData().subscribe((data) => {
      this.responseData = data;
      if (this.responseData == undefined) {
        this.responseData = [];
        this.showBets = false;
        return;
      }
      this.showBets = true;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  isVisible: boolean = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  onBetslipClick() {
    this.loaderService.toggleVisibility();
    this.renderer.removeClass(document.body, 'betSlipActive');
  }

  ngOnInit(): void {
    this.sharedService.buttonText$.subscribe(
      (text) => (this.buttonText = text)
    );
    this.sharedService.teamName$.subscribe((name) => (this.teamName = name));
    this.sharedService.team$.subscribe((team) => (this.team = team));
    this.sharedService.secondTeam$.subscribe(
      (secondTeam) => (this.secondTeam = secondTeam)
    );

    let betSlipLoader: Selection[] = [];
    this.betSlip = betSlipLoader;
    if (localStorage.getItem('fnc_accessToken')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
    const betBasketId = localStorage.getItem('betBasketId');

    // this.bettingService.generateBetbasketId();
    this.bettingService.betBasketId$.subscribe((betBasketId) => {
      if (betBasketId) {
        this.subscribeToBetBasket();
      }
    });

    const pageUrl = window.location.href;
    const urlParts = pageUrl.split('/');
    const bookingCodeIndex = urlParts.findIndex(part => part.startsWith('bookingcode-'));
    if (bookingCodeIndex !== -1) {
      this.bookingCodeInput = urlParts[bookingCodeIndex].substring('bookingcode-'.length);
      this.getBetslipBookingCode();
    }
    if (localStorage.getItem('fnc_accessToken')) {
      this.generateBetbasketId();
    }
    if (!localStorage.getItem('fnc_accessToken') && !sessionStorage.getItem('betBasketId')) {
      this.generateNewBasketId();
    }else{
      if (betBasketId) {
        this.subscribeToBetBasket();
      }
    }

    this.bettingService.loginStatus$.subscribe((status) => {
      if (localStorage.getItem('fnc_accessToken')) {
        this.generateBetbasketId();
      }
      if (!localStorage.getItem('fnc_accessToken')) {
        this.generateNewBasketId();
      }
    });
  }

  generateBookingCode() {
    this.betplaceinProcess = true;
    this.captureBetbasket();

    const betBasketId = localStorage.getItem('betBasketId');
    const endpoint = '/betbasket/' + betBasketId + '/generatecode';
    const headers = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.sharedService.getHeaders();
    const payload = {};

    this.httpClient.post(endpoint, payload, { headers })
      .subscribe(
        (response: any) => {
          this.bookingCode = response.bookingCode;

          if (this.bookingCode) {
            this.isModalVisible = true;
            this.betplaceinProcess = false;
            this.bookingCodeUrl = window.location.href + '/bookingcode-' + this.bookingCode;
            // console.log('this.bookingCodeUrl', this.bookingCodeUrl);
          } else {
            this.isModalVisible = false;
          }
        },
        (error) => {
          console.error('betbasketId:', error);
        }
      );
  }

  getBetslipBookingCode() {
    const betBasketId = localStorage.getItem('betBasketId');
    const endpoint = '/betbasket/' + betBasketId + '/code/' + this.bookingCodeInput;
    const headers = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.sharedService.getHeaders();

    this.httpClient.get(endpoint, { headers })
      .subscribe(
        (response: any) => {
          // Handle the response as needed
          this.bookingCodeInput = '';
        },
        (error) => {
          console.error('betbasketId:', error);
        }
      );
  }

  closeModal() {
    this.isModalVisible = false;
  }

  onStakeChangeSingle(singleId: number, id: string, event: KeyboardEvent) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  
    this.debounceTimer = setTimeout(() => {
      const stake = parseFloat((event.target as HTMLInputElement).value);
      const payload = {
        stake: stake,
      };
  
      const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
      this.httpClient
        .put(
          environment.liveDocLocal + 'betbasket/' + id + '/single/' + singleId,
          payload,
          { headers: headersToUse }
        )
        .subscribe(
          (response) => {
            this.responseData = response;
            this.potentialWinSingle();
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }, 500);
  }

  onStakeChangeCombi(id: string, betType: string, event: KeyboardEvent) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  
    this.debounceTimer = setTimeout(() => {
      const stake = parseFloat((event.target as HTMLInputElement).value);
      const payload = {
        stake: stake,
      };
  
      const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
      this.httpClient
        .put(
          environment.liveDocLocal + 'betbasket/' + id + '/single/' + betType,
          payload,
          { headers: headersToUse }
        )
        .subscribe(
          (response) => {
            this.responseData = response;
            this.potentialWinCombi();
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }, 500);
  }

  onStakeChangeAcca(id: string, betType: string, event: Event) {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  
    this.debounceTimer = setTimeout(() => {
      const stake = parseFloat((event.target as HTMLInputElement).value);
      const payload = {
        stake: stake,
      };
  
      if (this.responseData.singles.length > 0) {
        this.totalpotentialAcca = this.totalOddsCalculate * stake;
      }
  
      const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
      this.httpClient
        .put(
          environment.liveDocLocal + 'betbasket/' + id + '/single/' + betType,
          payload,
          { headers: headersToUse }
        )
        .subscribe(
          (response) => {
            this.responseData = response;
            this.potentialWinCombi();
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }, 500);
  }

  removeGameBetbasket(singleId: number, id: string) {
    localStorage.setItem('changeTab', 'false');
    const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
    this.httpClient
      .delete('/betbasket/' + id + '/single/' + singleId, {
        headers: headersToUse,
      })
      .subscribe(
        (response) => {
          this.responseData = response;
          if (
            this.responseData.singles == null ||
            this.responseData.singles == undefined
          ) {
            this.responseData = [];
            this.showBets = false;
            return;
          }
          this.showBets = true;
        },
        (error) => {
          console.error('delete error:', error);
        }
      );
  }
  
  removeAllGameBetbasket() {
    this.activeButtonTab = '';
    const basketID = localStorage.getItem('betBasketId');
    const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
    this.httpClient
      .delete('/betbasket/' + basketID + '/single', {
        headers: headersToUse,
      })
      .subscribe(
        (response) => {
          this.responseData = response;
          if (
            this.responseData.singles == null ||
            this.responseData.singles == undefined
          ) {
            this.responseData = [];
            this.showBets = false;
          } else {
            this.showBets = true;
          }
        },
        (error) => {
          console.error('delete error:', error);
        }
      );
  }
  
  totalOddsCalc() {
    const singles = this.responseData.singles;
    let totalOdds = 1;
    singles.forEach((item) => {
      const decValue = parseFloat(item.price.dec);
      totalOdds *= decValue;
    });
    this.totalOddsCalculate = parseFloat(totalOdds.toFixed(2));
  }

  potentialWinSingle() {
    const singles = this.responseData.singles;
    let totalpotentialSingle = 0;
    singles.forEach((item) => {
      const potValue = parseFloat(item.potReturn);
      totalpotentialSingle += potValue;
    });
    this.totalpotentialSingle = totalpotentialSingle;
  }

  potentialWinCombi() {
    const multiples = this.responseData.multiples;
    let totalpotentialCombi = 0;
    multiples.forEach((item) => {
      const potValue = parseFloat(item.potReturn);
      totalpotentialCombi += potValue;
    });
    this.totalpotentialCombi = totalpotentialCombi;
  }

  get betslips(): FormArray {
    return this.singleBetslipForm.get('betslipItems') as FormArray;
  }

  onThirdTabClick(tab: string) {
    this.thirdTab = tab;
    if (this.thirdTab === 'Betslip') {
      this.betShow = true;
    }
    if (this.thirdTab === 'Cashout') {
      this.betShow = false;
    }
  }

  setStakeAmount(amount: number) {
    const currentTotalStake = parseInt(this.accaTotalOdds.totalStake, 10);
    const newTotalStake = currentTotalStake + amount;
    this.accaTotalOdds.totalStake = newTotalStake.toString();
    const event = new Event('keyup');
    this.accStakeInput.nativeElement.dispatchEvent(event);
  }

  copyText(value: string) {
    this.copyToClipboard(value);
    this.bookingCodeCoiped();
  }

  copyToClipboard(value: string) {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  captureBetbasket() {
    const divsToExclude = document.querySelectorAll('.remove_capture');

    // Hide the divs you want to exclude
    divsToExclude.forEach((div) => {
      const htmlElement = div as HTMLElement;
      htmlElement.style.display = 'none';
    });

    const element = document.querySelector('.bets_area') as HTMLElement;

    const options = {
      filter: (node: Node) => {
        // Cast Node to Element and exclude elements with the "exclude_capture" class
        return (node as Element).classList ? !(node as Element).classList.contains('exclude_capture') : true;
      },
      width: element.offsetWidth,
      height: element.offsetHeight,
    };

    domtoimage.toPng(element, options)
      .then((dataUrl) => {
        const image = new Image();
        image.src = dataUrl;

        const abcDiv = document.querySelector('.bet-slip_img .img_area') as HTMLElement;
        abcDiv.innerHTML = '';
        abcDiv.appendChild(image);

        divsToExclude.forEach((div) => {
          const htmlElement = div as HTMLElement;
          htmlElement.style.display = ''; // Set to an empty string to revert to the default display value
        });
      })
      .catch((error) => {
        console.error('Error capturing and updating content:', error);
      });
  }

  downloadDivContent() {
    const element = document.querySelector('.booking_modal_inner') as HTMLElement;

    const options = {
      filter: (node: Node) => {
        // Exclude elements with the "exclude_capture" class
        if (node instanceof Element) {
          return !node.classList.contains('exclude_capture');
        }
        return true;
      },
      width: element.scrollWidth,
      height: element.scrollHeight,
    };

    domtoimage.toPng(element, options)
      .then((dataUrl) => {
        const blob = this.dataURLtoBlob(dataUrl);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'betSlip.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing and downloading content:', error);
      });
  }

  dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  sharePage(): void {
    const origin = window.location.origin;
    const shareUrl = `${origin}/sports-book/football/bookingcode-${this.bookingCode}`;
    this.copyToClipboard(shareUrl);
    this.bookingLinkCopied();
  }

  public subscribeToBetBasket(): void {
    const betTypesMapping = {
      SINGLES: 'Singles',
      DOUBLES: 'Doubles',
      TREBLES: 'Trebles',
      FOURFOLDS: '4 Folds',
      FIVEFOLDS: '5 Folds',
      SIXFOLDS: '6 Folds',
      SEVENFOLDS: '7 Folds',
      EIGHTFOLDS: '8 Folds',
      NINEFOLDS: '9 Folds',
      '10FOLDS': '10 Folds',
      '11FOLDS': '11 Folds',
      '12FOLDS': '12 Folds',
      '13FOLDS': '13 Folds',
      '14FOLDS': '14 Folds',
      '15FOLDS': '15 Folds',
      '16FOLDS': '16 Folds',
      '17FOLDS': '17 Folds',
      '18FOLDS': '18 Folds',
      '19FOLDS': '19 Folds',
      '20FOLDS': '20 Folds',
    };

    if (this.betBasketSubscription) {
      this.betBasketSubscription.unsubscribe();
    }

    const betBasketIdLocal = localStorage.getItem('betBasketId');
    this.betBasketSubscription = this.bettingService
      .getBetBasket(`${this.betbasketLink}${betBasketIdLocal}`)
      .subscribe(
        (data) => {
          this.betSlipButtonText = 'Place Bet';
          this.betsDataStatus = data;
          this.responseData = data;
          console.log('this.responseData', this.responseData);


          if (this.responseData.singles) {
            this.reofferSingle = this.responseData.singles.find(
              (single) => single.status === 'REOFFER'
            );
            if (this.reofferSingle && this.reofferSingle.length == 1) {
              this.hideDoneButton = true;
            } else {
              this.hideDoneButton = false;
            }

            this.responseData.singles = this.responseData.singles.map(
              (single) => {
                if (single.selections) {
                  single.selections = single.selections.map((selection) => {
                    return {
                      ...selection,
                      eventId: single.eventId,
                      isSelected: true,
                    };
                  });
                }

                single.priceIncreased = single.price.dec > single.selections[0].price.dec;
                single.priceDecreased = single.price.dec < single.selections[0].price.dec;


                const oldPrice = single.selections[0].price.dec;
                const newPrice = single.price.dec;
                single.priceIncreased = newPrice < oldPrice;
                single.priceDecreased = newPrice > oldPrice;

                this.resetArrowVisibility();

                if (single.priceIncreased || single.priceDecreased) {
                  this.priceChanged = true;
                  this.resetArrowVisibility();
                }

                if (single.rewards) {
                  single.rewards = single.rewards.filter((reward: any) => reward.type !== 'BONUS');
                }

                return { ...single, isSelected: true };
              }
            );

            // single stake
            let totalStake = 0;
            this.responseData.singles.forEach((single) => {
              const parsedStake = parseFloat(single.stake);
              if (!isNaN(parsedStake)) {
                totalStake += parsedStake;
              } else {
                console.warn('Invalid stake value for single:', single);
              }
            });
            this.totalStakeSingle = totalStake;

            const isAnySuspended = this.responseData.singles.some(
              (single) => single.status === 'SUSPENDED'
            );
            this.betSuspended = isAnySuspended;

            const isAnyCombiNotPossible = this.responseData.singles.some(
              (single) => single.interrelated != null
            );

            this.combiNotAvail = isAnyCombiNotPossible

            const isSingleStakeNotZero = this.responseData.singles.some(
              (single) => parseFloat(single.stake) !== 0
            );
            this.stakeNotAvailSingle = !(isSingleStakeNotZero);

            if (this.responseData.singles) {
              this.mismatchedSingles = this.responseData.singles.filter(
                (single) => single.price.dec !== single.selections[0].price.dec
              );
            }

            if (this.mismatchedSingles) {
              const priceChangePayload = [];
              for (const single of this.mismatchedSingles) {
                const payloadItem = {
                  id: single.singleId,
                  old: {
                    price: {
                      up: single.price.up,
                      down: single.price.down,
                      dec: single.price.dec,
                    },
                    side: single.side,
                    line: single.line,
                  },
                  new: {
                    price: {
                      up: single.selections[0].price.up,
                      down: single.selections[0].price.down,
                      dec: single.selections[0].price.dec,
                    },
                    side: single.selections[0].side,
                    line: single.selections[0].line,
                  },
                };
                priceChangePayload.push(payloadItem);
              }
              this.betsPriceData = priceChangePayload
            }
            if (this.responseData.singles.reward) {
              const filteredSingles = this.responseData.singles.filter((single: any) => {
                return !single.rewards.some((reward: any) => reward.type === 'BONUS');
              });
              // console.log('filteredSingles', filteredSingles);
            }
          }

          if (this.responseData.multiples) {
            this.reofferMultiple = this.responseData.multiples.find(
              (multiple) => multiple.status === 'REOFFER'
            );
 
            // Convert this.reofferMultiple into an array if it's not already
            if (this.reofferMultiple) {
              this.reofferMultipleArray = [this.reofferMultiple];
            } else {
              this.reofferMultipleArray = [];
            }


            this.potentialWinCombi();
            const multipleWithOneBet = this.responseData.multiples.find(
              (multiple) => multiple.numberOfBets === 1
            );

            if (multipleWithOneBet) {
              this.accaTotalOdds = multipleWithOneBet;
            }

            // combi
            const betTypesToFilter = Object.keys(betTypesMapping);
            const filteredMultiples = this.responseData.multiples.filter(
              (multiple) => betTypesToFilter.includes(multiple.betType)
            );
            if (filteredMultiples.length > 0) {
              this.combiBetsData = filteredMultiples.map((multiple) => ({
                ...multiple,
                customBetType: betTypesMapping[multiple.betType],
              }));

              if (multipleWithOneBet) {
                this.combiBetsData.push({
                  ...multipleWithOneBet,
                  customBetType: this.accaTotalOdds.betType, // Customize as needed
                });
                // console.log('this.combiBetsData', this.combiBetsData);

              }

            } else {
              this.combiBetsData = [];
            }

            let totalCombiStake = 0;
            this.responseData.multiples.forEach((multiples) => {
              const parsedStakeCombi = parseFloat(multiples.totalStake);
              if (!isNaN(parsedStakeCombi)) {
                totalCombiStake += parsedStakeCombi;
              } else {
                console.warn('Invalid stake value for multiples:', multiples);
              }
              if (multiples.rewards) {
                multiples.rewards = multiples.rewards.filter((reward: any) => reward.type !== 'BONUS');
              }
            });
            this.totalStakeCombi = totalCombiStake;

            const isMultipleStakeNotZero = this.responseData.multiples.some(
              (multiple) => parseFloat(multiple.totalStake) !== 0
            );

            this.stakeNotAvail = !(isMultipleStakeNotZero);
          } else {
            this.accaTotalOdds = undefined
          }

          this.bettingService.setBetBasketData(this.responseData);
          if (
            this.responseData.singles == null ||
            this.responseData.singles == undefined
          ) {
            this.responseData = [];
            this.showBets = false;
            return;
          }
          localStorage.setItem('betBasketData', JSON.stringify(data));

          this.isMismatch = this.responseData.singles.some(
            (single) => single.price.dec !== single.selections[0].price.dec
          );

          if (this.isMismatch) {
            this.betSlipButtonText = 'Apply Changes and Place a Bet';
          }

          this.betPlacedResponse = data;

          if (this.betsDataStatus.status == 'PROCESSING' && this.betsDataStatus.status == 'REOFFER') {
            this.betplaceinProcess = true;
          } else if (this.betsDataStatus.status == 'FINISHED') {
            this.placedBets = [];
            this.rejectedBets = [];
            this.placedBetsMultiple = [];
            this.rejectedBetsMultiple = [];
            this.betReOfferedMultiple = [];
            this.betReOfferedSingle = [];
            this.betplaceinProcess = false;
            this.betplaceModal = true;
            this.betsDataStatus.singles.forEach((single) => {
              if (single.confirmedStatus === 'PLACED') {
                this.placedBets.push(single);
              } else if (single.confirmedStatus === 'REJECTED') {
                this.rejectedBets.push(single);
              } else if (single.confirmedStatus === 'REOFFER') {
                this.betReOfferedSingle.push(single);
                console.log('this.betReOfferedSingle', this.betReOfferedSingle);

              }
            });
            if (this.betsDataStatus.multiples) {
              this.betsDataStatus.multiples.forEach((multiple) => {
                if (multiple.status === 'PLACED') {
                  this.placedBetsMultiple.push(multiple);
                } else if (multiple.status === 'REJECTED') {
                  this.rejectedBetsMultiple.push(multiple);
                } else if (multiple.status === 'REOFFER') {
                  this.betReOfferedMultiple.push(multiple);
                  console.log('this.betReOfferedMultiple', this.betReOfferedMultiple);
                }
              });
            }
          }

          this.showBets = true;
          this.totalOddsCalc();
          this.potentialWinSingle();

          // console.log('combiBetsData', this.combiBetsData);


          if (this.accaTotalOdds) {
            if (this.tab === "Single" && this.activeButtonTab !== "Single") {
              this.tab = "ACCA"
              this.activeButton = "ACCA"
            }
          } else if (this.accaTotalOdds === undefined && this.tab === "ACCA") {
            this.tab = "Single"
            this.activeButton = "Single"
          }
          if (this.combiBetsData.length === 0) {
            if (this.tab === "COMBI") {
              this.tab = "Single"
              this.activeButton = "Single"
            }
          }
          // console.log('this.responseData 123', this.responseData);
          if(this.responseData && this.responseData.stake > 0 && this.responseData.stake < 99){
            this.minimumStake = true;
          }else{
            this.minimumStake = false;
          }
        },
        (error) => {
          console.error('betslip not found', error);
        }
      );
  }

  modifyStatusText(statusText: string): string {
    switch (statusText) {
      case 'BB_betplacement_wallet':
        return 'Insufficient Balance. Kindly deposit to place your bet';
      case 'BB_betplacement_internal':
        return 'General error has happend at betplacement';
      case 'BB_betplacement_offerVal':
        return 'Error has happened at offer validator on betplacement';
      case 'BB_betplacement_ptl':
        return 'Error has happened at ptl check on betplacement';
      case 'BB_betplacement_calcBet':
        return 'Error has happened at bet calculator on betplacement';
      case 'BB_betplacement_config':
        return 'Error has happened at reading configuration on betplacement';
      case 'BB_betplacement_badVal':
        return 'Error has happened at reading bad value for a field';
      case 'BB_betplacement_storeBet':
        return 'Error has happend at storing bet on betplacement';
      case 'BB_betplacement_updateBet':
        return 'Error has happend at storing bet on betplacement';
      case 'BB_betplacement_insertBet':
        return 'Error has happend at storing bet on betplacement';
      case 'BB_betplacement_interrelated':
        return 'Error has happend at interrelations check on betplacement';
      default:
        return statusText;
    }
  }

  resetArrowVisibility() {
    setTimeout(() => {
      // this.showArrow = false;
      this.priceChanged = false;
    }, 5000);
  }

  betPlace() {
    const authToken = localStorage.getItem('fnc_accessToken');

    const headers = new HttpHeaders({
      accept: 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      Authorization: `Bearer ${authToken}`,
    });

    this.httpClient
      .post('/betbasket/' + this.responseData.id + '/betplacement',
        this.isMismatch ? this.betsPriceData : this.responseData,
        { headers: headers, observe: 'response' })
      .subscribe(
        (response: HttpResponse<any>) => {
          this.totalpotentialAcca = 0;
          this.betplaceinProcess = true;
          const statusCode = response.status;
          if (statusCode == 201 || statusCode == 200) {
            this.generateBetbasketId();
          }
          // console.log('betBasketPlace', response);
        },
        (error) => {
          console.error('not placed:', error);
        }
      );
  }

  betPlaceReOffer() {
    const authToken = localStorage.getItem('fnc_accessToken');
    const headers = new HttpHeaders({
      accept: 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      Authorization: `Bearer ${authToken}`,
    });
    const payload = [];

    if (this.reofferSingle) {
      payload.push({
        id: this.reofferSingle.singleId,
        rejected: false,
      });
    }

    if (this.reofferMultipleArray) {
      this.reofferMultipleArray.forEach((multiple) => {
        payload.push({
          id: multiple.betType,
          rejected: false,
        });
      });
    }
    console.log('payload', payload);

    this.httpClient
      .post('/betbasket/' + this.responseData.id + '/betplacement', payload, { headers: headers, observe: 'response' })
      .subscribe(
        (response: HttpResponse<any>) => {
          this.hideDoneButton = false;
          this.totalpotentialAcca = 0;
          this.betplaceinProcess = true;
          const statusCode = response.status;
          if (statusCode == 201) {
            this.generateBetbasketId();
            console.log('bet placed');
          } else if (statusCode == 200) {
            this.generateBetbasketId();
            console.log('bet not placed');
          }
        },
        (error) => {
          console.error('not placed:', error);
        }
      );
  }

  betPlaceDone() {
    this.betplaceModal = false;
    this.balance.triggerRefresh();

    const payload = { singles: 'DELETE' };
    const betBasketId = localStorage.getItem('betBasketId');
    const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;

    this.httpClient
      .put(`/betbasket/${betBasketId}/reopen`, payload, { headers: headersToUse })
      .subscribe(
        (response) => {
          console.log('Reopen success:', response);
        },
        (error) => {
          console.error('Reopen failed:', error);
        }
      );
  }

  reOpenBetBasket() {
    this.balance.triggerRefresh();
    this.betplaceModal = false;
  
    const payload = {
      singles: 'KEEP',
    };
  
    const betBasketId = localStorage.getItem('betBasketId');
    const headersToUse = localStorage.getItem('fnc_accessToken') ? this.headersLogged : this.headers;
  
    this.httpClient
      .put('/betbasket/' + betBasketId + '/reopen', payload, {
        headers: headersToUse,
      })
      .subscribe(
        (response) => {
          console.log('reopen', response);
        },
        (error) => {
          console.error('not placed:', error);
        }
      );
  }  

  handleButtonClick(name: string): void {
    this.activeButtonTab = name;
    if (name === 'Single') {
      this.activeButton = "Single"
      this.tab = 'Single';
    } else if (name === 'ACCA') {
      this.tab = 'ACCA';
      this.activeButton = 'ACCA';
    } else if (name === 'COMBI') {
      this.tab = 'COMBI';
      this.activeButton = 'COMBI';
    }
  }
  shareOnTwitter() {
    const encodedUrl = encodeURIComponent(this.bookingCodeUrl);
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20this%20awesome%20content!`;
    window.open(twitterShareUrl, '_blank');
  }
  shareOnFacebook() {
    const encodedUrl = encodeURIComponent(this.bookingCodeUrl);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookShareUrl, '_blank');
  }
  shareOnWhatsApp() {
    const encodedUrl = encodeURIComponent(this.bookingCodeUrl);
    const whatsAppShareUrl = `https://api.whatsapp.com/send?text=Check out this awesome content: ${encodedUrl}`;
    window.open(whatsAppShareUrl, '_blank');
  }
  bookingCodeCoiped() {
    this.toastr.success('Booking Code Copied to Clipboard');
  }
  bookingLinkCopied() {
    this.toastr.success('Booking Link Copied to Clipboard');
  }

  freeBetCheckSingle(reward: any, game: any) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      const payload = {
        active: true,
        id: reward.id
      };
      this.httpClient.put('/betbasket/' + localStorage.getItem('betBasketId') + '/single/' + game.singleId + "/reward", payload, {
        headers: this.headersLogged,
      })
        .subscribe(
          (response) => {
            // console.log('reward api response');

          }
        )
    } else {
      const payload = {
        active: false,
        id: reward.id
      };
      this.httpClient.put('/betbasket/' + localStorage.getItem('betBasketId') + '/single/' + game.singleId + "/reward", payload, {
        headers: this.headersLogged,
      })
        .subscribe(
          (response) => {
            // console.log('reward api response');

          }
        )
    }
  }

  toggleFreebetVisible(index: number) {
    this.isFeebetvisible[index] = !this.isFeebetvisible[index];
  }

  freeBetCheckMulti(reward: any, accaTotalOdds) {
    console.log('reward', reward);
    console.log('accaTotalOdds', accaTotalOdds);

    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      const payload = {
        active: true,
        id: reward.id
      };
      // console.log('payload', reward);

      this.httpClient.put('/betbasket/' + localStorage.getItem('betBasketId') + '/single/' + accaTotalOdds.betType + "/reward", payload, {
        headers: this.headersLogged,
      })
        .subscribe(
          (response) => {
            // console.log('reward api response');
            const inputElement = this.el.nativeElement.querySelector('#accaInput');
            const stake = inputElement.value;
            console.log('stake', stake);

            if (stake) {
              this.totalpotentialAcca = this.totalOddsCalculate * stake;
            }
          }
        )
    } else {
      const payload = {
        active: false,
        id: reward.id
      };
      this.httpClient.put('/betbasket/' + localStorage.getItem('betBasketId') + '/single/' + accaTotalOdds.betType + "/reward", payload, {
        headers: this.headersLogged,
      })
        .subscribe(
          (response) => {
            // console.log('reward api response');
            const inputElement = this.el.nativeElement.querySelector('#accaInput');
            const stake = inputElement.value;
            console.log('stake', stake);

            if (stake) {
              this.totalpotentialAcca = this.totalOddsCalculate * stake;
            }
          }
        )
    }
  }

  generateBetbasketId() {
    // alert('hit bet')
    if (localStorage.getItem('fnc_accessToken')) {
      const idLocal = localStorage.getItem('betBasketId');
      const payload = {
        currency: 'NGN',
        id: idLocal,
      };
      const authToken = localStorage.getItem('fnc_accessToken');
      const headers = new HttpHeaders({
        accept: 'application/x.finbet.competitions+json',
        'Content-Type': 'application/x.finbet.sport.id+json',
        Authorization: `Bearer ${authToken}`,
      });

      this.httpClient
        .post<BetBasketResponse>('/betbasket/', payload, { headers: headers })
        .subscribe(
          (response) => {
            const betBasketId = response.id;
            localStorage.setItem('betBasketId', betBasketId);
            this.bettingService.betBasketIdSubject.next(betBasketId);
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    } else {
      const payload = {
        currency: 'NGN',
        id: '',
      };
      const headers = new HttpHeaders({
        accept: 'application/x.finbet.competitions+json',
        'Content-Type': 'application/x.finbet.sport.id+json',
      });

      this.httpClient
        .post<BetBasketResponse>('/betbasket/', payload, { headers: headers })
        .subscribe(
          (response) => {
            const betBasketId = response.id;
            localStorage.setItem('betBasketId', betBasketId);
          },
          (error) => {
            console.error('POST error:', error);
          }
        );
    }
  }

  generateNewBasketId() {
    const payload = {
      currency: 'NGN',
      id: '',
    };
    const headers = new HttpHeaders({
      accept: 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
    });
    const headersLogged = new HttpHeaders({
      accept: 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      Authorization: `Bearer ${localStorage.getItem('fnc_accessToken')}`,
    });

    this.httpClient
      .post<BetBasketResponse>('/betbasket/', payload, { headers: headers })
      .subscribe(
        (response) => {
          const betBasketId = response.id;
          localStorage.setItem('betBasketId', betBasketId);
          sessionStorage.setItem('betBasketId', betBasketId);
          if (this.betBasketSubscription) {
            this.betBasketSubscription.unsubscribe();
          }
          this.subscribeToBetBasket();
          if (this.bookingCodeInput) {
            this.bettingService.betBasketIdSubject.next(betBasketId);
            if (localStorage.getItem("fnc_accessToken")) {
              this.httpClient.get('/betbasket/' + localStorage.getItem('betBasketId') + '/code/' + this.bookingCodeInput, { headers: headersLogged })
                .subscribe(
                  (response: any) => {
                    // console.log('basket api code', response);
                  },
                  (error) => {
                    console.error('betbasketId:', error);
                  }
                );
            } else {
              this.httpClient.get('/betbasket/' + localStorage.getItem('betBasketId') + '/code/' + this.bookingCodeInput, { headers: headers })
                .subscribe(
                  (response: any) => {
                    // console.log('basket api code', response);
                  },
                  (error) => {
                    console.error('betbasketId:', error);
                  }
                );
            }
          }
        },
        (error) => {
          console.error('POST error:', error);
        }
      );
  }

  loginRoute() {
    this.route.navigate(['/auth/login-account']);
    this.bettingService.setBetslipOpenStatus(true);
  }
  openBetHistory() {
    this.route.navigate(['/edit-profile'], { queryParams: { currPage: 'bethistory' } });
    this.betPlaceDone();
  }
  openBetHistoryMobile() {
    this.route.navigate(['/edit-profile'], { queryParams: { currPage: 'bethistory' } });
    this.betPlaceDone();
    this.loaderService.triggerOpenBetHistory();
  }
  betAcceptChanges() {
    const authToken = localStorage.getItem('fnc_accessToken');
    const headers = new HttpHeaders({
      accept: 'application/x.finbet.competitions+json',
      'Content-Type': 'application/x.finbet.sport.id+json',
      Authorization: `Bearer ${authToken}`,
    });

    this.httpClient
      .patch('/betbasket/' + this.responseData.id, this.betsPriceData, { headers: headers })
      .subscribe(
        (response: HttpResponse<any>) => {

          const statusCode = response;

          // console.log('betBasketPlace', response);
        },
        (error) => {
          console.error('not placed:', error);
        }
      );
  }
  marketClick(){
    this.loaderService.toggleVisibility();
  }
}