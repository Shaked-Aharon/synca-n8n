export declare const CashcowCreateOrder: {
    declare: ({
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        placeholder?: undefined;
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        options?: undefined;
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
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
                use_shipping_for_billing: boolean[];
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        required: boolean;
        default: string;
        description: string;
        placeholder: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        options?: undefined;
        typeOptions?: undefined;
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        typeOptions?: undefined;
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    } | {
        displayName: string;
        name: string;
        type: string;
        required: boolean;
        default: number;
        description: string;
        displayOptions: {
            show: {
                resource: string[];
                operation: string[];
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        placeholder?: undefined;
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
                use_shipping_for_billing?: undefined;
                is_confirm_payment?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        options?: undefined;
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
                is_confirm_payment: boolean[];
                use_shipping_for_billing?: undefined;
            };
        };
        required?: undefined;
        placeholder?: undefined;
        options?: undefined;
        typeOptions?: undefined;
    })[];
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => any;
};
