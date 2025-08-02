export const PriorityAgents = {
    declare: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['agents'],
                },
            },
            options: [
                {
                    name: 'Search Agents',
                    value: 'list_agents',
                    description: 'Search all agents',
                    action: 'Search agents',
                },
                {
                    name: 'Get Agent',
                    value: 'get_agent',
                    description: 'Get a specific agent',
                    action: 'Get an agent',
                },
            ],
            default: 'list_agents',
        },
        {
            displayName: 'Agent ID',
            name: 'agentId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['agents'],
                    operation: ['get_agent'],
                },
            },
            default: '',
            description: 'The agent ID to retrieve',
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
