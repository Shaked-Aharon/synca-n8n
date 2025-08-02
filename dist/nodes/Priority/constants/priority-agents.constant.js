"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityAgents = void 0;
exports.PriorityAgents = {
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
//# sourceMappingURL=priority-agents.constant.js.map