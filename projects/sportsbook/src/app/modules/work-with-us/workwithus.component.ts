import { Component, OnInit } from '@angular/core';
import { WorkWithUsService } from './service/workwithus.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommonModule } from '@angular/common'; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './workwithus.component.html',
  styleUrls: ['./workwithus.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class WorkWithUsComponent implements OnInit {
  workwithus: any;
  data: any[] = [];
  sanitizedHtml!: SafeHtml;
  searchText: string = '';
  carriersData: any[] = []; // Store the carriers data
  ASSETS_URL = environment.ASSETS_URL;

  constructor(
    private workwithusService: WorkWithUsService,
    private sanitizer: DomSanitizer,
    
  ) {}

  ngOnInit(): void {
    // Calling getWorkWithUs method to fetch work with us data
    this.workwithusService.getWorkWithUs().subscribe((data) => {
      this.workwithus = data.data;
      const apiHtml = this.workwithus.htmlContent;
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(apiHtml);
      console.log(this.workwithus);
    });

    // Calling getCarriers method to fetch carriers data
    this.workwithusService.getCarriers().subscribe((carriersData) => {
      // Store the entire carriers data array
      this.carriersData = carriersData.data;
      console.log('Carriers Data:', this.carriersData);
    });
  }
}
