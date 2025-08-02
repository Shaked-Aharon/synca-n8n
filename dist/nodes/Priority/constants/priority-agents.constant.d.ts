export declare const PriorityAgents: {
    declare: ({
        displayName: string;
        name: string;
        type: string;
        noDataExpression: boolean;
        displayOptions: {
            show: {
                resource: string[];
                operation?: undefined;
            };
        };
        options: {
            name: string;
            value: string;
            description: string;
            action: string;
        }[];
        default: string;
        required?: undefined;
        description?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        required: boolean;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        default: string;
        description: string;
        noDataExpression?: undefined;
        options?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
