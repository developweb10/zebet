import { Component, OnInit } from '@angular/core';
import { FAQService } from './service/faq.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FAQSearchService } from './service/faq-search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
})
export class FAQComponent implements OnInit {
  faqData: any;
  faqDataLists:any;
  data:any
  lists: any
  sanitizedHtml!: SafeHtml;
  searchTerm: string = '';
  faqSearchData:any;

  constructor(private faqService: FAQService, private sanitizer: DomSanitizer, private faqSearchService: FAQSearchService) {}

  ngOnInit(): void {
    this.getFAQ();
    this.searchFAQ('');
  }


  getFAQ(): void {
    this.faqService.getFAQ().subscribe(
      (data: any) => {
        this.faqData = data;
        this.faqDataLists = this.faqData.lists
        console.log("main", this.faqData);

        if (this.faqData?.data) {
          this.data = this.faqData.data;
          this.lists = data.data.flatMap((item: any) => item.lists);
          console.log("data", this.data);

          // if (this.data?.data?.lists) {
          //   this.lists = this.faqData.data.lists;
          //   console.log("list", this.lists);
          // }
        }
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  searchFAQ(searchTerm: string): void {
    this.faqSearchService.getFAQSearch(searchTerm).subscribe(
      (data: any) => {
        this.faqSearchData = data;
        console.log('API response:', this.faqSearchData);
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
