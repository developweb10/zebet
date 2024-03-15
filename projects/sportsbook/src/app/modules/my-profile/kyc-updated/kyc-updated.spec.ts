import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycUpdatedComponent } from './kyc-updated.component';

describe('KycComponent', () => {
	let component: KycUpdatedComponent;
	let fixture: ComponentFixture<KycUpdatedComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [KycUpdatedComponent],
		});
		fixture = TestBed.createComponent(KycUpdatedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
