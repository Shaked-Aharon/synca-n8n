export declare const CashcowCheckOrderTracking: {
    declare: {
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
    }[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
