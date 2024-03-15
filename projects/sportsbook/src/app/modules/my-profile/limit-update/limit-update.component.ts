import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeLimitService } from '../../../shared/responsible-gaming/time-limit.service';

@Component({
  selector: 'app-limit-update',
  templateUrl: './limit-update.component.html',
  styleUrls: ['./limit-update.component.css']
})
export class LimitUpdateComponent {
  selectedAmount: string;
  timeLimit = inject(TimeLimitService)
  isSubmitting: boolean = false;

  constructor(public dialogRef: MatDialogRef<LimitUpdateComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit():void {
    
    console.log("DialogData", this.data)
  
  }

  enteredamount(event) {
		this.selectedAmount = event.target.value;
		// this.limits.push(`NGN ${this.selectedAmount}.00`);
	}

  updateLimit() {

		this.isSubmitting = true;
		//alert(this.selectedRecordId)
		const requestBody = {
			recordId: this.data.id,
			amount: parseFloat(this.selectedAmount),
			currency: 'NGN',
		};

		this.timeLimit.updateFinancialLimit(requestBody).subscribe(
			(res: any[]) => {
				this.isSubmitting = true;
				this.dialogRef.close(true);

			},
			(error) => {
				console.error('Error:', error);
				this.isSubmitting = true;
				// Todo : Implement toast notification
				alert('unable to add limit. Bad parameters');
			}
		);
		
	}
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
