export interface EventData1 {
    id:          string;
    version:     number;
    sportId:     string;
    eventId:     string;
    name:        string;
    status:      string;
    tradeStatus: string;
    marketType:  MarketType;
    taxonomy:    Taxonomy;
    selections:  Array<Selection[]>;
    betting:     Betting;
    coDisabled:  boolean;
    createdAt:   Date;
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
    isSelected:    boolean;
}

export interface Price {
    up:   number;
    down: number;
    dec:  string;
}

export interface Taxonomy {
    type ?:      string;
    period ?:    string;
    scoreType ?: string;
}
