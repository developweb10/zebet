import { Component, Input } from "@angular/core";

@Component({
    selector: 'bethistory-date-formatter',
    template: `
      {{ formattedDate }}
  `
  })
  
  class DateFormatter {
    @Input() 
    date: string = "";
    formattedDate: string = "";
  }