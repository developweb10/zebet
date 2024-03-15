import { Component, OnInit } from '@angular/core';
import { CustomPageService } from '../custompage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  customPageData: any;
  title :string = '';
  constructor(private customPageService: CustomPageService, private router : Router) { }

  ngOnInit(): void {
    console.error(this.router.url);
    this.title = this.getTitle();
    this.fetchCustomPageData();
  }
  getTitle(){
    const urlList = this.router.url.split('/')
    return urlList[urlList.length -1];
  }

  fetchCustomPageData(): void {
    this.customPageService.getPageData(this.title).subscribe(
      (data) => {
        this.customPageData = data;
        // this.customPageData.data = this.customPageData.data?.filter((x) => {return x.title == this.title});
        // console.log(" Page Data:", this.customPageData);
      },
      (error) => {
        console.error('Error fetching custom page data:', error);
      }
    );
  }
}


