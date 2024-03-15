// other-settings.component.ts
import { Component, OnInit } from '@angular/core';
import { OtherSettingsService } from './other-settings.service';
import { ResisterApiService } from '../../../shared/register-api.service';
import { Router } from '@angular/router';
import { ProfileService } from '../my-profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-other-settings',
  templateUrl: './other-settings.component.html',
  styleUrls: ['./other-settings.component.css']
})
export class OtherSettingsComponent implements OnInit {
  currency: any[] = [];
  language: any[] = [];
  savelanguage: string = '';
  savecurrency: string = ''; 


  constructor(private currenciesApiUrl: OtherSettingsService, private registerApiService : ResisterApiService,private router: Router , private profileService: ProfileService,private toastr: ToastrService,private dialogRef: MatDialogRef<OtherSettingsComponent>) {}

  ngOnInit() {

    this.profileService.getPlayerProperties().subscribe(
      (data) => {
        if (data && data.properties) {
          const language = data.properties.find(prop => prop.property === 'language');
          const currencies = data.properties.find(prop => prop.property === 'currency');
          if (currencies || language )  {
            this.savelanguage = language.value;
            this.savecurrency = currencies.value
          }
          
          else {
            console.error('address not found in the response');
          }
        }

        else {
          console.error('Invalid response structure');
        }
      },
      (error) => {
        console.error(error);
      }
    );


    this.currenciesApiUrl.getDomainCurrencies().subscribe(
      (data) => {
        this.currency = data.currencies.map((currencies) => ({
          name: currencies.name,
          code:currencies.isoCode
          // Add more properties as needed
        }));
        // Handle the API response here

        // Set default currency if not selected
        if (!this.savecurrency && this.currency.length > 0) {
          this.savecurrency = this.currency.length > 0 ? this.currency[0].name :this.savecurrency
          
        }
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );

    this.currenciesApiUrl.getDomainLanguage().subscribe(
      (data) => {
        this.language = data.languages.map((languages) => ({
          name: languages.name,
          code : languages.isoCode,
          
        
         
        }))  
        console.log("1234567890", this.language)
        // Set default language if not selected
        if (!this.savelanguage && this.language.length > 0) {
          this.savelanguage = this.language.length > 0 ? this.language[0].name :this.language
          
        }
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );

    const storedLanguage = this.savelanguage
    if (!storedLanguage) {
      // If not set, set the default language (first option)
      this.savecurrency = this.currency.length > 0 ? this.currency[0].code : this.savelanguage;
     
    } else {
      // If set, load the value from local storage
      this.savelanguage = storedLanguage;
    }

    // Check if the currency is already set in local storage
    const storedCurrency = this.savecurrency;
    if (!storedCurrency) {
      // If not set, set the default currency (first option)
      this.savelanguage = this.language.length > 0 ? this.language[0].code :this.savecurrency;
     
    } else {
      // If set, load the value from local storage
      this.savecurrency = storedCurrency;
     
    }
    console.log('Initial values set:');
    console.log('Selected Language:', this.savelanguage);
    console.log('Selected Currency:', this.savecurrency);
  }

  saveUserData() {
    const property = 'OTHER'
   
    const userData = {
      
        "properties": [
          {
            "property": "language",
            "value": this.language.find(lang => lang.name === this.savelanguage)?.code || this.savelanguage
          },
          {
            "property": "currency",
            "value": this.currency.find(curr => curr.name === this.savecurrency)?.code || this.savecurrency
          }
        ]
      
    };

    this.registerApiService.saveUserData(userData,property).subscribe(
      
      (response) => {
        console.log('User data saved successfully:', response);
        
        this.router.navigate(['edit-profile']);
        setTimeout(() => {
          location.reload();
        }, 0);
        // Handle success
      },
      
      (error) => {
        console.error('Error saving user data:', error);
        this.showErrorToast(error.error.description);
      }
    );
  }

  showErrorToast(message: string) {
		this.toastr.error(message, 'Error', {
			closeButton: true,
			timeOut: 5000,
			positionClass: 'toast-top-right',
		});
	}

  closeDialog(): void {
    this.dialogRef.close();
  }

}
