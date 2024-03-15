import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sports-button',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsButtonComponent {

  @Input() default: boolean = false;
  @Input() gameCategory: string = "";
}
