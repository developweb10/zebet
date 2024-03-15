// footer.component.ts
import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { FooterService } from './service/footer.service';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';
import { BettingService } from '../../services/betting-service';
import { MatDialog } from '@angular/material/dialog';
import { SearchMenuComponent } from '../../modules/sports-book/search-menu/search-menu.component';
import { DialogService } from '../../shared/shared/dialog.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MyBetComponent } from '../betslip/my-bet/my-bet.component';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { StompHeaders } from '@livedoc';
import { ProfileService } from '../my-profile/my-profile/profile.service';
import { takeUntil } from 'rxjs/operators';
import { AuthFNCService } from '../../auth-fnc.service';
import { NotificationService } from '../header/notification/notification.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  footerData: any;
  socialLinks: any[] = [];
  supported_payment_method_images: any[] = [];
  currentUrl: string | undefined;
  ASSETS_URL = environment.ASSETS_URL;
  betSlipList: any[] = [];
  totalOdds: number;
  totalGames: number = 0;
  isVisible: boolean = false;
  storedData: boolean;
  isSplashPage: boolean = false;
  isLoggedIn: boolean = true;
  private betSlipListSubscription: Subscription;
  showScrollButton: boolean = false;
  responseData: any;
  accaApiResoponse: any;
  betBasketId: any;
  betbasketLink: string = 'user/betbasket/';
  betWinLink: string = 'user/inbox_messages/'
  betsNotiCOunt: string = 'user/inbox_messages/'
  totalOddsCalculate: number = 0;

  bookingCodeModal: boolean = false;
  betslipShow: boolean = false;
  myBetShow: boolean = false;
  bookingCode: string;
  headers = new HttpHeaders({
    accept: 'application/x.finbet.competitions+json',
    'Content-Type': 'application/x.finbet.sport.id+json',
  });

  headersLogged = new HttpHeaders({
    accept: 'application/x.finbet.competitions+json',
    'Content-Type': 'application/x.finbet.sport.id+json',
    Authorization: `Bearer ${localStorage.getItem('fnc_accessToken')}`,
  });
  betwinData: any[] = [];
  betWinUrl: string = "abc";
  betWinModal: boolean = false;
  betWinModalAPI: boolean = false;
  betPlacedDate: string = "abc";
  betWinDataModal: any;
  betwinUrlBrowse: any;
  betUrl = environment.betWinUrl;
  betWinDataModalAPI: any;
  betPlaceDate: any;
  loginStatus: boolean = false;
  azMenuVisible: boolean;
  isBetslipActive: boolean = false;
  isMybetsActive: boolean = false;
  isDepositActive: boolean = false;
  isLoginActive: boolean = false;

  private destroy$ = new Subject<boolean>();
  notificationsArray: { id: string; notificationType: any; createdAt: any; message: { betId: any; betType: any; currency: any; placedOn: any; betStatus: any; totalStakeOC: any; transactionTime: any; totalPotentialReturnOC: any; }; }[];
  lastItem: {
    id: string; notificationType: any; createdAt: any; message: {
      betId: any; betType: any; currency: any; placedOn: any; betStatus: any; totalStakeOC: any; transactionTime: any; totalPotentialReturnOC: any;
    };
  };
  betWinSeenLink: 'inbox/notification/seen';



  constructor(
    private footerService: FooterService,
    private router: Router,
    private dialogService: DialogService,
    private http: HttpClient,
    private loaderService: LoaderService,
    private bettingService: BettingService,
    public dialog: MatDialog,
    private httpClient: HttpClient,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private profileService: ProfileService,
    private authService: AuthFNCService,
    private notificationService: NotificationService
  ) {

    const betsipVisibility = this.loaderService.getBetslipVisibility();
    // console.log('Betslip Visibility:', betsipVisibility);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    this.loaderService.BetslipIsVisible$.pipe((takeUntil(this.destroy$))).subscribe((status) => {
      this.isBetslipActive = status;
    });

    this.loaderService.MyBetIsVisible$.pipe((takeUntil(this.destroy$))).subscribe((status) => {
      this.isMybetsActive = status;
    });

    this.profileService.depostiSubject.pipe((takeUntil(this.destroy$))).subscribe((status) => {
      this.isDepositActive = status;
    });

    this.profileService.loginPageSubject.pipe((takeUntil(this.destroy$))).subscribe((status) => {
      this.isLoginActive = status;
    });

    // this.bettingService.getResponseData().subscribe((data) => {
    //   this.responseData = data;
    //   if (this.responseData == undefined) {
    //     this.responseData = [];
    //     return;
    //   }

    //   this.totalGames = this.responseData.singles.length;

    //   this.totalOddsCalc();
    //   // console.log('123', data)
    // });
  }
  isSportsBookUrl(): boolean {
    // Check if the current URL contains "/sports-book"
    return this.router.url.includes('/sports-book');
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Check if the user has scrolled down enough to show the scroll button
    this.showScrollButton = window.scrollY > window.innerHeight * 0.5;
  }

  scrollToTop(): void {
    // Scroll to the top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  ngOnInit(): void {
    this.authService.newToken(localStorage.getItem("fnc_accessToken"));
    this.loaderService.isLoggedIn$.subscribe(data => {
      //alert(data)
      this.storedData = data;
      // console.log("IsLoggedIn", data)

    })

    this.footerService.getFooterData().subscribe(data => {
      this.footerData = data.data;
      this.socialLinks = data.data.social_links;
      console.log("1234567890", this, this.footerService)
      this.supported_payment_method_images = data.data.supported_payment_method_images;
      console.log("1234567890", this.supported_payment_method_images)
      this.loaderService.BetslipIsVisible$.subscribe((isVisible) => {
        this.betslipShow = isVisible;
      });

      this.loaderService.MyBetIsVisible$.subscribe((isVisible) => {
        this.myBetShow = isVisible;
      });
    });
    //this.storedData = localStorage.getItem('accessToken');
    // this.betSlipList = this.bettingService.getBetSlipList();

    if (localStorage.getItem('fnc_accessToken')) {
      this.isLoggedIn = true;
      this.storedData = true;
    } else {
      this.storedData = false;
      this.isLoggedIn = false;
    }


    const betBasketId = localStorage.getItem('betBasketId');
    // if (betBasketId) {
    //   this.betBasketId = betBasketId;
    //   if (environment.isLiveFeedConnected) {
    //     this.subscribeToBetBasket();
    //   }
    // } 
    this.bettingService.betBasketData$.subscribe((data) => {


      if (data !== undefined || data !== null) {
        if (data?.singles) {
          this.totalGames = data?.singles.length;
          this.totalOddsCalc(data?.singles);
          this.betSlipList = data.singles;
        }
        else {
          this.totalGames = 0;
          this.totalOddsCalculate = 0;
          this.betSlipList = [];
        }

      }
      else {
        this.totalGames = 0;
        this.totalOddsCalculate = 0;
        this.betSlipList = [];
      }
      // console.log('betSlipList', this.betSlipList);


    });

    // Or subscribe to the observable for real-time updates
    // this.betSlipListSubscription = this.bettingService.betSlipListObservable.subscribe((list) => {
    //   this.betSlipList = list;
    //   console.log("Bet Slip List: ", this.betSlipList);
    //   this.calculateTotalOdds(this.betSlipList);
    //   console.log('this.totalOdds', this.totalOdds)
    // });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        this.isSplashPage = event.url === '/';
      }

    });

    if (localStorage.getItem('fnc_accessToken')) {
      this.subscribeToBetWin();
    }

    const pageUrl = window.location.href;
    const urlParts = pageUrl.split('/');
    const betwinIndex = urlParts.findIndex(part => part.startsWith('betwin-'));
    if (betwinIndex !== -1) {
      this.betwinUrlBrowse = urlParts[betwinIndex].substring('betwin-'.length);
      this.getBetWinData();
    }
    const domain = this.getFullDomainFromUrl(pageUrl);
    this.bettingService.loginStatus$.subscribe((status) => {
      if (localStorage.getItem('fnc_accessToken')) {
        this.loginStatus = true;
      } else {
        this.loginStatus = false;
      }
    });
    this.bettingService.betSlipStatus$.subscribe((status) => {
      if (this.betslipShow) {
        this.betslipShow = false;
        return
      }
    });
    this.loaderService.openBetHistory$.subscribe(() => {
      this.betslipShow = false;
    });
    this.bettingService.loginStatus$.subscribe((status) => {
      this.subscribeToBetWin();
    });
  }

  getFullDomainFromUrl(url: string): string {
    const parsedUrl = new URL(url);
    return `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}`;
  }
  public subscribeToBetBasket(): void {
    this.bettingService.getBetBasket(`${this.betbasketLink}${this.betBasketId}`).subscribe((data) => {

      this.responseData = data;
      this.bettingService.setBetBasketData(data);

      // console.log("betslip Data", data)
      this.totalGames = this.responseData.singles.length;

      this.totalOddsCalc();
    }, error => {
      console.error('betslip not found', error);
    });
  }

  totalOddsCalc(singles: any[] = []) {
    let totalOdds = 1;
    singles.forEach(item => {
      const decValue = parseFloat(item.price.dec);
      totalOdds *= decValue;
    });
    this.totalOddsCalculate = totalOdds;
  }

  getPaymentMethodImageUrl(directus_files_id: string): string {
    const imageUrl = this.ASSETS_URL + `files/${directus_files_id}`;
    console.log('Image URL:', imageUrl);
    return imageUrl;
  }

  toggleMyBetVisibility(): void {
    const dialogAddress = this.dialog.open(MyBetComponent, {
      maxWidth: '100vw',
      width: '100vw',
    });

    dialogAddress.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });

    this.dialogService.closeDialog$.subscribe(() => {
      dialogAddress.close(); // Close the dialog when a signal is received
    });
  }

  toggleVisibility(): void {

    this.loaderService.setMyBetVisibility(false);
    this.loaderService.setVisibility(false);
    this.bookingCodeModal = false;

    this.closeOpenedDialogs();
    if (this.azMenuVisible) return; else this.azMenuVisible = true;

    const dialogAddress = this.dialog.open(SearchMenuComponent, {
      maxWidth: '100vw',
      height: '100vh',
      width: '100vw',
      autoFocus: false,
      panelClass: 'AtoZ',
    });

    dialogAddress.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.azMenuVisible = false;
    });

    this.dialogService.closeDialog$.subscribe(() => {
      dialogAddress.close(); // Close the dialog when a signal is received
    });

  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.betSlipListSubscription.unsubscribe();
  }

  onBetslipClick() {

    this.closeOpenedDialogs();

    if (this.azMenuVisible) this.azMenuVisible = false;
    this.loaderService.toggleVisibility();
    this.loaderService.setMyBetVisibility(false);
    this.bookingCodeModal = false;
    this.renderer.addClass(document.body, 'betSlipActive');
    // if (this.betslipShow) {
    //   this.betslipShow = false;
    // }else{
    //   this.betslipShow = true;
    // }
  }

  onMyBetClick() {
    this.closeOpenedDialogs();
    this.loaderService.toggleMyBetVisibility();
    this.loaderService.setVisibility(false);
    this.renderer.addClass(document.body, 'betSlipActive');


    // if (this.betslipShow) {
    //   this.betslipShow = false;
    // }else{
    //   this.betslipShow = true;
    // }




  }

  redirectToLive() {
    this.router.navigateByUrl('live-sports')
  }

  getBookingCode() {
    console.log('booking Code', this.bookingCode);
    if (localStorage.getItem("fnc_accessToken")) {
      this.httpClient.get('/betbasket/' + localStorage.getItem('betBasketId') + '/code/' + this.bookingCode, { headers: this.headersLogged })
        .subscribe(
          (response: any) => {
            this.bookingCodeModal = false;
            this.onBetslipClick();
            this.renderer.removeClass(document.body, 'overflow-hidden');
          },
          (error) => {
            console.error('betbasketId:', error);
          }
        );
    } else {
      this.httpClient.get('/betbasket/' + localStorage.getItem('betBasketId') + '/code/' + this.bookingCode, { headers: this.headers })
        .subscribe(
          (response: any) => {
            this.bookingCodeModal = false;
            this.onBetslipClick();
            this.renderer.removeClass(document.body, 'overflow-hidden');
          },
          (error) => {
            console.error('betbasketId:', error);
          }
        );
    }
  }

  openBookingModal() {
    this.closeOpenedDialogs();
    this.loaderService.setMyBetVisibility(false);
    this.loaderService.setVisibility(false);

    this.scrollToTop();
    if (this.bookingCodeModal) {
      this.bookingCodeModal = false;
      // this.renderer.removeClass(document.body, 'overflow-hidden');
    } else {
      this.bookingCodeModal = true;
      // this.renderer.addClass(document.body, 'overflow-hidden');
    }
  }

  public subscribeToBetWin(): void {
    let initialLoad = true;
    let newNotification: any;
    const headers: StompHeaders = {
      'X-Seen': 'false',
      'X-IncludeType': 'BETWIN',
    };

    this.bettingService.getBetwin(`${this.betWinLink}`, headers).subscribe((data) => {
      const previousNumberOfItems = Object.keys(this.betwinData).length;
      this.betwinData = data;
      const currentNumberOfItems = Object.keys(this.betwinData).length;
      const newNotifications = Object.entries(this.betwinData).map(([id, item]: [string, any]) => ({
        id,
        notificationType: item.notificationType,
        createdAt: item.createdAt,
        message: {
          betId: item.message.betId,
          betType: item.message.betType,
          currency: item.message.currency,
          placedOn: item.message.placedOn,
          betStatus: item.message.betStatus,
          totalStakeOC: item.message.totalStakeOC,
          transactionTime: item.message.transactionTime,
          totalPotentialReturnOC: item.message.totalPotentialReturnOC
        }
      }));
      if (!initialLoad && currentNumberOfItems > previousNumberOfItems) {
        newNotification = newNotifications[newNotifications.length - 1];
        if (newNotification) {
          const formattedDate = this.formatDate(newNotification.message.placedOn);
          this.betWinModal = true;
          this.myBetShow = false;
          this.betPlacedDate = formattedDate
          this.betWinDataModal = newNotification;
          this.generateBetwinUrl();
          const betID = this.betWinDataModal.message.betId;
          const numericPart: number = parseInt(betID.match(/\d+/)?.[0] || "0", 10);
          const pageUrl = window.location.href;
          const fullDomain = this.getFullDomainFromUrl(pageUrl);
          this.betWinUrl = fullDomain + '/sports-book/football/betwin-' + numericPart;
        }
      }
      initialLoad = false;
    });
  }





  shareOnTwitter() {
    const encodedUrl = encodeURIComponent(this.betWinUrl);
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20this%20awesome%Win!`;
    window.open(twitterShareUrl, '_blank');
  }
  shareOnFacebook() {
    const encodedUrl = encodeURIComponent(this.betWinUrl);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    window.open(facebookShareUrl, '_blank');
  }
  shareOnWhatsApp() {
    const encodedUrl = encodeURIComponent(this.betWinUrl);
    const whatsAppShareUrl = `https://api.whatsapp.com/send?text=Check out this awesome Win: ${encodedUrl}`;
    window.open(whatsAppShareUrl, '_blank');
  }
  closeBetWinModal() {
    this.betWinModal = false;
    this.betWinModalAPI = false;
  }

  generateBetwinUrl() {
    const payload = {
      bet_id: this.betWinDataModal.message.betId,
      user_id: "123",
      total_potential_return_oc: this.betWinDataModal.message.totalPotentialReturnOC,
      placed_on: this.betPlacedDate
    }
    // console.log('payload', payload);
    const betHeader = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    });
    this.http.post<any>(this.betUrl + 'api/user/win-bet', payload, { headers: betHeader }).subscribe(
      (response) => {
        // console.log('betwin response', response);
      }
    )
  }
  getBetWinData() {
    this.http.get<any>(this.betUrl + 'api/user/win-bet/BT-' + this.betwinUrlBrowse).subscribe(
      (response) => {
        // console.log('betwin response', response.data);
        this.betWinModalAPI = true;
        this.betWinDataModalAPI = response.data;
        const formattedDate = this.formatDate(this.betWinDataModalAPI.placed_on);
        this.betPlaceDate = formattedDate;
        // console.log('this.betwinDataPOST', this.betWinDataModalAPI);
        // console.log('this.betwindata', this.betWinDataModalAPI);
        const pageUrl = window.location.href;
        const fullDomain = this.getFullDomainFromUrl(pageUrl);
        // console.log('Full Domain:', fullDomain);
        const betID = this.betWinDataModalAPI.bet_id;
        // console.log('betID ', betID);
        const numericPart: number = parseInt(betID.match(/\d+/)?.[0] || "0", 10);
        this.betWinUrl = fullDomain + '/sports-book/football/betwin-' + numericPart;
        // console.log('this.betWinUrl', this.betWinUrl);

      }
    )
  }

  private formatDate(datetimeString: string): string {
    const date = new Date(datetimeString);
    // console.log('date', date);
    return this.datePipe.transform(date, 'MMM dd, yyyy, hh:mm:ss a') || '';
  }

  copyText(value: string) {
    this.copyToClipboard(value);
    this.betwinLinkCopied();
  }

  copyToClipboard(value: string) {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    // alert('Text copied to clipboard: ' + value);
  }
  betwinLinkCopied() {
    this.toastr.success('Betwin Link Copied');
  }

  closeOpenedDialogs() {
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs && openDialogs.length > 0) {
      openDialogs.forEach(dialogRef => {
        dialogRef.close();
      });
    }
  }

  // onDeposit() {
  //   // this.profileService.setDepositSubject.next(true);
  //   this.profileService.depostiSubject.next(true);

  // }
  isAffiliateProgram(link: string): boolean {
    return link === '/affiliate-program';
  }

  messageSeen(notification: any): void {
    this.betWinModal = false;
    const notificationId = parseInt(notification.id, 10); // or use Number(notification.id);

    if (isNaN(notificationId)) {
      console.error('Invalid notification ID:', notification.id);
      return;
    }

    const apiUrl = `/inbox/notification/seen`;

    this.notificationService.markAsSeen(apiUrl, notificationId).subscribe(
      () => {
        // Update the local notificationProperties array to reflect the change
        notification.seen = true;
        // this.selectedNotification = this.selectedNotification === notification ? null : notification;
        this.notificationService.triggerUpdate();
      },
      (error) => {
        console.error('Error marking message as seen:', error);
      }
    );
  }

}
