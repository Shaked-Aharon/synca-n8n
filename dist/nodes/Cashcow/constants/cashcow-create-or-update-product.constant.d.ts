export declare const CashcowCreateOrUpdateProduct: {
    decalre: ({
        displayName: string;
        name: string;
        type: string;
        required: boolean;
        default: string;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        required: boolean;
        default: string;
        options: {
            name: string;
            value: string;
        }[];
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: boolean;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        required?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: string;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        required?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        typeOptions: {
            rows: number;
        };
        default: string;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        required?: undefined;
        options?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: number;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        required?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: number;
        options: {
            name: string;
            value: number;
        }[];
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        required?: undefined;
        typeOptions?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
