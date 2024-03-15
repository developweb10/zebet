import { Component, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { combineLatest, of, Subject, Subscription } from 'rxjs';
import { map, takeUntil, filter, catchError } from 'rxjs/operators';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { liveDocConfigValidator } from '../../helpers/livedoc-config-validator';
import { LiveDocService, StompHeaders, LiveDocConfig, LiveDocConfigLoaderService } from '@livedoc';
import { StompSenderComponent } from '../../components/stomp-sender/stomp-sender.component';
import { StompSenderIO } from '../../components/stomp-sender/stomp-sender.interface';

import { BeeperService } from '../../beeper.service';
import { AuthMockService } from '../../auth-fnc.service';
import { StompTokensDialogComponent } from '../stomp-tokens-dialog/stomp-tokens-dialog.component';
import { APP_LIVEDOC_SETTINGS } from '../../app.settings';

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
  selector: 'reader-stomp-tester',
  templateUrl: './stomp-tester.component.html',
  styleUrls: ['./stomp-tester.component.scss'],
  animations: [
    trigger('comeAndGo', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate3d(0, -400px, 0)',
        }),
        animate('500ms ease', style({
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
        }))
      ]),
      transition(':leave', [
        animate('500ms ease-out', style({
          opacity: 0,
          transform: 'translate3d(0, 400px, 0)',
        }))
      ])
    ])
  ]
})
export class StompTesterComponent {

  constructor(
    public liveDocService: LiveDocService,
    public liveDockConfigMockLoader: LiveDocConfigLoaderService,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private beeper: BeeperService,
    private auth: AuthMockService,
  ) {
    console.log('Generating first authentication token automatically for secure sockets');
    // auth.newToken(
    //   'DEFAULT TOKEN: This tester application generates first token automatically, ' +
    //   'otherwise subscriptions to secure sockets would wait for the token'
    // );
  }

  @ViewChildren(MatRipple) ripples: QueryList<MatRipple>;

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

  liveDocCards: LiveDocCard[] = [];
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

  rippleCard(card: LiveDocCard, color?: string) {
    const cardIndex = this.liveDocCards.findIndex(c => c === card);
    if ( cardIndex > -1 ) {
      const ripple = this.ripples.find((r, i) => i === cardIndex);
      if ( ripple ) {
        ripple.launch({
          centered: Math.random() < .5,
          color
        });
      }
    }
  }

  subscribeAllDestinations(
    destinationWithDelta: string,
    deltaHandlingStrategy?: DeltaMergeStrategy,
    headers?: StompHeaders,
    unsubscribeOthers?: boolean
  ) {

    console.log("Headers", headers);
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
        this.rippleCard(card, 'rgba(0, 0, 255, 0.2)');
        if ( this.beepControl.value ) { this.beeper.beep(); }
      },
      error: e => {
        card.terminated = new Date();
        card.state = 'Error';
        this.rippleCard(card, 'rgba(255, 0, 0, 0.2)');
        ++this.staleCardCount;
      },
      complete: () => {
        card.terminated = new Date();
        card.state = 'Unsubscribed';
        ++this.staleCardCount;
      }
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
    this.liveDocCards = this.liveDocCards.filter(candidate => candidate !== card);
  }

  removeAll() {
    this.unsubscribeAll.next();
    this.liveDocCards = [];
    this.staleCardCount = 0;
  }

  removeStale() {
    this.liveDocCards = this.liveDocCards.filter(card => card.state === 'Connecting' || card.state === 'Connected');
    this.staleCardCount = 0;
  }

  send() {
    this.dialog.open<StompSenderComponent, StompSenderIO, StompSenderIO>(StompSenderComponent, {
      data: {
        destination: this.destinationControl.value,
        headers: this.headers,
        body: ''
      },
      disableClose: true
    }).afterClosed().pipe(
      filter(reply => !!reply)
    ).subscribe(reply => this.liveDocService.send(reply));
  }

  loadNewConfig(newConfig: string) {
    this.liveDockConfigMockLoader.newConfig.next(JSON.parse(newConfig));
  }

  newToken() {
    this.dialog.open<StompTokensDialogComponent, any, string>(StompTokensDialogComponent).afterClosed().pipe(
      filter( reply => !!reply)
    ).subscribe(token => this.auth.newToken(token));
  }

}

