export declare const PriorityProducts: {
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
        typeOptions?: undefined;
        description?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: {
            mappingMode: string;
            value: null;
        };
        required: boolean;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        typeOptions: {
            loadOptionsDependsOn: string[];
            refreshOn: string[];
            resourceMapper: {
                resourceMapperMethod: string;
                mode: string;
                addAllFields: boolean;
                fieldWords: {
                    singular: string;
                    plural: string;
                };
            };
            loadOptionsMethod?: undefined;
        };
        noDataExpression?: undefined;
        options?: undefined;
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
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: never[];
        description: string;
        typeOptions: {
            loadOptionsMethod: string;
            loadOptionsDependsOn: string[];
            refreshOn: string[];
            resourceMapper?: undefined;
        };
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        noDataExpression?: undefined;
        options?: undefined;
        required?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
