import { Component, OnInit } from '@angular/core';
import { PrivacyPolicyService } from './service/privacy-policy.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
  ],
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicyData: any
  list: any[] = [];
  sanitizedHtml!: SafeHtml;

  constructor(private privacyPolicyService: PrivacyPolicyService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getPrivacyPolicy();
  }
  
  getPrivacyPolicy(): void {
    this.privacyPolicyService.getPrivacyPolicy().subscribe((data:any) => {
      this.privacyPolicyData = data.data;
      console.log("123456789012345678",this.privacyPolicyData)
      if(this.privacyPolicyData?.list){
        this.list = this.privacyPolicyData.list;
        console.log("7890",this.list)
      }
    },
      (error:any)=>{
        console.error('Error fetching data:', error);
      }
    );
  }
  
}


