export declare const PriorityGeneric: {
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
        typeOptions?: undefined;
        description?: undefined;
        required?: undefined;
        placeholder?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        typeOptions: {
            loadOptionsDependsOn: string[];
            refreshOn: string[];
            loadOptionsMethod: string;
            resourceMapper?: undefined;
            multipleValues?: undefined;
        };
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        default: never[];
        description: string;
        noDataExpression?: undefined;
        options?: undefined;
        required?: undefined;
        placeholder?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        default: never[];
        description: string;
        noDataExpression?: undefined;
        options?: undefined;
        typeOptions?: undefined;
        required?: undefined;
        placeholder?: undefined;
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
            multipleValues?: undefined;
        };
        noDataExpression?: undefined;
        options?: undefined;
        description?: undefined;
        placeholder?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        placeholder: string;
        typeOptions: {
            multipleValues: boolean;
            loadOptionsDependsOn: string[];
            refreshOn: string[];
            loadOptionsMethod?: undefined;
            resourceMapper?: undefined;
        };
        default: {
            mappingMode?: undefined;
            value?: undefined;
        };
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
            };
        };
        options: {
            name: string;
            displayName: string;
            values: ({
                displayName: string;
                name: string;
                type: string;
                typeOptions: {
                    loadOptionsMethod: string;
                    loadOptionsDependsOn: string[];
                    refreshOn: string[];
                };
                default: string;
                options?: undefined;
            } | {
                displayName: string;
                name: string;
                type: string;
                options: {
                    name: string;
                    value: string;
                }[];
                default: string;
                typeOptions?: undefined;
            } | {
                displayName: string;
                name: string;
                type: string;
                default: string;
                typeOptions?: undefined;
                options?: undefined;
            })[];
        }[];
        noDataExpression?: undefined;
        description?: undefined;
        required?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
