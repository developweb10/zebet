import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
// import { ZbetLeagueComponent } from '../../shared/zbet-league/zbet-league.component';
// import { MatDialog } from '@angular/material/dialog';

const SORT_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18.5 2C17.963 2 17.5277 2.44772 17.5277 3V15.5H15.9738C15.2253 15.5 14.7575 16.3333 15.1317 17L17.6579 21.5C18.0322 22.1667 18.9678 22.1667 19.3421 21.5L21.8683 17C22.2425 16.3333 21.7747 15.5 21.0262 15.5H19.4723V3C19.4723 2.44772 19.037 2 18.5 2Z" fill="#A3A7AA"/>
  <path d="M2 3C2 2.44772 2.44772 2 3 2H15C15.5523 2 16 2.44772 16 3C16 3.55228 15.5523 4 15 4H3C2.44772 4 2 3.55228 2 3Z" fill="#A3A7AA"/>
  <path d="M2 7C2 6.44772 2.44772 6 3 6H14C14.5523 6 15 6.44772 15 7C15 7.55228 14.5523 8 14 8H3C2.44772 8 2 7.55228 2 7Z" fill="#A3A7AA"/>
  <path d="M2 11C2 10.4477 2.44772 10 3 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H3C2.44772 12 2 11.5523 2 11Z" fill="#A3A7AA"/>
  <path d="M2 15C2 14.4477 2.44772 14 3 14H12C12.5523 14 13 14.4477 13 15C13 15.5523 12.5523 16 12 16H3C2.44771 16 2 15.5523 2 15Z" fill="#A3A7AA"/>
  <path d="M2 19C2 18.4477 2.44772 18 3 18H11C11.5523 18 12 18.4477 12 19C12 19.5523 11.5523 20 11 20H3C2.44772 20 2 19.5523 2 19Z" fill="#A3A7AA"/>
</svg>
`;
@Component({
  selector: 'app-virtuals',
  templateUrl: './virtuals.component.html',
  styleUrls: ['./virtuals.component.css'],
})
export class VirtualsComponent {

  topVirtuals = [
    { name: 'ZEBET LEAGUE', image: '../../../assets/img/virtual 1.png' },
    { name: 'DOG RACES', image: '../../../assets/img/virtual 2.png' },
    { name: 'VIRTUAL SOCCER', image: '../../../assets/img/virtual 3.png' },
    { name: 'HORSE RACES', image: '../../../assets/img/virtual 4.png' },
    // {
    //   name: 'FASTLEAGUE FOOTBALL LEAGUE MATCH',
    //   image: '../../../assets/img/virtual 5.png',
    // },
  ];
  topVirtuals1 = [
    { name: 'ZEBET LEAGUE', image: '../../../assets/img/virtual 1.png' },
    { name: 'DOG RACES', image: '../../../assets/img/virtual 2.png' },
    { name: 'VIRTUAL SOCCER', image: '../../../assets/img/virtual 3.png' },
    { name: 'HORSE RACES', image: '../../../assets/img/virtual 4.png' },
    {
      name: 'FASTLEAGUE FOOTBALL LEAGUE MATCH',
      image: '../../../assets/img/virtual 5.png',
    },
    { name: 'ZEBET LEAGUE', image: '../../../assets/img/virtual 1.png' },
    { name: 'DOG RACES', image: '../../../assets/img/virtual 2.png' },
    { name: 'VIRTUAL SOCCER', image: '../../../assets/img/virtual 3.png' },
    { name: 'HORSE RACES', image: '../../../assets/img/virtual 4.png' },
    {
      name: 'FASTLEAGUE FOOTBALL LEAGUE MATCH',
      image: '../../../assets/img/virtual 5.png',
    },
    { name: 'ZEBET LEAGUE', image: '../../../assets/img/virtual 1.png' },
    { name: 'DOG RACES', image: '../../../assets/img/virtual 2.png' },
    { name: 'VIRTUAL SOCCER', image: '../../../assets/img/virtual 3.png' },
    { name: 'HORSE RACES', image: '../../../assets/img/virtual 4.png' },
    {
      name: 'FASTLEAGUE FOOTBALL LEAGUE MATCH',
      image: '../../../assets/img/virtual 5.png',
    },
  ];

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router
    // private dialog: MatDialog
  ) {
    iconRegistry.addSvgIconLiteral(
      'sort',
      sanitizer.bypassSecurityTrustHtml(SORT_ICON)
    );
  }

  // openModal() {
  //   const dialogRef = this.dialog.open(ZbetLeagueComponent, {
  //     height: 'auto',
  //     width: '1550px',
  //     panelClass: 'z-bet-league-panel',
  //     maxWidth: '90vw',
  //   });
  // }

  backToHome() {
    this.router.navigate(['sports-book/football']);
  }
}
