import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BonusService } from '../../../services/bonus.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

/**
 * Component for managing bonuses.
 *
 * @component
 * @implements {OnInit}
 */
@Component({
	selector: 'app-bonus',
	templateUrl: './bonus.component.html',
	styleUrls: ['./bonus.component.css'],
})
export class BonusComponent implements OnInit {
	/**
	 * Event emitter for closing the bonus component.
	 * @type {EventEmitter<boolean>}
	 */
	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	isSmallScreen: boolean = false;
	ismediumScreen: boolean = false;
	isLargeScreen: boolean = false;

	calendarDates: number[] = [];
	cvcf;
	selectedDate: Date;
	formattedDate: string;
	showFilterModal = false;
	selectedId: number = -1;
	bonuses: any[] = [];
	isPauseLoading: boolean = false;

	/**
	 * Constructs the BonusComponent.
	 * @param {BonusService} bonusService - Service for managing bonus operations.
	 */
	constructor(private bonusService: BonusService, private breakpointObserver: BreakpointObserver) {
		for (let i = 1; i <= 30; i++) {
			this.calendarDates.push(i);
		}
		this.selectDate(25);
	}

	/**
	 * Selects a date and formats it.
	 * @param {number} date - The date to select.
	 */
	selectDate(date: number): void {
		this.selectedDate = new Date(2023, 8, date);
		const day = this.selectedDate.getDate();
		const month = this.selectedDate.toLocaleString('default', {
			month: 'short',
		});
		const year = this.selectedDate.getFullYear();

		this.formattedDate = `${day}th ${month} ${year}`;
	}

	/**
	 * Checks if a given date is active.
	 * @param {number} date - The date to check.
	 * @returns {boolean} True if the date is active, otherwise false.
	 */
	isDateActive(date: number): boolean {
		if (this.selectedDate) {
			const selected = this.selectedDate.getDate();
			return date === selected;
		}
		return false;
	}

	/**
	 * Opens the filter modal.
	 */
	openFilterModal(): void {
		this.showFilterModal = true;
	}

	/**
	 * Fetches all bonuses.
	 */
	getAllBonuses(): void {
		const requestBody = {};

		this.bonuses.length = 0;

		this.bonusService.getPlayerBonuses(requestBody).subscribe(
			(bonuses: any[]) => {
				this.bonuses = bonuses.filter(bonus => {
					return bonus.status === 'active' || bonus.status === 'paused'
				});
			},
			(error) => {
				console.error('Error:', error);
			}
		);
	}

	/**
	 * Pauses a bonus.
	 * @param {string} bonusId - The ID of the bonus.
	 * @param {string} status - The status to set for the bonus.
	 */
	onPauseBonus(bonusId: string, status: string): void {
		this.isPauseLoading = true;
		this.bonusService.pauseBonus(bonusId, status).subscribe((response) => {
			console.log('Bonus paused:', response);
			this.isPauseLoading = false;
			this.getAllBonuses();
		});
	}

	/**
	 * Initializes the component.
	 */
	ngOnInit(): void {

		this.isSmallScreen = this.breakpointObserver.isMatched(Breakpoints.Handset);

		this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
		this.isSmallScreen = result.matches;
		});

		this.ismediumScreen = this.breakpointObserver.isMatched(Breakpoints.TabletPortrait);

		this.breakpointObserver.observe([Breakpoints.TabletPortrait]).subscribe(result => {
		this.ismediumScreen = result.matches;
		});

		

		this.isLargeScreen = this.breakpointObserver.isMatched(Breakpoints.Large);

		this.breakpointObserver.observe([Breakpoints.Large]).subscribe(result => {
		this.isLargeScreen = result.matches;
		});

		this.getAllBonuses();
	}

	showMoreColumns = false;
	showMoreDetails: boolean[] = [];

	/**
	 * Toggles the row details.
	 * @param {number} index - The index of the row.
	 */
	toggleRowDetails(index: number): void {
		this.showMoreDetails[index] = !this.showMoreDetails[index];
		if (this.selectedId === index) this.selectedId = -1;
		else this.selectedId = index;
	}

	/**
	 * Emits an event to go back to the home page.
	 */
	goHome(): void {
		this.close.emit(true);
	}
}
