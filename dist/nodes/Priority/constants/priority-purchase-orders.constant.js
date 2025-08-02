"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityPurchaseOrders = void 0;
exports.PriorityPurchaseOrders = {
    declare: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['purchaseOrders'],
                },
            },
            options: [
                {
                    name: 'Create Purchase Order',
                    value: 'create_purchase_order',
                    description: 'Create a new purchase order',
                    action: 'Create a purchase order',
                },
                {
                    name: 'Update Purchase Order',
                    value: 'update_purchase_order',
                    description: 'Update a purchase order',
                    action: 'Update a purchase order',
                },
                {
                    name: 'Search Purchase Orders',
                    value: 'list_purchase_orders',
                    description: 'Search all purchase orders',
                    action: 'Search purchase orders',
                },
                {
                    name: 'Get Purchase Order',
                    value: 'get_purchase_order',
                    description: 'Get a specific purchase order',
                    action: 'Get a purchase order',
                },
            ],
            default: 'list_purchase_orders',
        },
        {
            displayName: 'Row Data',
            name: 'rowData',
            type: 'resourceMapper',
            default: { mappingMode: 'defineBelow', value: null },
            required: true,
            displayOptions: {
                show: { resource: ['purchaseOrders'], operation: ['create_purchase_order', 'update_purchase_order'] },
            },
            typeOptions: {
                loadOptionsDependsOn: ['operation', 'credentials'],
                refreshOn: ['operation', 'credentials'],
                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',
                    mode: 'add',
                    addAllFields: false,
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        {
            displayName: 'Purchase Order ID',
            name: 'purchaseId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['purchaseOrders'],
                    operation: ['get_purchase_order'],
                },
            },
            default: '',
            description: 'The purchase order ID to retrieve',
        },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            placeholder: 'Add Filter',
            typeOptions: {
                multipleValues: true,
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            default: {},
            displayOptions: {
                show: { resource: ['purchaseOrders'], operation: ['list_purchase_orders'] },
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
                                loadOptionsDependsOn: ['credentials', 'operation'],
                                refreshOn: ['credentials', 'operation']
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
            displayName: 'Return Fields',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            description: 'Leave empty to return all columns, or pick the ones you need.',
            typeOptions: {
                loadOptionsMethod: 'getFormFields',
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            displayOptions: {
                show: { resource: ['purchaseOrders'], operation: ['list_purchase_orders'] },
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        const page = getNodeParameter('page', i, 1);
        const pageSize = getNodeParameter('page_size', i, 20);
        if (page < 1)
            throw new Error('Page number must be 1 or greater');
        if (pageSize < 1 || pageSize > 100)
            throw new Error('Page size must be between 1 and 100');
        params.page = page;
        params.page_size = pageSize;
        try {
            const messageType = getNodeParameter('message_type', i, 'all');
            if (messageType && messageType !== 'all') {
                params.message_type = messageType;
            }
        }
        catch { }
        try {
            const readStatus = getNodeParameter('read_status', i, 'all');
            if (readStatus && readStatus !== 'all') {
                params.read_status = readStatus;
            }
        }
        catch { }
        try {
            const customerId = getNodeParameter('customer_id', i, '');
            if (customerId && customerId.trim() !== '') {
                params.customer_id = customerId.trim();
            }
        }
        catch { }
        try {
            const searchQuery = getNodeParameter('search_query', i, '');
            if (searchQuery && searchQuery.trim() !== '') {
                params.search_query = searchQuery.trim();
            }
        }
        catch { }
        try {
            const orderBy = getNodeParameter('order_by', i, 'date_desc');
            if (orderBy) {
                params.order_by = orderBy;
            }
        }
        catch { }
        try {
            const dateFrom = getNodeParameter('date_from', i, '');
            if (dateFrom && dateFrom.trim() !== '') {
                const fromDate = new Date(dateFrom);
                if (!isNaN(fromDate.getTime())) {
                    params.date_from = fromDate.toISOString();
                }
            }
        }
        catch { }
        try {
            const dateTo = getNodeParameter('date_to', i, '');
            if (dateTo && dateTo.trim() !== '') {
                const toDate = new Date(dateTo);
                if (!isNaN(toDate.getTime())) {
                    params.date_to = toDate.toISOString();
                }
            }
        }
        catch { }
        return params;
    }
};
//# sourceMappingURL=priority-purchase-orders.constant.js.map