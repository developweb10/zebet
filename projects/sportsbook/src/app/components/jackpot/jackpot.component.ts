import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jackpot',
  templateUrl: './jackpot.component.html',
  styleUrls: ['./jackpot.component.css']
})
export class JackpotComponent {
  constructor(private router: Router) {}
  backToHome() {
    this.router.navigate(['sports-book/FBL']);
  }
}
