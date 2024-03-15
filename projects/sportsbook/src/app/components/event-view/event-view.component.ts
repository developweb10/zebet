import { Component, Input } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { HttpClient } from '@angular/common/http';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '../../../environments/environment';
import { BettingService } from '../../services/betting-service';
import { ActivatedRoute } from '@angular/router';
import { AuthFNCService } from '../../auth-fnc.service';
import { SharedService } from '../../services/shared.service';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DemoBettingService } from '../../services/demo-betting-service';
import { SearchMenuService } from '../../services/search-menu.service';
@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent {
  hideSearchMenu: boolean = true;
  displayBetSlip: boolean = false;
  showInitialContent: boolean = true;
  items: any;
  timmer: any;
  eventId: string;
  AssetsUrl = environment.ASSETS_URL;
  betslipShow: boolean = false;
  customOptionsSports: OwlOptions = {};
  eventData: any;
  data: any;
  buttons: any[]
  betBasketData: any;
  @Input() isJustify: boolean = false;
  @Input() isDarkBg: boolean = false;
  marketTabs = ['ALL', 'MAIN', 'GOALS'];
  scoreTabs = ['SLIDER', 'ALL'];

  constructor(private auth: AuthFNCService, private sharedService: SharedService, private route: ActivatedRoute,
    public searchMenuService: SearchMenuService,
    public demoService: DemoBettingService,
    private loaderService: LoaderService, private bettingService: BettingService, private http: HttpClient) {
    this.loaderService.show();
    const betsipVisibility = this.loaderService.getBetslipVisibility();
    console.log('Betslip Visibility:', betsipVisibility);
    this.bettingService.data$.subscribe(data => {
      console.log(data, "search results");
      this.data = data
    });

    // auth.newToken(
    //   'DEFAULT TOKEN: This tester application generates first token automatically, ' +
    //   'otherwise subscriptions to secure sockets would wait for the token'
    // );

    if (!localStorage.getItem("a-z_menu")) {
      combineLatest([
        this.getAllSports(),
        this.getAllSportsV2()
      ]).subscribe(data => {
        console.log("Menu Data", data)
        localStorage.setItem("a-z_menu", JSON.stringify(data))
      })
    }
  }
  
  getAllSports() {
    return this.demoService.getSports()
  }

  getAllSportsV2() {
    return this.demoService.getSports()
    .pipe(
      
      map((sports) => Object.values(sports)),
      switchMap((sports: any[]) => {

        let Ob$ = [];
        sports.map((sport: any) => {
          Ob$.push(this.searchMenuService.getCompetitionsBySport(sport.id) 
          )
          
        })
        
        return combineLatest(Ob$
        ).pipe()  
      }
       
      )
    )
    
  }

  toggleMenu(menuItem: string) {
    if (menuItem == 'A to Z Menu') this.hideSearchMenu = false;
    if (menuItem == 'Betslip') this.displayBetSlip = true;
  }
  toggleSearchMenu(menuItem: boolean) {
    // this.hideSearchMenu = true;
  }
  ngAfterViewInit() {
    setTimeout(() => this.loaderService.hide(), 1000);
  }
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
  ngOnInit() {
    this.performOddOperation;
    this.fetchData();
    console.log('AssetsUrl', this.AssetsUrl);
    this.loaderService.BetslipIsVisible$.subscribe((isVisible) => {
      console.log('Betslip Visibility:', isVisible);
      this.betslipShow = isVisible;
    });

    this.route.params.subscribe(eachParam => {
      if (eachParam['event']) {
        this.eventId = eachParam['event'];
      } else {
        this.eventId = '';
      }
     
      // Do more processing here if needed
    });
    
  }

  fetchData() {
    const url = `${this.AssetsUrl}items/2nd_slider_banner_menu`;

    this.http.get(url).subscribe((data: any) => {
      this.items = data.data;
      this.timmer = data.data;
      this.buttons= data.data.buttons;
      console.log("second banner",  this.items)  
      this.customOptionsSports = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        autoplay:true,
        dots: false,
        autoplayTimeout:this.calculateAutoplayTimeout(),
        navSpeed: 700,
        items: 1,
        responsive:{
          0:{
            items:1
          },
          768:{
            items:1
          }
        },
        autoWidth: true,
        navText: ['<img src="assets/img/arrow-left.png">', '<img src="assets/img/arrow-right.png">'],
        nav: true
      }
    }, (error) => {
      // Handle any errors
      console.error('An error occurred:', error);
    });
  }

  selectedItems: { textValue: string, teamName: string }[] = [];

  performOddOperation(label: string) {
    const item = this.items.find((dataItem) => {
      const matchingButton = dataItem.buttons.find((btn) => btn.label === label);
      return matchingButton !== undefined;
    });
  
    if (item) {
      if (label === 'x') {
        const matchingButton = item.buttons.find((btn) => btn.label === label);
        if (matchingButton) {
          const textValue = matchingButton.text;
          // this.sharedService.updateButtonText(textValue);
          // this.sharedService.updateTeamName('Draw');
          console.log('Text Value for Draw:', textValue);
          console.log('Draw Selected');
  
          // Store the selection
          this.selectedItems.push({ textValue, teamName: 'Draw' });
        } else {
          console.error('Button not found in the buttons array for label "x".');
        }
      } else {
        const teamName = label === '1' ? item.team_1_name : label === '2' ? item.team_2_name : '';
        const team = item.team_1_name;
        const secondTeam = item.team_2_name;
        
        if (teamName) {
          const matchingButton = item.buttons.find((btn) => btn.label === label);
          if (matchingButton) {
            const textValue = matchingButton.text;
            // this.sharedService.updateButtonText(textValue);
            // this.sharedService.updateTeamName(teamName);
            // this.sharedService.updateTeam(team);
            // this.sharedService.updateSecondTeam(secondTeam);
            console.log('Text Value:', textValue);
            console.log('Team Name:', teamName);
  
            // Store the selection
            this.selectedItems.push({ textValue, teamName });
          } else {
            console.error('Button not found in the buttons array for label ' + label + '.');
          }
        } else {
          console.error('Team name not found for the selected button.');
        }
      }
    } else {
      console.error('Data for the selected button not found.');
    }
  }
  
  sendTeamName(teamName: string) {
    // Implement the logic to send team name to another component or service
    console.log('Sending team name:', teamName);
    // You can use a service to send data to another component or perform any other action
  }

  sendDraw() {
    // Implement the logic to handle draw
    console.log('Draw');
    // You can use a service to send data to another component or perform any other action
  }

 
  calculateAutoplayTimeout(): number {
    // Sum up the timmer values and convert to milliseconds
    const totalAutoplayTimeInMilliseconds = this.timmer.reduce((total, banner) => {
      const timmerInSeconds = parseInt(banner.timmer,10);
    
      return timmerInSeconds*1000 ; // Convert seconds to milliseconds
    }, 0);

    return totalAutoplayTimeInMilliseconds;
  }

  onDataReload(reloadedData: any) {
    // Handle the reloaded data here
    this.data = reloadedData;
  }
  
}