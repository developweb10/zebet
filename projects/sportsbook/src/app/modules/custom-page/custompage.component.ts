import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomPageService } from './custompage.service';
@Component({
  selector: 'app-custompage',
  templateUrl: './custompage.component.html',
  styleUrls: ['./custompage.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
  ],
 
})
export class custompageComponent implements OnInit {

  customPageData: any;

  constructor(private customPageService: CustomPageService) { }

  ngOnInit(): void {
    this.fetchCustomPageData();
  }

  fetchCustomPageData(): void {
    this.customPageService.getCustomPageData().subscribe(
      (data) => {
        this.customPageData = data;
        console.log("Custom Page Data:", this.customPageData);
      },
      (error) => {
        console.error('Error fetching custom page data:', error);
      }
    );
  }
}


