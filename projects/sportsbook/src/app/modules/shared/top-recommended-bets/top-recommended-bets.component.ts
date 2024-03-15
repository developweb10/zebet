import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BettingService } from '../../../services/betting-service';
import { Selection } from '../../../dto/odd-data.dto';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
	selector: 'app-top-recommended-bets',
	templateUrl: './top-recommended-bets.component.html',
	styleUrls: ['./top-recommended-bets.component.css'],
})
export class TopRecommendedBetsComponent implements OnInit, AfterViewInit {
	@Input() events: any[] = [];
	@Input() type: string;
	subscription = new Subscription();
	customOptions: OwlOptions = {
		loop: true,
		// mouseDrag: true,
		touchDrag: true,
		pullDrag: false,
		dots: true,
		items: 2,
		autoWidth: true,
		autoplay: true,
		autoplayTimeout: 8000,
		autoplaySpeed: 400,
		margin: 8,
		responsive: {
			100: {
				items: 2,
			},
			320: {
				items: 2,
			},
			560: {
				items: 4,
			},
			1100: {
				items: 2,
			},
			1200: {
				items: 2,
			},
		},
	};
	customOptionsRecommended: any;
	isInitialized = false;
	miniCouponSub: Subscription;
	miniCoupan;
	allSubs = [];
	selections;
	recommendedData: any[] = [];
	loading: boolean;
	constructor(private bettingService: BettingService) {
		this.miniCouponSub = this.bettingService.miniCouponId$.subscribe((data) => {
			this.miniCoupan = data;
		});
	}

	getParticipentsName(index, data) {
		return data && data[0] && data[0][index] && data[0][index].name
			? data[0][index].name
			: '';
	}

	checkCompetitionNameSize(index, data): boolean {
		return data[0][index].name.split(' ').length < 2;
	}

	ngOnInit(): void {
		this.loading = true;
		this.events = this.getUniqueValues(this.events, 'id');
		if (this.type !== 'recommendedBets') {
			this.events.map((event) => {
				if (this.miniCoupan) {
					const coupan = event.miniCoupons[this.miniCoupan];
					if (coupan) this.handleMarket(coupan);
				}
			});
			setTimeout(() => {
				this.customOptions = {
					...this.customOptions,
					margin: 8,
					nav: true,
				};
			}, 500);
		} else {
			this.events[0].map((event) => {
				if (this.miniCoupan) {
					const coupan = event.miniCoupons[this.miniCoupan];
					if (coupan) this.handleMarketData(event);
				}
			});
			this.customOptionsRecommended = {
				...this.customOptions,
				margin: 8,
				nav: true,
			};
		}
		this.subscription = this.bettingService.betBasketData$.subscribe((data) => {
			const allSelection = data?.singles || [];
			// if (!this.recommendedData) {
				this.events = this.events.map((event) => {
					const isSelected = allSelection.find(
						(selection) => selection.eventId === event.eventId
					);
					event.isSelected = isSelected !== undefined;
					return event;
				});
			// }

			if (this.recommendedData) {
				this.recommendedData.forEach((event) => {
					if (event.selections) {
						event.selections[0].forEach((element) => {
							const hasCommonItem = allSelection.some((singleItem) => {
								return (
									singleItem.side === element.side &&
									singleItem.eventId === element.eventId &&
									element.line === singleItem.line
								);
							});
							element.isSelected = hasCommonItem;
						});
					}
				});
			}
		});
		if(this.events.length === 0) this.loading = false;
	}

	ngAfterViewInit(): void {
		window.dispatchEvent(new Event('resize'));
	}

	initializeCarousel(event) {}

	getPrice(data) {
		return data[0][0].price?.dec;
	}

	getSelectionName(data) {
		return data[0][0]?.name;
	}

	public onResize(event: any) {
		// this.cdr.markForCheck();
	}

	selectionselection(selection: Selection) {
		if (selection) {
			selection.isSelected = !selection.isSelected;
			let participantsList = selection['participants'][0] as any[];
			let selectedParticipant = selection['selections'][0]?.find((selection) =>
				participantsList.find(
					(participantItem) => participantItem.id === selection.participantId
				)
			);
			this.bettingService.betBasketAdd({
				...selectedParticipant,
				eventId: selection?.eventId,
				isSelected: selection.isSelected,
				marketId: selection.id,
			});
		}
	}

	selectionselectionRecommendedBets(selection: Selection) {
		if (selection) {
			selection.isSelected = !selection.isSelected;
			// const clickedItem = this.selections.find((item) => item.uuid === selection.uuid);
			this.bettingService.betBasketAdd(selection);
		}
	}

	private getUniqueValues(arr: any[], property: string) {
		return arr.reduce((unique, obj) => {
			const value = obj[property];
			return unique.some((item) => item[property] === value)
				? unique
				: [...unique, obj];
		}, []);
	}

	checkParticipationId(selections) {
		return selections[0].some((event) => event.hasOwnProperty('participantId'));
	}

	handleMarket(allMarkets) {
		// this.isInitialized = false;
		if (allMarkets?.length) {
			allMarkets.map((eachMarket, index) => {
				const newSub = this.bettingService
					.getMarkets(`markets/${eachMarket}`)
					.subscribe({
						next: (data) => {
							if (this.type !== 'recommendedBets') {
								if (this.events.length) {
									this.events.map((eachMarketData) => {
										if (eachMarketData.id === data.id) {
											eachMarketData.selections[0]?.map((eachMarketSD) => {
												data.selections[0]?.map((eachData) => {
													if (eachMarketSD.id === eachData.id) {
														if (
															parseFloat(eachMarketSD?.price?.dec) <
															parseFloat(eachData?.price?.dec)
														) {
															eachMarketSD.hasIncreased = true;
														} else if (
															parseFloat(eachMarketSD?.price?.dec) >
															parseFloat(eachData?.price?.dec)
														) {
															eachMarketSD.hasReduced = true;
														}
														eachMarketSD.price = eachData.price;
														setTimeout(() => {
															eachMarketSD.hasIncreased = false;
															eachMarketSD.hasReduced = false;
														}, 20000);
													}
												});
											});
										}
									});
								} else {
									// this.handleMarketEdition(data, allMarkets);
								}
							}
						},
					});
				this.allSubs.push(newSub);
			});
			this.loading = false;

		}
	}

	ngOnDestroy() {
		this.allSubs.map((eachSub) => {
			if (eachSub) {
				eachSub?.unsubscribe();
			}
		});
		this.miniCouponSub?.unsubscribe();
	}

	checkIfPriceIncreased(selections) {
		const hasTrueSelection = selections.some((sel) => sel.isSelection === true);
		return hasTrueSelection;
	}

	checkIfPriceDecreased(selections) {
		const hasReduced = selections.some((sel) => sel.hasReduced === true);
		return hasReduced;
	}

	getSelectionsArray(selections) {
		return selections ? selections[0] : [];
	}

	handleMarketData(competition) {
		// const event = this.events.filter(event => competition.id === event.id)

		var selections;

		const marketSubs = [];
		let coupan;
		if (this.miniCoupan) {
			coupan = competition.miniCoupons[this.miniCoupan];
		}
		if (coupan.length) {
			// coupan.map((eachMarket) => {

			// 	marketSubs.push(newSub);
			// });
			const newSub = this.bettingService
				.getMarkets(`markets/${coupan[0]}`)
				.pipe(take(1))
				.subscribe({
					next: (data) => {
						if (competition.id === data.eventId) {
							this.selections = data.selections[0];
							this.selections.map((element) => {
								element.uuid = 'id' + Math.random().toString(16).slice(2);
								element.isSelected = false;
								element.marketId = data.id;
								element.eventId = data.eventId;
							});
							const data1 = { ...competition, ...data };
							this.recommendedData.push(data1);
						}
						this.loading = false;
						
					},
				});
			this.allSubs.push(newSub);
			return this.selections;
		}
	}
}
