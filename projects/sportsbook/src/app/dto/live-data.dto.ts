import { EventData } from "./event-data.dto";


export interface SportsTab {
	id: string;
	name: string;
}

export interface LiveSportsTab extends SportsTab{
	liveCount ?: number;
}
export interface competitionEventData {
	competitionId : string;
	competitionName ?: string;
	events : EventData[];
}

export interface SportsData {
	id: string;
	name: string;
	coupons: { key: string; description: string ; overUnder : any[]}[];
	order: number;
	metadata : MarketMetaData[];
}

export interface MarketMetaData{
	menuId : string;
	label : string;
	template ?: any;
	rules ?: TaxonomyList[];
}

export interface TaxonomyList{
	type ?: string[];
	scoreType ?: string[];
	period ?: string[];
}