import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.css'],
})
export class HelpMenuComponent {
  @Input() title: string;

}
