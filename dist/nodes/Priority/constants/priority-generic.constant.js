"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityGeneric = void 0;
exports.PriorityGeneric = {
    declare: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['generic'],
                },
            },
            options: [
                {
                    name: 'Add Row to Form',
                    value: 'add_to_form',
                    description: 'Add new row to form',
                    action: 'Add Row to Form',
                },
                {
                    name: 'Update Row in a Form',
                    value: 'update_row_in_form',
                    description: 'Update existing row in a form',
                    action: 'Update Row in a Form',
                },
                {
                    name: 'Search Rows in Form',
                    value: 'search_form',
                    description: 'Search in selected form',
                    action: 'Search Rows form',
                },
                {
                    name: 'Add Row to Sub Form',
                    value: 'add_to_sub_form',
                    description: 'Add to a sub form',
                    action: 'Add Row to a sub form',
                },
                {
                    name: 'Update Row in a Sub Form',
                    value: 'update_row_in_sub_form',
                    description: 'Update existing row in a sub form',
                    action: 'Update Row in a Sub Form',
                },
                {
                    name: 'Search Sub Form',
                    value: 'search_sub_form',
                    description: 'Search in selected sub form',
                    action: 'Search sub form',
                }
            ],
            default: 'search_form',
        },
        {
            displayName: 'Select Form',
            name: 'formName',
            type: 'options',
            typeOptions: {
                loadOptionsDependsOn: ['credentials'],
                refreshOn: ['credentials'],
                loadOptionsMethod: 'getForms',
            },
            displayOptions: {
                show: {
                    resource: ['generic'],
                    operation: ['search_form', 'search_sub_form', 'add_to_form', 'update_row_in_form', 'add_to_sub_form', 'update_row_in_sub_form'],
                },
            },
            default: [],
            description: 'Select which form to search on',
        },
        {
            displayName: 'Main Form Entity ID',
            name: 'mainEntityId',
            type: 'string',
            displayOptions: {
                show: {
                    resource: ['generic'],
                    operation: ['add_to_sub_form', 'update_row_in_sub_form', 'search_sub_form'],
                },
            },
            default: [],
            description: 'Set the id of the parent entity to select update his subforms',
        },
        {
            displayName: 'Select Sub Form',
            name: 'subFormName',
            type: 'options',
            typeOptions: {
                loadOptionsDependsOn: ['formName'],
                refreshOn: ['formName'],
                loadOptionsMethod: 'getSubForms',
            },
            displayOptions: {
                show: {
                    resource: ['generic'],
                    operation: ['search_sub_form', 'add_to_sub_form', 'update_row_in_sub_form'],
                },
            },
            default: [],
            description: 'Select which form to search on',
        },
        {
            displayName: 'Row Data',
            name: 'rowData',
            type: 'resourceMapper',
            default: { mappingMode: 'defineBelow', value: null },
            required: true,
            displayOptions: {
                show: { resource: ['generic'], operation: ['add_to_form', 'update_row_in_form', 'add_to_sub_form', 'update_row_in_sub_form'] },
            },
            typeOptions: {
                loadOptionsDependsOn: ['formName', 'subFormName'],
                refreshOn: ['formName', 'subFormName'],
                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',
                    mode: 'add',
                    addAllFields: false,
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            placeholder: 'Add Filter',
            typeOptions: {
                multipleValues: true,
                loadOptionsDependsOn: ['formName', 'subFormName'],
                refreshOn: ['formName', 'subFormName'],
            },
            default: {},
            displayOptions: {
                show: {
                    resource: ['generic', 'sales', 'purchaseOrders', 'products'], operation: [
                        'search_form', 'update_row_in_form', 'update_row_in_sub_form',
                        'list_products', 'update_product',
                        'list_customers', 'update_customer',
                        'list_orders', 'update_order',
                        'list_invoices', 'update_invoice',
                        'list_purchase_orders', 'update_purchase_order',
                    ]
                },
            },
            options: [
                {
                    name: 'filter',
                    displayName: 'Filter',
                    values: [
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getFormFields',
                                loadOptionsDependsOn: ['formName', 'subFormName'],
                                refreshOn: ['formName', 'subFormName']
                            },
                            default: '',
                        },
                        {
                            displayName: 'Operator',
                            name: 'op',
                            type: 'options',
                            options: [
                                { name: 'Equals', value: 'eq' },
                                { name: 'Not Equals', value: 'neq' },
                                { name: 'Starts With', value: 'startWith' },
                                { name: 'Ends With', value: 'endWith' },
                                { name: 'Contain', value: 'in' },
                                { name: 'Greater Than', value: 'gt' },
                                { name: 'Greater or Equal', value: 'gte' },
                                { name: 'Less Than', value: 'lt' },
                                { name: 'Less or Equal', value: 'lte' },
                            ],
                            default: 'eq',
                        },
                        {
                            displayName: 'Value',
                            name: 'fromval',
                            type: 'string',
                            default: '',
                        },
                    ],
                },
            ],
        },
        {
            displayName: 'Include Sub-forms',
            name: 'includeSubforms',
            type: 'multiOptions',
            typeOptions: {
                loadOptionsMethod: 'getSubForms',
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            displayOptions: {
                show: {
                    resource: ['generic', 'sales', 'purchaseOrders', 'products'],
                    operation: [
                        'search_form',
                        'get_product', 'list_products',
                        'get_order', 'list_orders',
                        'get_purchase_order', 'list_purchase_orders',
                        'get_invoice', 'list_invoices',
                        'get_customer', 'list_customers'
                    ],
                },
            },
            default: [],
            description: 'Select which sub-forms to include',
        },
        {
            displayName: 'Return Fields',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            description: 'Leave empty to return all columns, or pick the ones you need.',
            typeOptions: {
                loadOptionsMethod: 'getFormFields',
                loadOptionsDependsOn: ['formName', 'subFormName'],
                refreshOn: ['formName', 'subFormName'],
            },
            displayOptions: {
                show: { resource: ['generic'], operation: ['search_form', 'search_sub_form'] },
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        const orderId = getNodeParameter('order_id', i);
        const emailAddress = getNodeParameter('email_address', i);
        if (!orderId)
            throw new Error('Order ID is required');
        if (!emailAddress || emailAddress.trim() === '')
            throw new Error('Customer email is required');
        params.order_id = orderId;
        params.email_address = emailAddress.trim();
        return params;
    }
};
//# sourceMappingURL=priority-generic.constant.js.map