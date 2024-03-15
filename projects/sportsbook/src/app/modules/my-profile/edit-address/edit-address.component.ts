import { Component } from '@angular/core';
import { EditAddressService } from './edit-address.service';
import { ResisterApiService } from '../../../shared/register-api.service';
import { Router } from '@angular/router';
import { ProfileService } from '../my-profile/profile.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent {
  countries: any[] = [];
  savecountries: string = '';

  addressLine1: string = ''
  city: string = ''
  addressLine2: string = ''
  // zip: string = ''





  constructor(
    private countriesApiUrl: EditAddressService,
    private registerApiService: ResisterApiService,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<EditAddressComponent>
  ) {

  }



  ngOnInit() {

    this.profileService.getPlayerProperties().subscribe(
      (data) => {
        if (data && data.properties) {
          const address = data.properties.find(prop => prop.property === 'address');
          const email = data.properties.find(prop => prop.property === 'email');
          const address2 = data.properties.find(prop => prop.property === 'address2');
          const city = data.properties.find(prop => prop.property === 'city');
          // const postCode = data.properties.find(prop => prop.property === 'postCode');
          const countrie = data.properties.find(prop => prop.property === 'country');
          if (address || email || address2 || city  || countrie) {
            this.addressLine1 = address.value;
            this.addressLine2 = address2.value
            this.city = city.value
            this.savecountries = countrie.value;

            console.log("=======================", this.savecountries)
            // this.zip = postCode.value
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

    this.addressLine1 = this.addressLine1 || '';
    this.city = this.city || '';
    this.addressLine2 = this.addressLine2 || '';
    // this.zip = this.zip || '';
    this.savecountries = this.savecountries || '';
    
    this.countriesApiUrl.getDomainCountries().subscribe(
      (data) => {
        this.countries = Array.isArray(data.countries) ? data.countries.map((countries) => ({
          name: countries.name,
          isoCode: countries.isoCode
          // Add more properties as needed
        })) : [];

        // Handle the API response here
        this.sortCountriesAlphabetically();

        // Set default currency if not selected
        if (!this.savecountries && this.countries.length > 0) {
          this.savecountries = this.countries.length > 0 ? this.countries[0].name : this.savecountries

        }
      },
      (error) => {
        console.error(error);
        // Handle errors here
      }
    );
  



    // Check if the currency is already set in local storage
    const storedCountries = this.savecountries;
    if (!storedCountries) {
      // If not set, set the default currency (first option)
      this.savecountries = this.countries.length > 0 ? this.countries[0].isoCode : this.savecountries;

    } else {
      // If set, load the value from local storage
      this.savecountries = storedCountries;
    }





  }
  sortCountriesAlphabetically() {
    this.countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  updateAddress() {
    const property = 'ADDRESS';
    const selectedCountry = this.countries.find(country => country.name === this.savecountries);

    // Get the ISO code of the selected country or use the ISO code of the first country if not selected
    const countryISOCode = selectedCountry
      ? selectedCountry.isoCode                  // Use selectedCountry.isoCode if selectedCountry is truthy
      : (this.savecountries || (this.countries.length > 0 ? this.countries[0].isoCode : undefined));


    let body = {
      properties: [
        { "property": "country", "value": countryISOCode },
        // { "property": "postCode", "value": this.zip },
        { "property": "address", "value": this.addressLine1 },
        { "property": "address2", "value": this.addressLine2 },
        { "property": "city", "value": this.city },
      ]
    };

    this.registerApiService.saveUserData(body, property).subscribe(
      (response) => {
        console.log('User data saved successfully:', response);
        this.router.navigate(['edit-profile']);
        setTimeout(() => {
          location.reload();
        }, 0);
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
