import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { BettingService } from '../../services/betting-service';
import { Subscription } from 'rxjs';


interface ApiResponse {
  status: string;
  message_key?: string;
}
@Component({
  selector: 'app-phone-footer', 
  templateUrl: './phone-footer.component.html', 
  styleUrls: ['./phone-footer.component.css'], 
})
export class PhoneFooterComponent implements OnInit {
betSlipList: any[];
  totalOdds: number;
  storedData :any;

  isVisible: boolean = false;
  isLoggedIn: boolean = true;
  private betSlipListSubscription: Subscription;
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  constructor(private http: HttpClient, private router: Router,private loaderService: LoaderService, private bettingService : BettingService) {
    this.storedData = localStorage.getItem('accessToken');
  }

  ngOnInit(): void {
    this.storedData = localStorage.getItem('accessToken');
    this.betSlipList = this.bettingService.getBetSlipList();
   
       // Or subscribe to the observable for real-time updates
       this.betSlipListSubscription = this.bettingService.betSlipListObservable.subscribe((list) => {
         this.betSlipList = list;
         console.log("Bet Slip List: ", this.betSlipList);
         this.calculateTotalOdds(this.betSlipList);
        //  console.log('this.totalOdds', this.totalOdds)
       });
  }

 ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    this.betSlipListSubscription.unsubscribe();
  }

  onBetslipClick() {
    this.loaderService.toggleVisibility();
    // console.log("Bet Slip List: ", this.betSlipList);
  }

  calculateTotalOdds(betSlipList) {
    let subTotal = 0;
    betSlipList.forEach((data) => {
      subTotal += parseFloat(data.price.dec);
    });
    this.totalOdds = parseFloat(subTotal.toFixed(2));
  }
 
}
