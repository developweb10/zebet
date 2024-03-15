import { Component, OnInit } from '@angular/core';
import { AboutService } from './service/about.service';
import { DomSanitizer, Meta, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
})
export class AboutComponent implements OnInit {
  aboutData: any; 
  metaData: any[];
  sanitizedHtml!: SafeHtml;
  ASSETS_URL = environment.ASSETS_URL;

  constructor(private aboutService: AboutService, private sanitizer: DomSanitizer, private metaService: Meta) {}

  ngOnInit(): void {
    
    this.aboutService.getAboutUs().subscribe((data) => {
      this.aboutData = data.data;
      const apiHtml = this.aboutData.htmlContent;
      this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(apiHtml);
      console.log(this.aboutData)
    });
    
  }
}
