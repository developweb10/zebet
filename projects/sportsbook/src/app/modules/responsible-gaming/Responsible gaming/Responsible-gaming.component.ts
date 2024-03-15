import { Component, OnInit } from '@angular/core';
import { ResponsibleGamingService } from './Responsible-gaming.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-Responsible-gaming',
  templateUrl: './Responsible-gaming.component.html',
  styleUrls: ['./Responsible-gaming.component.css'],
})
export class ResponsibleGamingComponent implements OnInit {
  responsibleGamingData: any;
  sanitizedHtml!: SafeHtml;
  terms_list: any[] = [];


  constructor(private tncService: ResponsibleGamingService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getResponsibleGaming();
  }
  
  getResponsibleGaming(): void {
    this.tncService.getResponsibleGaming().subscribe(
      (response: any) => {
        this.responsibleGamingData = response.data;

       
        if (this.responsibleGamingData?.terms_list) {
          this.terms_list = this.responsibleGamingData.terms_list;
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
       
      }
    );
  }
}