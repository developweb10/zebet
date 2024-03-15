export interface MarketData {
    markets: Market[];
}

export interface Market {
    market:           string;
    data:             Data[];
    valueCollection?: ValueCollection[];
}

export interface Data {
    key:       string;
    value:     string;
    selected?: string;
}

export interface ValueCollection {
    values: Data[];
}
