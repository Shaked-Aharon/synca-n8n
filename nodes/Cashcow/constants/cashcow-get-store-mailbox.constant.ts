export const CashcowGetStoreMailbox = {
    declare: [
        {
            displayName: 'Page',
            name: 'page',
            type: 'number',
            default: 1,
            description: 'Page number for pagination (starting from 1)',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Page Size',
            name: 'page_size',
            type: 'number',
            default: 20,
            description: 'Number of messages per page (max: 100)',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Message Type',
            name: 'message_type',
            type: 'options',
            default: 'all',
            options: [
                { name: 'All Messages', value: 'all' },
                { name: 'Customer Messages', value: 'customer' },
                { name: 'System Messages', value: 'system' },
                { name: 'Support Messages', value: 'support' },
                { name: 'Order Related', value: 'order' },
                { name: 'Product Related', value: 'product' },
            ],
            description: 'Type of messages to retrieve',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Date From',
            name: 'date_from',
            type: 'dateTime',
            default: '',
            description: 'Filter messages from this date (ISO format)',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Date To',
            name: 'date_to',
            type: 'dateTime',
            default: '',
            description: 'Filter messages until this date (ISO format)',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Read Status',
            name: 'read_status',
            type: 'options',
            default: 'all',
            options: [
                { name: 'All Messages', value: 'all' },
                { name: 'Read Only', value: 'read' },
                { name: 'Unread Only', value: 'unread' },
            ],
            description: 'Filter by read status',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Customer ID',
            name: 'customer_id',
            type: 'string',
            default: '',
            description: 'Filter messages by specific customer ID',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Search Query',
            name: 'search_query',
            type: 'string',
            default: '',
            description: 'Search within message content',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
        {
            displayName: 'Order By',
            name: 'order_by',
            type: 'options',
            default: 'date_desc',
            options: [
                { name: 'Date (Newest First)', value: 'date_desc' },
                { name: 'Date (Oldest First)', value: 'date_asc' },
                { name: 'Customer Name', value: 'customer_name' },
                { name: 'Message Type', value: 'message_type' },
                { name: 'Read Status', value: 'read_status' },
            ],
            description: 'Sort order for messages',
            displayOptions: { show: { resource: ['store'], operation: ['get_store_mailbox'] } },
        },
    ],
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => {
        // Pagination parameters
        const page = getNodeParameter('page', i, 1) as number;
        const pageSize = getNodeParameter('page_size', i, 20) as number;

        // Validate pagination
        if (page < 1) throw new Error('Page number must be 1 or greater');
        if (pageSize < 1 || pageSize > 100) throw new Error('Page size must be between 1 and 100');

        params.page = page;
        params.page_size = pageSize;

        // Optional filters
        try {
            const messageType = getNodeParameter('message_type', i, 'all') as string;
            if (messageType && messageType !== 'all') {
                params.message_type = messageType;
            }
        } catch { }

        try {
            const readStatus = getNodeParameter('read_status', i, 'all') as string;
            if (readStatus && readStatus !== 'all') {
                params.read_status = readStatus;
            }
        } catch { }

        try {
            const customerId = getNodeParameter('customer_id', i, '') as string;
            if (customerId && customerId.trim() !== '') {
                params.customer_id = customerId.trim();
            }
        } catch { }

        try {
            const searchQuery = getNodeParameter('search_query', i, '') as string;
            if (searchQuery && searchQuery.trim() !== '') {
                params.search_query = searchQuery.trim();
            }
        } catch { }

        try {
            const orderBy = getNodeParameter('order_by', i, 'date_desc') as string;
            if (orderBy) {
                params.order_by = orderBy;
            }
        } catch { }

        // Date filters
        try {
            const dateFrom = getNodeParameter('date_from', i, '') as string;
            if (dateFrom && dateFrom.trim() !== '') {
                // Ensure proper ISO format
                const fromDate = new Date(dateFrom);
                if (!isNaN(fromDate.getTime())) {
                    params.date_from = fromDate.toISOString();
                }
            }
        } catch { }

        try {
            const dateTo = getNodeParameter('date_to', i, '') as string;
            if (dateTo && dateTo.trim() !== '') {
                // Ensure proper ISO format
                const toDate = new Date(dateTo);
                if (!isNaN(toDate.getTime())) {
                    params.date_to = toDate.toISOString();
                }
            }
        } catch { }

        return params;
    }
};
