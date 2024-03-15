import { Component } from '@angular/core';
import { DateLoader } from './date-loader';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {

  calendarDates: number[] = [];
  calendarDateLoaders: DateLoader[] = [];
  selectedDate: Date;
  formattedDate: string;
  showFilterModal = true;
  currdate: string;

  date = new Date();
  year = this.date.getFullYear();
  month = this.date.getMonth();
 
  cal = "";
 
// Array of month names
 months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

  constructor() {
    // for (let i = 1; i <= 30; i++) {
    //   this.calendarDates.push(i);
    // }

    this.manipulate();
    //this.selectDate(25);
  }

  selectDate(date: DateLoader) {

    this.selectedDate = new Date(date.year, date.month, date.day);
    const day = this.selectedDate.getDate();
    const month = this.selectedDate.toLocaleString('default', {
      month: 'short',
    });
    const year = this.selectedDate.getFullYear();

    this.formattedDate = `${day}th ${month} ${year}`;
    //alert(this.formattedDate)
  }

  isDateActive(date: DateLoader) {
    if (this.selectedDate) {
      const selected = this.selectedDate.getDate();
      return date.day === selected;
    }
    return false;
  }

  manipulate() {

    this.calendarDateLoaders = [];
  
    // Get the first day of the month
    let dayone = new Date(this.year, this.month, 1).getDay();
    //alert(dayone)
 
    // Get the last date of the month
    let lastdate = new Date(this.year, this.month + 1, 0).getDate();
 
    // Get the day of the last date of the month
    let dayend = new Date(this.year, this.month, lastdate).getDay();
 
    // Get the last date of the previous month
    let monthlastdate = new Date(this.year,this. month, 0).getDate();
 
    // Variable to store the generated calendar HTML
    let lit = "";
 
    // Loop to add the last dates of the previous month
    for (let i = dayone; i > 0; i--) {
        lit +=
            `<div class="calendar-day">${monthlastdate - i + 1}</div>`;
            this.calendarDates.push(monthlastdate - i + 1 );
            this.calendarDateLoaders.push({
              day: monthlastdate - i + 1,
              month: this.month - 1,
              year: this.year
            });
    }
 
    // Loop to add the dates of the current month
    for (let i = 1; i <= lastdate; i++) {
 
        // Check if the current date is today
        let isToday = i === this.date.getDate()
            && this.month === new Date().getMonth()
            && this.year === new Date().getFullYear()
            ? true
            : false;
        lit += `<div class="calendar-day active">${i}</div>`;
        this.calendarDates.push(i);

        this.calendarDateLoaders.push({
          day: i,
          month: this.month,
          year: this.year
        })

        if(isToday)
        this.selectDate({
          day: i,
          month: this.month,
          year: this.year
        });
    }
 
    // Loop to add the first dates of the next month
    for (let i = dayend; i < 6; i++) {
        lit += `<div class="calendar-day">${i - dayend + 1}</div>`
        this.calendarDates.push(i - dayend + 1);

        this.calendarDateLoaders.push({
          day: i - dayend + 1,
          month: this.month + 1,
          year: this.year
        })
    }
 
    // Update the text of the current date element 
    // with the formatted current month and year
    this.currdate = `${this.months[this.month]} ${this.year}`;
 
    // update the HTML of the dates element 
    // with the generated calendar
    //this.cal = lit;
  }

  navigateTo(nav) {
    // Check if the icon is "calendar-prev"
        // or "calendar-next"
        this.month = nav === "previous" ? this.month - 1 : this.month + 1;
 
        // Check if the month is out of range
        if (this.month < 0 || this.month > 11) {
 
            // Set the date to the first day of the 
            // month with the new year
            this.date = new Date(this.year, this.month, new Date().getDate());
 
            // Set the year to the new year
            this.year = this.date.getFullYear();
 
            // Set the month to the new month
            this.month = this.date.getMonth();
        }
 
        else {
 
            // Set the date to the current date
            this.date = new Date();
        }
 
        // Call the manipulate function to 
        // update the calendar display
        this.manipulate();
  }
}
