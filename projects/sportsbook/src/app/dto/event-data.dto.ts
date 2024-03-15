export interface EventData {
  id : string;
  eventVersion ?: number;
  sportId ?: string;
  competitionId : string;
  name ?: string;
  shortName ?: string;
  status ?: string;
  tradeStatus ?: string;
  participants ?: Participant[];
  miniCoupons ?: { [key: string]: string[] };
  anticipated ?: Anticipated;
  actual ?: Actual;
  betting ?: Actual;
  result ?: Result;
  type ?: string;
  externalId ?: string;
  feedId ?: string;
  competitionName ?: string;
  isFavourite ?: boolean;
  isSelected ?:  boolean;
  marketData ?: any[]
  marketId ?: string;
}

// sports.interface.ts
export interface Sport {
  name: string;
}

export interface Actual {
  startTime: Date | null;
  endTime: Date | null;
}

export interface Participant {
  id: string;
  name: string;
  shortName: string;
}

export interface Result {
  currentScore: CurrentScore;
  currentPeriod: CurrentPeriod;
  nextPeriodId: string;
  clock: Clock;
  isInPeriod: boolean;
}

export interface CurrentScore {
  participantId: string;
  score: [];
}

export interface Clock {
  isCountdown: boolean;
  isRunning: boolean;
  displayClock: boolean;
  current: number;
  referenceTime: Date;
}

export interface CurrentPeriod {
  id: string;
  description: string;
  additional: string;
  isPeriodFinished: boolean;
}

export interface MainEventFeed {
  eventId: string;
  eventDate: string;
  eventTime: string;
  participantA: string;
  participantB: string;
}

export interface Anticipated {
  startTime: string | any;
  endTime: string;
}
