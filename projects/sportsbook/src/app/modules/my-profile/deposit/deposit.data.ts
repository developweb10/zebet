export interface PaymentProvider {
    paymentRouteId: string;
    paymentInstrumentTemplateId: string;
    paymentProvider: string;
    paymentProviderName: string;
    paymentMethod: string;
    paymentMethodName: string;
    paymentInstrumentFields: PaymentInstrumentFields[];
    currencies: Currency[];
    canSubmitNewInstruments: boolean;
    isOpen: boolean;
    amount?: number;
    isLoading: boolean;
}

export interface PaymentInstrumentFields {
    key: string;
    type: string;
    label: string;
    isMandatory: boolean;
    isSensitive: boolean;
    format: string;
    isHiddenForNew: boolean;
    isHiddenForExisting: boolean;
    selectSource: any;
    inputValue?: any;
}

export interface Currency {
    currency: string;
    minAmount: string;
    maxAmount: string;
}

export interface DepositRequest {
    paymentInstrument: PaymentInstrument;
    paymentRouteId: string;
    currency: string;
    amount: string;
    onApprove: OnApprove;
}

export interface PaymentInstrument {
    paymentInstrumentTemplateId: string;
    values?: { [key: string]: string };
}

export interface OnApprove {
    returnUrl: string;
    cancelUrl: string
}

export interface DepositResumeResponseInstructionsPayload {
    approvalType: string;
}

export interface DepositResumeResponseInstructions {
    code: string,
    description: string,
    payload: DepositResumeResponseInstructionsPayload;
}

export interface DepositResponse {
    paymentRequestId: string;
    requestType: string;
    requestTypeName: string;
    wCurrency: string;
    wAmount: string;
    ppCurrency: string;
    ppAmount: string;
    status: string;
    statusName: string;
    paymentMethod: string;
    paymentMethodName: string;
    paymentInstrumentId: string;
    createdAt: string;
    updatedAt: string;
    links: PaymentLink[];
    instructions: DepositResumeResponseInstructions[];
    version: string;
}

export interface PaymentLink {
    href: string;
    rel: string;
    method: string;
    payload: any;
}

export interface paymentSelectOptions {
    method: string,
    url: string
}

export interface ExistingInstrument {
    createdAt: string,
    paymentInstrumentId: string,
    paymentInstrumentName: string,
    paymentInstrumentTemplateId: string,
    paymentInstrumentTemplateName: string,
    status: string,
    statusName: string,
    values: {
        email?: string, 
        phone?: string,
        bank?: string,
        account_number?: string
    }
}

export interface DepositResumeResponseLinksPayload  {
    query?: {
        paymentRequestId: string;
    }
}

export interface DepositResumeResponseLinks {
    href: string,
    rel: string,
    method: string,
}

export interface DepositResumeResponse {
    paymentRequestId: string,
    requestType: string,
    requestTypeName: string,
    wCurrency: string,
    wAmount: string,
    ppCurrency: string,
    ppAmount: string,
    status: string,
    statusName: string,
    paymentMethod: string,
    paymentMethodName: string,
    paymentInstrumentId: string,
    createdAt: string,
    updatedAt:string,
    links: DepositResumeResponseLinks[],
    instructions?: DepositResumeResponseInstructions[]; 
    version: string    
}

export interface PaymentRequestResumePayload {
    approval?: {
        type: string,
        token: string
    }
}