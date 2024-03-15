import { Component, OnInit } from '@angular/core';
import { TNCService } from './service/tnc.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrls: ['./tnc.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ],

})
export class TNCComponent implements OnInit {
  tncData: any;
  terms_list: any[] = [];
  sanitizedHtml!: SafeHtml;
  primaryTitle: string = '';
  primaryContent: string = '';


  constructor(private tncService: TNCService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getTNC();
  }


  getTNC(): void {
    this.tncService.getTrem().subscribe(
      (data: any) => {
        this.tncData = data.data;
        this.primaryTitle = data.data.primary_title;
        this.primaryContent = data.data.primary_content;
        console.log("123444444567", this.tncData)
        if (this.tncData && Array.isArray(this.tncData.terms_list)) { // Check if terms_list exists and is an array
          this.terms_list = this.tncData.terms_list;
          console.log("terms_list:", this.terms_list);
        } else {
          console.error('No valid terms_list found in data:', this.tncData);
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }




}