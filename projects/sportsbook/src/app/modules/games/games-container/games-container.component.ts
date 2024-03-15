import {
  Component,
  ViewChildren,
  QueryList,
  OnInit,
  AfterViewInit,
  Input,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  combineLatest,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import {
  map,
  takeUntil,
  filter,
  catchError,
  take,
  concatMap,
  tap,
  pluck,
  switchMap,
  combineAll,
} from 'rxjs/operators';
import {
  StompHeaders,
  LiveDocService,
  LiveDocConfigLoaderService,
  LiveDocConfig,
} from '@livedoc';
<<<<<<< Updated upstream:projects/sportsbook/src/app/modules/games/games-container/games-container.component.ts
import { AuthFNCService } from '../../../auth-fnc.service';
import { BeeperService } from '../../../beeper.service';
import { MainEventFeed, EventData } from '../../../dto/event-data.dto';
import { FinHomeCoreData, MainEventData } from '../../../dto/home-data.dto';
import { BettingService } from '../../../services/betting-service';
import { DemoBettingService } from '../../../services/demo-betting-service';
import { EVENT_TYPE } from '../../../util/enum';
import { ResizeService } from '../resize.service';
import { SCREEN_SIZE } from '../screen-size.enum';
=======
import { AuthFNCService } from '../../auth-fnc.service';
import { BeeperService } from '../../beeper.service';
import { EventData, MainEventFeed } from '../../dto/event-data.dto';
import { FinHomeCoreData, MainEventData } from '../../dto/home-data.dto';
import { EVENT_TYPE } from '../../util/enum';
import { BettingService } from '../../services/betting-service';
import { DemoBettingService } from '../../services/demo-betting-service';
import { ResizeService } from '../resize.service';
import { SCREEN_SIZE } from '../screen-size.enum';
import { Selection } from '../../dto/odd-data.dto';
>>>>>>> Stashed changes:projects/sportsbook/src/app/games/games-container/games-container.component.ts

interface DeltaMergeStrategy {
  label: string;
  function: (a: any, b: any) => any;
}

interface LiveDocCard {
  destination: string;
  data: any;
  headers: StompHeaders;
  // url: string;
  strategy: string;
  updates: number;
  lastData: Date;
  created: Date;
  terminated: Date;
  subscription: Subscription;
  state: 'Connecting' | 'Connected' | 'Unsubscribed' | 'Error';
}

@Component({
  selector: 'app-games-container',
  templateUrl: './games-container.component.html',
  styleUrls: ['./games-container.component.css'],
  animations: [
    trigger('comeAndGo', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate3d(0, -400px, 0)',
        }),
        animate(
          '500ms ease',
          style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-out',
          style({
            opacity: 0,
            transform: 'translate3d(0, 400px, 0)',
          })
        ),
      ]),
    ]),
  ],
})
export class GamesContainerComponent implements OnInit, AfterViewInit {
  @Input() selectedTab: string = '1x2';
  showAllItems = false;
  constructor(
    public liveDocService: LiveDocService,
    public liveDockConfigMockLoader: LiveDocConfigLoaderService,
    private httpClient: HttpClient,
    private beeper: BeeperService,
    private auth: AuthFNCService,
    private bettingService: BettingService,
    private demoBettingService: DemoBettingService,
    private resizeSvc: ResizeService
  ) {
    console.log(
      'Generating first authentication token automatically for secure sockets'
    );
    // auth.newToken(
    //   'DEFAULT TOKEN: This tester application generates first token automatically, ' +
    //     'otherwise subscriptions to secure sockets would wait for the token'
    // );
  }
  ngAfterViewInit(): void {}

  isLoaded: boolean = false;
  screenWidth = 0;
  screenOrientation = 'LG';

  betSlip: Selection[] = [];

  companyLogos = [
    'bundesliga-logo.png',
    'image 14.png',
    'image 15.png',
    'ligue-1-logo-transparent.png',
    'seria a.png',
    'uel-logo.png',
    'bundesliga-logo.png',
    'image 14.png',
    'image 15.png',
    'ligue-1-logo-transparent.png',
    'seria a.png',
    'uel-logo.png',
    'bundesliga-logo.png',
    'image 14.png',
    'image 15.png',
    'ligue-1-logo-transparent.png',
    'seria a.png',
    'uel-logo.png',
  ];

  private unsubscribeAll = new Subject<void>();
  destinations = [
    'echo/echo',
    'notifications/alerts',
    'events/E-1~20',
    'sports/',
    'competitions/',
    'markets/',
    'eventmarkets/',
    'fieldbook/',
    'rma/bettickers',
  ];

  private readonly unsubscribe$: Subject<void> = new Subject();
  private readonly unsubscribeEvent$: Subject<void> = new Subject();

  headers: StompHeaders;

  homeFeedLink: string = 'eventmap/upcomingFBL';
  eventsFeedLink: string = 'events/';

  homeData: FinHomeCoreData;
  mainEventFeedData: MainEventFeed[];
  mainEventData: MainEventData[] = [];
  @Input() eventFeed: EventData[] = [];
  eventType: EVENT_TYPE = EVENT_TYPE.HOME_FEED;

  liveDocCards: LiveDocCard[] = [];
  staleCardCount = 0;

  ngOnInit() {
    //   if(environment.isLiveFeedConnected)
    //   this.subscribeToUpcomingGames();
    // else
    //   this.subscribeToUpcomingGamesDemo();

    setTimeout(() => {
      this.isLoaded = true;
    }, 5000);
    //

    this.screenWidth = window.innerWidth;
    console.log(this.screenWidth);

    this.screenOrientation = this.determineScreenOrientation(
      this.screenWidth
    ).toString();
    this.bettingService.betbasket.subscribe((value) => {
      this.betSlip = value;
    });
  }

  subscribeToUpcomingGames() {
    this.bettingService
      .upcomingGames(this.homeFeedLink)
      .pipe(
        take(5),
        pluck('events'),
        // takeUntil(this.unsubscribe$),
        //take(5),
        map((events) => Object.values(events)),
        switchMap((events: any[]) =>
          combineLatest(
            events.map((event: any) =>
              this.bettingService.getEvents(`${this.eventsFeedLink}${event.id}`)
            )
          ).pipe(takeUntil(this.unsubscribe$))
        )
      )
      .subscribe((data) => {
        console.log('Home Data', data);
        this.isLoaded = true;
        //data.map(Obj => {

        this.eventFeed.length = 0;
        this.eventFeed.push(...data);
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        //});
      });
  }

  subscribeToUpcomingGamesDemo() {
    this.demoBettingService
      .upcomingGames()
      .pipe(take(5))
      .subscribe((data) => {
        console.log('Home Data', data);
        this.isLoaded = true;

        this.eventFeed.length = 0;
        this.eventFeed.push(...data);
      });
  }

  // liveDocConfigUser = new FormControl('', liveDocConfigValidator());

  // // Put LiveDoc config into the input for the user to modify
  // liveDocConfigFile: string;
  // liveDocConfigSubscription = this.httpClient.get<LiveDocConfig>(APP_LIVEDOC_SETTINGS.configUrl).pipe(
  //   map(config => JSON.stringify(config, null, 4)),
  //   catchError(e => of('Error in the config file')),
  //   takeUntil(this.liveDocConfigUser.valueChanges)
  // ).subscribe(config => {
  //   console.log("COnfig", config)
  //   this.liveDocConfigUser.setValue(this.liveDocConfigFile = config)
  // });

  // destinationControl = new FormControl(this.destinations[0]);
  // destinationSuggestions = combineLatest([
  //   of(this.destinations),
  //   this.destinationControl.valueChanges
  // ]).pipe(
  //   map(([destinations, prefix]) => destinations.filter(destination => destination.includes(prefix)))
  // );

  // deltaMergeStrategies: DeltaMergeStrategy[] = [
  //   {label: 'Show Diff', function: (last: any, next: any) => 'Diff' ? next : last},
  //   {label: 'Show Grow', function: (last: any, next: any) => 'Grow' ? next : last},
  //   {label: 'Show Change', function: (last: any, next: any) => 'Change' ? next : last},
  //   {label: 'Show Average', function: (last: any, next: any) => 'Average' ? next : 0}
  // ];
  // chosenStrategy = new FormControl();

  // unsubscribeOthersControl = new FormControl();
  // beepControl = new FormControl();

  // updateLiveDocConfig(configText: string) {
  //   const userConfig = JSON.parse(configText);

  //   // The really awkward line below is to make testing easier
  //   (this.liveDocService as any).livedocConfigLoaderService.newConfig.next(userConfig);
  // }

  // rippleCard(card: LiveDocCard, color?: string) {
  //   const cardIndex = this.liveDocCards.findIndex(c => c === card);
  //   if ( cardIndex > -1 ) {
  //     const ripple = this.ripples.find((r, i) => i === cardIndex);
  //     if ( ripple ) {
  //       ripple.launch({
  //         centered: Math.random() < .5,
  //         color
  //       });
  //     }
  //   }
  // }

  subscribeAllDestinations(
    destinationWithDelta: string,
    deltaHandlingStrategy?: DeltaMergeStrategy,
    headers?: StompHeaders,
    unsubscribeOthers?: boolean
  ) {
    console.log('Headers', headers);
    console.log('deltaHandlingStrategy', deltaHandlingStrategy);
    if (unsubscribeOthers) {
      this.unsubscribeAll.next();
    }

    const range = destinationWithDelta.match(/^(.*?)(\d+)~(\d+)(.*)$/);
    if (range) {
      const prefix = range[1];
      const start = +range[2];
      const end = +range[3];
      const suffix = range[4];
      for (let i = start; i <= end; ++i) {
        const destination = prefix + i + suffix;
        this.newSubscription(destination, deltaHandlingStrategy, headers);
      }
    } else {
      this.newSubscription(
        destinationWithDelta,
        deltaHandlingStrategy,
        headers
      );
    }
  }

  newSubscription(
    destination: string,
    deltaHandlingStrategy?: DeltaMergeStrategy,
    headers?: StompHeaders
  ) {
    console.group('New Subscription Parameters:');
    console.table({
      destination,
      headers:
        Object.entries(headers || {})
          .map(([key, value]) => key + ' : ' + value)
          .join(';   ') || null,
      deltaMerge: deltaHandlingStrategy && deltaHandlingStrategy.label,
    });
    console.groupEnd();

    const card: LiveDocCard = {
      destination,
      data: null,
      headers,
      // url: ;
      strategy: (deltaHandlingStrategy && deltaHandlingStrategy.label) || '',
      updates: 0,
      lastData: null,
      created: new Date(),
      terminated: null,
      subscription: null,
      state: 'Connecting',
    };

    const stream = this.liveDocService.getStream({
      document: destination,
      headers,
      deltaHandlingStrategy:
        deltaHandlingStrategy && deltaHandlingStrategy.function,
    });
    const subscription = stream
      .pipe(
        takeUntil(this.unsubscribe$)
        //take(2)
      )
      .subscribe({
        next: (data) => {
          this.unsubscribe$.next();
          this.unsubscribe$.complete();

          this.homeData = JSON.parse(JSON.stringify(data, null, 2));
          //console.log("test",Object.keys(this.homeData.events));

          // this.rippleCard(card, 'rgba(0, 0, 255, 0.2)');
          // if ( this.beepControl.value ) { this.beeper.beep(); }

          console.log(`Count: ${Object.keys(this.homeData.events).length}`);

          for (const key in this.homeData.events) {
            //console.log(`Key: ${key}`);
            //if (Object.prototype.hasOwnProperty.call(card.data.events, key)) {
            //console.log(`Key: ${key} == Value: ${JSON.stringify(this.homeData.events[key])}`);
            //call to feed
            //this.loadHomeEvents(this.homeData.events[key]);

            //if(this.homeData.events[key].)

            this.mainEventData.push(this.homeData.events[key]);

            // this.newEventSubscription(`${this.eventsFeedLink}${this.homeData.events[key]}`, null, this.headers)

            //}
          }

          const data$: Observable<any>[] = [];
          this.mainEventData.map((t) => {
            //if(data$.length < 3)
            //{
            const address$: Observable<any> = this.newEventSubscription(
              `${this.eventsFeedLink}${t.id}`,
              null,
              this.headers
            );

            //data$.push(address$);
            //}

            address$.pipe(takeUntil(this.unsubscribeEvent$)).subscribe({
              next: (data) => {
                console.log('event Data', data);
                this.eventFeed.push(data);
              },
              error: (e) => {},
              complete: () => {},
            });
            // .subscribe(data =>
            //   {
            //     console.log("event Data", data);
            //     this.eventFeed.push(data)
            //   })
          });

          this.isLoaded = true;

          // this.unsubscribeEvent$.next();
          // this.unsubscribe$.complete();

          this.isLoaded = true;
        },
        error: (e) => {
          card.terminated = new Date();
          card.state = 'Error';
          //this.rippleCard(card, 'rgba(255, 0, 0, 0.2)');
          ++this.staleCardCount;
        },
        complete: () => {
          card.terminated = new Date();
          card.state = 'Unsubscribed';
          ++this.staleCardCount;
        },
      });

    card.subscription = subscription;

    this.liveDocCards.unshift(card);
  }

  newEventSubscription(
    destination: string,
    deltaHandlingStrategy?: DeltaMergeStrategy,
    headers?: StompHeaders
  ) {
    console.group('New Subscription Parameters:');
    console.table({
      destination,
      headers:
        Object.entries(headers || {})
          .map(([key, value]) => key + ' : ' + value)
          .join(';   ') || null,
      deltaMerge: deltaHandlingStrategy && deltaHandlingStrategy.label,
    });
    console.groupEnd();

    const stream = this.liveDocService.getStream({
      document: destination,
      headers,
      deltaHandlingStrategy:
        deltaHandlingStrategy && deltaHandlingStrategy.function,
    });

    // const subscription = stream.pipe(
    //   take(2)
    // );

    return stream;
  }

  newOddSubscription(
    destination: string,
    deltaHandlingStrategy?: DeltaMergeStrategy,
    headers?: StompHeaders
  ) {
    console.group('New Subscription Parameters:');
    console.table({
      destination,
      headers:
        Object.entries(headers || {})
          .map(([key, value]) => key + ' : ' + value)
          .join(';   ') || null,
      deltaMerge: deltaHandlingStrategy && deltaHandlingStrategy.label,
    });
    console.groupEnd();

    const card: LiveDocCard = {
      destination,
      data: null,
      headers,
      // url: ;
      strategy: (deltaHandlingStrategy && deltaHandlingStrategy.label) || '',
      updates: 0,
      lastData: null,
      created: new Date(),
      terminated: null,
      subscription: null,
      state: 'Connecting',
    };

    const stream = this.liveDocService.getStream({
      document: destination,
      headers,
      deltaHandlingStrategy:
        deltaHandlingStrategy && deltaHandlingStrategy.function,
    });

    const subscription = stream.pipe(takeUntil(this.unsubscribeAll)).subscribe({
      next: (data) => {
        console.log('Odd Data Received', JSON.stringify(data, null, 2));

        // this.oddsEventData = JSON.parse(JSON.stringify(data, null, 2));

        // console.log("debug Data", this.oddsEventData.selections[0][0])

        // this.homeWinOdd = this.oddsEventData.selections[0][0].price.dec;
        // this.teamDrawOdd= this.oddsEventData.selections[0][1].price.dec;
        // this.awayWinOdd = this.oddsEventData.selections[0][2].price.dec;
      },
      error: (e) => {
        card.terminated = new Date();
        card.state = 'Error';
        //this.rippleCard(card, 'rgba(255, 0, 0, 0.2)');
        ++this.staleCardCount;
      },
      complete: () => {
        card.terminated = new Date();
        card.state = 'Unsubscribed';
        ++this.staleCardCount;
      },
    });

    card.subscription = subscription;

    this.liveDocCards.unshift(card);
  }

  unsubscribeCard(card: LiveDocCard) {
    card.subscription.unsubscribe();
    this.staleCardCount++;
    card.state = 'Unsubscribed';
  }

  removeCard(card: LiveDocCard) {
    // if ( card.state === 'Error' || card.state === 'Unsubscribed' ) {
    --this.staleCardCount; // Only stale can be removed
    this.liveDocCards = this.liveDocCards.filter(
      (candidate) => candidate !== card
    );
  }

  removeAll() {
    this.unsubscribeAll.next();
    this.liveDocCards = [];
    this.staleCardCount = 0;
  }

  removeStale() {
    this.liveDocCards = this.liveDocCards.filter(
      (card) => card.state === 'Connecting' || card.state === 'Connected'
    );
    this.staleCardCount = 0;
  }

  // send() {
  //   this.dialog.open<StompSenderComponent, StompSenderIO, StompSenderIO>(StompSenderComponent, {
  //     data: {
  //       destination: this.destinationControl.value,
  //       headers: this.headers,
  //       body: ''
  //     },
  //     disableClose: true
  //   }).afterClosed().pipe(
  //     filter(reply => !!reply)
  //   ).subscribe(reply => this.liveDocService.send(reply));
  // }

  loadNewConfig(newConfig: string) {
    this.liveDockConfigMockLoader.newConfig.next(JSON.parse(newConfig));
  }

  // newToken() {
  //   this.dialog.open<StompTokensDialogComponent, any, string>(StompTokensDialogComponent).afterClosed().pipe(
  //     filter( reply => !!reply)
  //   ).subscribe(token => this.auth.newToken(token));
  // }

  determineScreenOrientation(width: number) {
    let sizes: SCREEN_SIZE = SCREEN_SIZE.LG;
    if (width >= 0 && width <= 640) sizes = SCREEN_SIZE.XS;
    else if (width >= 641 && width <= 1007) sizes = SCREEN_SIZE.MD;
    else if (width >= 1008) sizes = SCREEN_SIZE.LG;

    return sizes;
  }
}
