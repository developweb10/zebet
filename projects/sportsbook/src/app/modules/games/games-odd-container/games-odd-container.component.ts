import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LiveDocConfig, LiveDocConfigLoaderService, LiveDocService, StompHeaders } from '@livedoc';
import { BeeperService } from '../../../beeper.service';
import { AuthFNCService } from '../../../auth-fnc.service';
import { Subject, Subscription, combineLatest, of } from 'rxjs';
import { OddEventData } from '../../../dto/odd-data.dto';
import { FormControl } from '@angular/forms';
import { liveDocConfigValidator } from '../../../helpers/livedoc-config-validator';
import { APP_LIVEDOC_SETTINGS } from '../../../app.settings';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { EVENT_TYPE } from '../../../util/enum';


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
  selector: 'app-games-odd-container',
  templateUrl: './games-odd-container.component.html',
  styleUrls: ['./games-odd-container.component.css']
})
export class GamesOddContainerComponent  implements OnInit {

  @Input() marketId: string;

  constructor(
    public liveDocService: LiveDocService,
    public liveDockConfigMockLoader: LiveDocConfigLoaderService,
    private httpClient: HttpClient,
    private beeper: BeeperService,
    private auth: AuthFNCService,
  ) {
    console.log('Generating first authentication token automatically for secure sockets');
    // auth.newToken(
    //   'DEFAULT TOKEN: This tester application generates first token automatically, ' +
    //   'otherwise subscriptions to secure sockets would wait for the token'
    // );
  }

  ngOnInit() {
    console.log("Market Id", this.marketId);
    // this.subscribeAllDestinations(`${this.marketsFeedLink}${this.marketId}`, null, this.headers, false);
  }

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

  headers: StompHeaders;

  marketsFeedLink: string = "markets/";
  eventType: EVENT_TYPE = EVENT_TYPE.ODDS_FEED;

  oddsEventData: OddEventData;

  homeWin: string = "NGN";
  awayWin: string = "CMR";
  teamDraw: string = "CMR";

  gameDate: string;
  gameTime: string;

  staleCardCount = 0;

  liveDocConfigUser = new FormControl('', liveDocConfigValidator());

  // Put LiveDoc config into the input for the user to modify
  liveDocConfigFile: string;
  liveDocConfigSubscription = this.httpClient.get<LiveDocConfig>(APP_LIVEDOC_SETTINGS.configUrl).pipe(
    map(config => JSON.stringify(config, null, 4)),
    catchError(e => of('Error in the config file')),
    takeUntil(this.liveDocConfigUser.valueChanges)
  ).subscribe(config => { 
    console.log("COnfig", config)
    this.liveDocConfigUser.setValue(this.liveDocConfigFile = config) 
  });


  destinationControl = new FormControl(this.destinations[0]);
  destinationSuggestions = combineLatest([
    of(this.destinations),
    this.destinationControl.valueChanges
  ]).pipe(
    map(([destinations, prefix]) => destinations.filter(destination => destination.includes(prefix)))
  );

  deltaMergeStrategies: DeltaMergeStrategy[] = [
    {label: 'Show Diff', function: (last: any, next: any) => 'Diff' ? next : last},
    {label: 'Show Grow', function: (last: any, next: any) => 'Grow' ? next : last},
    {label: 'Show Change', function: (last: any, next: any) => 'Change' ? next : last},
    {label: 'Show Average', function: (last: any, next: any) => 'Average' ? next : 0}
  ];
  chosenStrategy = new FormControl();

  unsubscribeOthersControl = new FormControl();
  beepControl = new FormControl();

  updateLiveDocConfig(configText: string) {
    const userConfig = JSON.parse(configText);

    // The really awkward line below is to make testing easier
    (this.liveDocService as any).livedocConfigLoaderService.newConfig.next(userConfig);
  }

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

    console.log("Headers", headers);
    console.log("deltaHandlingStrategy", deltaHandlingStrategy);
    if ( unsubscribeOthers ) { this.unsubscribeAll.next(); }

    const range = destinationWithDelta.match(/^(.*?)(\d+)~(\d+)(.*)$/);
    if ( range ) {
      const prefix = range[1];
      const start = +range[2];
      const end = +range[3];
      const suffix = range[4];
      for (let i = start; i <= end; ++i) {
        const destination = prefix + i + suffix;
        this.newSubscription(destination, deltaHandlingStrategy, headers);
      }
    } else {
      this.newSubscription(destinationWithDelta, deltaHandlingStrategy, headers);
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
      headers: Object.entries(headers || {}).map(([key, value]) => key + ' : ' + value).join(';   ') || null,
      deltaMerge: deltaHandlingStrategy && deltaHandlingStrategy.label
    });
    console.groupEnd();



    const card: LiveDocCard = {
      destination,
      data: null,
      headers,
      // url: ;
      strategy: deltaHandlingStrategy && deltaHandlingStrategy.label || '',
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
      deltaHandlingStrategy: deltaHandlingStrategy && deltaHandlingStrategy.function
    });
    const subscription = stream.pipe(
      takeUntil(this.unsubscribeAll)
    ).subscribe({
      next: data => {
        
        card.data = JSON.stringify(data, null, 2);
        card.updates++;
        card.lastData = new Date();
        card.state = 'Connected';

        //console.log("Data Received",JSON.stringify(data, null, 2));

        switch(this.eventType)
        {
          case EVENT_TYPE.HOME_FEED:

            
            

          break;

          case EVENT_TYPE.ODDS_FEED:
            //console.log("Data Count")
            this.oddsEventData = JSON.parse(JSON.stringify(data, null, 2));
            console.log("Live Data from Odds Feed", this.oddsEventData);
            // const raw = this.mainEventData

            // console.log("testsets >>...", raw?.participants[0][0])
            // this.homeTeam = this.mainEventData.participants[0][0]?.name;
            // this.awayTeam = this.mainEventData.participants[0][1]?.name;
            // this.gameTime = this.mainEventData.anticipated.startTime.split("T")[1].substring(0, 5);
          break;
        }

        
      },
      error: e => {
        card.terminated = new Date();
        card.state = 'Error';
        //this.rippleCard(card, 'rgba(255, 0, 0, 0.2)');
        ++this.staleCardCount;
      },
      complete: () => {
        card.terminated = new Date();
        card.state = 'Unsubscribed';
        ++this.staleCardCount;
      }
    });

    card.subscription = subscription;

    //this.liveDocCards.unshift(card);

  }

  // loadHomeEvents(data: EventData) {
  //   this.eventType = EVENT_TYPE.EVENT_FEED;
  //   this.subscribeAllDestinations(`${this.eventsFeedLink}${data.id}`, null, this.headers, false);
  // }

  unsubscribeCard(card: LiveDocCard) {
    card.subscription.unsubscribe();
    this.staleCardCount++;
    card.state = 'Unsubscribed';
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
}
