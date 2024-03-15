import { Component } from '@angular/core';

@Component({
  selector: 'app-a-z-menu',
  templateUrl: './a-z-menu.component.html',
  styleUrls: ['./a-z-menu.component.css'],
})
export class AZMenuComponent {

  selectedMenu = 1;
  footerMenuClick(id: number) {
    this.selectedMenu = id;
  }
}
