export declare const CashcowGetStoreMailbox: {
    declare: ({
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
        options?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
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
        options?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
