export interface UserBalance {
    totalBalance?: TotalBalance;
    real?:         Real;
    bonus?:        Bonus;
}

export interface Bonus {
    total?:     TotalBalance;
    analytics?: BonusAnalytics[];
}

export interface BonusAnalytics {
    balance?: TotalBalance;
    product?: string;
}

export interface TotalBalance {
    amount?: number;
    asset?:  string;
}

export interface Real {
    total?:     TotalBalance;
    analytics?: RealAnalytics[];
}

export interface RealAnalytics {
    balance?: TotalBalance;
    type?:    string;
}
