import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/contact-us.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class ContactUsComponent implements OnInit {
  [x: string]: any;
  contactUsData: any;
  cards: any[] = [];
  formData = {
    first_name: '',
    last_name: '',
    email: '',
    message: ''
  }
  ASSETS_URL = environment.ASSETS_URL;

  constructor(private apiService: ApiService, private http: HttpClient) { }



  ngOnInit(): void {
    this.apiService.getContactUsData().subscribe(data => {
      this.contactUsData = data.data;
      this.cards = data.data.cards;
    });
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      console.log('Form submitted');
      const apiUrl = this.ASSETS_URL + 'items/contact_form_response';

      this.http.post(apiUrl, this.formData).subscribe((response: any) => {
        console.log('API Response:', response);
        this.formData = {
          first_name: '',
          last_name: '',
          email: '',
          message: ''
        };
        console.log("Form Data after submission:", this.formData);
        // alert("Successfully Sent ")
      })
    } else {
      console.log("error")
    }
  }


}
