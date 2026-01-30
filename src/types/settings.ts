export interface Currency {
    id: string;
    userId: string;
    code: string;
    name: string;
    symbol: string;
    // exchangeRate: number;
    isBaseCurrency: boolean;
}

export interface BankAccount {
    id: string;
    userId: string;
    name: string;
    bankName?: string;

    currency: string;
    isDefault: boolean;
    color?: string;
}

export interface Tag {
    id: string;
    userId: string;
    name: string;
    color: string;
    icon: string;
}

export interface CreateCurrencyRequest {
    code: string;
    name: string;
    symbol: string;
    // exchangeRate: number;
    isBaseCurrency: boolean;
}

export interface CreateBankAccountRequest {
    name: string;
    bankName?: string;

    currency: string;
    isDefault: boolean;
    color?: string;
}

export interface CreateTagRequest {
    name: string;
    color?: string;
    icon?: string;
}
