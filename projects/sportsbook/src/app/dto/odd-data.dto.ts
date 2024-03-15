export interface OddEventData {
    id:          string;
    version:     number;
    sportId:     string;
    eventId:     string;
    name:        string;
    status:      string;
    tradeStatus: string;
    marketType:  MarketType;
    taxonomy:    Taxonomy;
    selections:  Selection[][];
    betting:     Betting;
    coDisabled:  boolean;
    createdAt:   Date;
    marketId:    any;
    isSelected:  boolean;
}
export interface Betting {
    startTime: null;
    endTime:   Date;
}
export interface MarketType {
    legType:        string;
    picks:          number;
    orderImportant: boolean;
}
export interface Selection {
    marketId: string;
    label: any;
    id:             string;
    participantId?: string;
    name:           string;
    status:         string;
    tradestatus:    string;
    price:          Price;
    side:           string;
    line:           number;
    pushHonored:    boolean;
    homeScore:      number;
    awayScore:      number;
    selTemplate:    string;
    isSelected:     boolean;
    eventName:      string;
    marketType:     string;
    eventId:        string;
    uuid:           string;
    marketName:     string;
}
export interface Price {
    up:   number;
    down: number;
    dec:  string;
}
export interface Taxonomy {
    type:      string;
    period:    string;
    scoreType: string;
}