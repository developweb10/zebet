import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationComponent } from './notification/notification';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [HeaderComponent, NotificationComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgSelectModule,
    FormsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
