import { Component, OnInit } from '@angular/core';
import { SportsBettingRuleService } from './service/Sportsbettingrule.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tnc',
  templateUrl: './Sportsbettingrule.component.html',
  styleUrls: ['./Sportsbettingrule.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
  ],
 
})
export class SportsBettingRuleComponent implements OnInit {
  sportsBettingRuleServiceData: any
  list: any[]=[];
  sanitizedHtml!: SafeHtml;
 

  constructor(private sportsBettingRuleService: SportsBettingRuleService, private sanitizer: DomSanitizer,private router: Router) { }

  ngOnInit(): void {
    this.getSportsBettingRule();
  }
  
  getSportsBettingRule(): void {
    this.sportsBettingRuleService.getSportsBettingRule().subscribe((data:any) => {
      this.sportsBettingRuleServiceData = data.data;
      if(this.sportsBettingRuleServiceData?.list){
        this.list = this.sportsBettingRuleServiceData.list;
      }
    },
      (error:any)=>{
        console.error('Error fetching data:', error);
      }
    );
  }
  navigateToCustomPage(): void {
    window.open('page', '_blank');
  }
  
  
  }


