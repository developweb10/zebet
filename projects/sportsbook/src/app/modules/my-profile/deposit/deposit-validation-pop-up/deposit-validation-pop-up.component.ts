import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deposit-validation-pop-up',
  templateUrl: './deposit-validation-pop-up.component.html',
  styleUrls: ['./deposit-validation-pop-up.component.css']
})
export class DepositValidationPopUpComponent {

  toastr = inject(ToastrService);
  maxDate: string;

  constructor(
    public dialogRef: MatDialogRef<DepositValidationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      const today = new Date();

      const year = today.getFullYear();
      let month: string | number = today.getMonth() + 1;
      let day: string | number = today.getDate();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }

      this.maxDate = `${year}-${month}-${day}`;
  }

  title: string = "TRI Pay Verification";
  label: string = "Please enter your birthday";

  openDatePicker(): void {
    const inputField = document.getElementById('input') as HTMLInputElement;
    inputField.focus();
  }

  onCancel(): void {
    this.dialogRef.close();
    localStorage.removeItem('Entity-Version');
    localStorage.removeItem('paymentRequestId');
    localStorage.removeItem('altResumeApi');

  }

  onSend(): void {
    const enteredValue = (document.getElementById('input') as HTMLInputElement).value;
    if (this.data?.type === 'birthday' && enteredValue > this.maxDate) {
      this.toastr.error('Birthdate can not be future date');
      return;
    }

    if(this.data.type === 'otp' && enteredValue === "") {
      this.toastr.error('Please enter OTP');
      return;
    }
    if(this.data.type === 'pin' && enteredValue === "") {
      this.toastr.error('Please enter PIN');
      return;
    }
    if(this.data.type === 'phone' && enteredValue === "") {
      this.toastr.error('Please enter Phone Number');
      return;
    }
    this.dialogRef.close(enteredValue);

  }
}
