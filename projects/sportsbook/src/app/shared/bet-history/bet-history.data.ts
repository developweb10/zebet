export interface BetHistoryData {
    index?: number;
    betId?: string;
    betType?: string,
    betStatus?: string,
    placedTimestamp?: string,
    currency?: string,
    totalStake?: number,
    cashedoutStake?: number,
    placeStake?: number,
    returnAmount?: number,
    potentialReturn?: number,
    unit?: number,
    unitStake?: number,
    autoCashoutRule?: any,
    cashedoutStakeOC?: number,
    cashedoutReturnOC?: number,
    cashoutLogs?: any[];
    isRunning?: boolean;
    originalPotentialReturn?: number,
    promoId?: string,
    promoType?: string,
    betLegs?: BetLeg[],
    bonusReturn?: number,
    bonusReturnOC?: number;
    formattedDate?: string;
    formattedTime?: string;
    totalOdds?: number;
    isOpen?: boolean;
    isHistory?: boolean;
    partialCo?: boolean;
    partialReturnChecked?: boolean;
    canCreateRule?: boolean;
    autoCoClicked?: boolean;
    partialCoClicked?: boolean;
    cashoutReturnClicked?: boolean;
    partialCashoutValue?: number;
    autoCashoutValue?: number;
    maxCashoutValue?: number;
    availableCashoutAmount?: number;
    autoCashoutValueRange?: number;
    partialCashoutValueRange?: number;
    confirmAutoCashout?: boolean;
    confirmPartialCashout?: boolean;
    confirmFullCashout?: boolean;
    openBar?: boolean;
    openAuto?: boolean;
    openPartial?: boolean;
    cashoutStake?: number;
    isPartialLoading?: boolean;
    isFullLoading?: boolean;
    isAutoLoading?: boolean;
    isRemoveRuleLoading?: boolean;
}

export interface CashoutRule {
    allRemainingStake: boolean;
    betId: string;
    cashoutReturnTargetOC: number;
    whenReturnExceedsOC: number;
}

export interface CashoutReq {
    betId: string;
    cashoutReturn: number;
    cashoutStake: number;
    fullCashout: boolean;
}

export interface BetHistoryQueryData {
    endDate: string;
    language: string;
    page: number;
    settlementStatus: string;
    size: number;
    startDate: string;
}

export interface BetHistoryQueryDataV2 {
    username: string;
    start_date: string;
    end_date: string;
}

export interface BetHistoryWrapper {
    bets?: BetHistoryData[]
}

export interface BetLeg {
    anticipatedStartTime: string;
    betLegId: string;
    currentlyLive: boolean;
    event: string;
    eventId: string;
    market: string;
    marketId: string;
    price: any;
    result: string;
    fullResult: string;
    selections: any[];
    events: string[];
    formattedDate: string;
    formattedTime: string;
}