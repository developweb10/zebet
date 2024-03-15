
import { AfterViewChecked, Component, Input, QueryList, TemplateRef, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-na-lock',
  templateUrl: './na-lock.component.html',
  styleUrls: ['./na-lock.component.css']
})
export class NaLockComponent {
  @Input() type ?: string;
}
