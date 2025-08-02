export declare const PriorityProcedures: {
    declare: ({
        displayName: string;
        name: string;
        type: string;
        noDataExpression: boolean;
        displayOptions: {
            show: {
                resource: string[];
                operation?: undefined;
                procedureName?: undefined;
            };
            hide?: undefined;
        };
        options: {
            name: string;
            value: string;
            description: string;
            action: string;
        }[];
        default: string;
        typeOptions?: undefined;
        required?: undefined;
        description?: undefined;
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
        required: boolean;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
                procedureName?: undefined;
            };
            hide?: undefined;
        };
        default: string;
        description: string;
        noDataExpression?: undefined;
        options?: undefined;
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
                procedureName: {
                    _cnd: {
                        not: string;
                    };
                }[];
            };
            hide: {
                procedureName: string[];
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
    } | {
        displayName: string;
        name: string;
        type: string;
        typeOptions: {
            multipleValues: boolean;
            loadOptionsDependsOn?: undefined;
            refreshOn?: undefined;
            loadOptionsMethod?: undefined;
            resourceMapper?: undefined;
        };
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
                procedureName?: undefined;
            };
            hide?: undefined;
        };
        default: {
            mappingMode?: undefined;
            value?: undefined;
        };
        description: string;
        options: {
            name: string;
            displayName: string;
            values: {
                displayName: string;
                name: string;
                type: string;
                default: string;
                description: string;
            }[];
        }[];
        noDataExpression?: undefined;
        required?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
