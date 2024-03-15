import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-insufficient-funds',
  templateUrl: './insufficient-funds.component.html',
  styleUrls: ['./insufficient-funds.component.css']
})
export class InsufficientFundsComponent {
  @Output ('close') closeWindowEvent = new EventEmitter()

  closeWindow(){
    this.closeWindowEvent.emit();
  }
}
