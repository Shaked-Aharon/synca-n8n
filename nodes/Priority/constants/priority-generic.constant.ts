export const PriorityGeneric = {
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


        // Actions
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
        // ----------------------------------------------------------
        // FIELDS  (array of { field, operator, value })
        // ----------------------------------------------------------
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
                /* Re-fetch the schema whenever the form changes */
                loadOptionsDependsOn: ['formName', 'subFormName'],
                refreshOn: ['formName', 'subFormName'],

                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',  // see next section
                    mode: 'add',          // ← insert mode
                    addAllFields: false,   // show everything up front
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        // ----------------------------------------------------------
        // 1. FILTERS  (array of { field, operator, value })
        // ----------------------------------------------------------
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            placeholder: 'Add Filter',
            typeOptions: {
                multipleValues: true,               // let the user add N rows
                loadOptionsDependsOn: ['formName', 'subFormName'],
                refreshOn: ['formName', 'subFormName'],       // clear filters when procedure changes (n8n ≥ 1.90)
            },
            default: {},
            displayOptions: {
                show: {
                    resource: ['generic', 'sales', 'purchaseOrders', 'products'], operation: [
                        'search_form', 'update_row_in_form', 'search_sub_form', 'update_row_in_sub_form',
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
                        /* 1-A  Field ----------------------------------------- */
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getFormFields',  // see §2
                                loadOptionsDependsOn: ['formName', 'subFormName'],
                                refreshOn: ['formName', 'subFormName']
                            },
                            default: '',
                        },

                        /* 1-B  Operator -------------------------------------- */
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

                        /* 1-C  Value ----------------------------------------- */
                        {
                            displayName: 'Value',
                            name: 'fromval',
                            type: 'string',          // you can switch to ‘number’/‘boolean’ dynamically later
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
                        'get_row_in_form', //'search_form',
                        'get_product', //'list_products',
                        'get_order', //'list_orders',
                        'get_purchase_order', //'list_purchase_orders',
                        'get_invoice', //'list_invoices',
                        'get_customer', //'list_customers'
                    ],
                },
            },
            default: [],
            description: 'Select which sub-forms to include',
        },
        // {
        //     displayName: 'Filters',
        //     name: 'filters',
        //     type: 'fixedCollection',
        //     placeholder: 'Add Filter',
        //     typeOptions: {
        //         multipleValues: true,               // let the user add N rows
        //         loadOptionsDependsOn: ['formName'],
        //         refreshOn: ['formName'],       // clear filters when procedure changes (n8n ≥ 1.90)
        //     },
        //     default: {},
        //     displayOptions: {
        //         show: { resource: ['generic'], operation: ['search_form'] },
        //     },

        //     options: [
        //         {
        //             name: 'filter',
        //             displayName: 'Filter',
        //             values: [
        //                 /* 1-A  Field ----------------------------------------- */
        //                 {
        //                     displayName: 'Field',
        //                     name: 'field',
        //                     type: 'options',
        //                     typeOptions: {
        //                         loadOptionsMethod: 'getFormFields',  // see §2
        //                         loadOptionsDependsOn: ['formName'],
        //                         refreshOn: ['formName']
        //                     },
        //                     default: '',
        //                 },

        //                 /* 1-B  Operator -------------------------------------- */
        //                 {
        //                     displayName: 'Operator',
        //                     name: 'op',
        //                     type: 'options',
        //                     options: [
        //                         { name: 'Equals', value: 'eq' },
        //                         { name: 'Not Equals', value: 'neq' },
        //                         { name: 'Greater Than', value: 'gt' },
        //                         { name: 'Greater or Equal', value: 'gte' },
        //                         { name: 'Less Than', value: 'lt' },
        //                         { name: 'Less or Equal', value: 'lte' },
        //                     ],
        //                     default: 'eq',
        //                 },

        //                 /* 1-C  Value ----------------------------------------- */
        //                 {
        //                     displayName: 'Value',
        //                     name: 'fromval',
        //                     type: 'string',          // you can switch to ‘number’/‘boolean’ dynamically later
        //                     default: '',
        //                 },
        //             ],
        //         },
        //     ],
        // },

        // ----------------------------------------------------------
        // 2. RETURN FIELDS  (multi-select, optional)
        // ----------------------------------------------------------
        {
            displayName: 'Return Fields',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            description:
                'Leave empty to return all columns, or pick the ones you need.',
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
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => {
        // Required fields
        const orderId = getNodeParameter('order_id', i) as number;
        const emailAddress = getNodeParameter('email_address', i) as string;

        if (!orderId) throw new Error('Order ID is required');
        if (!emailAddress || emailAddress.trim() === '') throw new Error('Customer email is required');

        params.order_id = orderId;
        params.email_address = emailAddress.trim();

        return params;
    }
};