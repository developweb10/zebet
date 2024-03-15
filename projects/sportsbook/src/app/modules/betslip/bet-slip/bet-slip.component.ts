import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { Selection } from '../../../dto/odd-data.dto';
import { BETSLIP_TAB } from '../../../util/enum';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../../util/local-storage.service';
import { BetslipService } from '../../../services/betslip-service';
import('preline')

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.css']
})
export class BetSlipComponent implements OnInit {

  @Output() hideBetSlip = new EventEmitter();
  tab:string='All';
  stakeAmount = 0;
  stakeAmountSingle = 0;
  potentialWinning: any = 0;
  betslipTab: BETSLIP_TAB = BETSLIP_TAB.ACCA;

  betSlip: Selection[] = [];
  betSlipLoader: Selection[] = [];
  totalOdds: number = 0;
  firstTab:string='Open Bets(0)';
  singleBetslipForm: FormGroup; 
  
  _localStorageService = inject(LocalStorageService);

  constructor(private bettingService: BetslipService, private fb:FormBuilder) {
    this.singleBetslipForm = this.fb.group({   
      betslipItems: this.fb.array([]) ,  
    });  
  }

  initializeForm() {
    const formControls = this.betSlip.map((game) => {
      return this.fb.control(''); // You can initialize it with a default value if needed
    });

    this.singleBetslipForm = this.fb.group({
      betslipItems: this.fb.array(formControls),
    });
  }
  

  ngOnInit(): void {
    let betSlipLoader: Selection[] = [];
    this.bettingService.betbasket.subscribe((value) => {
      betSlipLoader = value;
      console.log("Betslip Data", betSlipLoader);
      this.calculateTotalOdds(betSlipLoader);
      this.betSlip = betSlipLoader;
    });

    this.betSlip = betSlipLoader;
  }

  get betslips() : FormArray {  
    return this.singleBetslipForm.get("betslipItems") as FormArray ;
  }  

  onFirstTabClick(tab:string) {
    this.firstTab = tab;
  }  
  placeBet() {
    console.log(this.betslips.value);
  }

  populateGames() {
    let game = {};

    if(this.betslips.length == 0)
    {
      //this.betslips.clear();

      this.betSlip.forEach(element => {
        game = new FormControl('');
        this.betslips.push(game);
      });
    }
    
    
    console.log(this.betslips.value);
  }

  onKeyUp(x) { // appending the updated value to the variable
    console.log(x.target.value);
    if(x.target.value)
      this.stakeAmount = parseInt(x.target.value);
    else 
      this.stakeAmount = 0;
    this.calculatePotentialWinning();
  }

  onKeyUpSingle(x) { // appending the updated value to the variable
    console.log(x.target.value);
    this.potentialWinning = 0;
    this.stakeAmount = 0;
    this.betslips.controls.forEach((element, index) => {
      console.log("Index",  this.betSlip[index])
      if(element.value)
      {
        this.stakeAmountSingle = parseInt(element.value);
        this.stakeAmount += this.stakeAmountSingle;
      } 
      else 
        this.stakeAmountSingle = 0;

        this.calculatePotentialWinningSingle(this.stakeAmountSingle, this.betSlip[index].price.dec);
    });
    // if(x.target.value)
    //   this.stakeAmountSingle = parseInt(x.target.value);
    // else 
    //   this.stakeAmountSingle = 0;
    
  }

  removeGame(index: number) {
    //this.betslips.removeAt(index);
    //console.log(this.betslips.value);
    this.bettingService.deleteToBetSlip(this.betSlip[index]);

    this.betslips.removeAt(index);

    this.potentialWinning = 0;
    this.stakeAmount = 0;
    this.betslips.controls.forEach((element, index) => {
      console.log("Index",  this.betSlip[index])
      if(element.value)
      {
        this.stakeAmountSingle = parseInt(element.value);
        this.stakeAmount += this.stakeAmountSingle;
      } 
      else 
        this.stakeAmountSingle = 0;

        this.calculatePotentialWinningSingle(this.stakeAmountSingle, this.betSlip[index].price.dec);
    });
  }

  calculateTotalOdds(betslip: Selection[])
  {
    let subTotal = 0;
    betslip.forEach(data => {
      subTotal += parseFloat(data.price.dec);
    })

    this.totalOdds = parseFloat(subTotal.toFixed(2));
  }

  display(){
    this.hideBetSlip.emit()
  }

  onTabClick(tab:string) {
    this.tab = tab;

    this.potentialWinning = 0;
    this.stakeAmount = 0;

    if(tab == "Single")
    {
      this.populateGames();
      console.log("Potential Winnings", this.potentialWinning);
    } 
    else if(tab == "ACCA")
      this.calculatePotentialWinning();
  }  

  setStakeAmount(amount: number) {
    this.stakeAmount += amount;
    this.calculatePotentialWinning();
  }

  clearBetSlip() {
    this.bettingService.clearBetSlip();
    this.totalOdds = 0;
    this.stakeAmount = 0;
    this.calculatePotentialWinning();
  }

  calculatePotentialWinning() {
    this.potentialWinning = (this.stakeAmount * this.totalOdds).toFixed(2);
  }

  calculatePotentialWinningSingle(amount, odds) {
    let winning: number = parseFloat(this.potentialWinning);
    console.log("Potential Winning Old", winning);
    winning += (amount * odds);
    this.potentialWinning = winning.toFixed(2);
    console.log("Potential Winning New", this.potentialWinning);
  }
  copyText(value: string) {
    this.copyToClipboard(value);
  }

  copyToClipboard(value: string) {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Text copied to clipboard: ' + value);
  }


}
