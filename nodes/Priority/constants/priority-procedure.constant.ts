export const PriorityProcedures = {
    declare: [
        // Procedures Operations
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['procedures'],
                },
            },
            options: [
                {
                    name: 'Run Procedures',
                    value: 'run_procedures',
                    description: 'Execute a procedure',
                    action: 'Run procedures',
                },
            ],
            default: 'run_procedures',
        },

        // Actions
        {
            displayName: 'Procedure Name',
            name: 'procedureName',
            type: 'options',
            typeOptions: {
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
                loadOptionsMethod: 'getProcedures',
            },
            required: true,
            displayOptions: {
                show: {
                    resource: ['procedures'],
                    operation: ['run_procedures'],
                },
            },
            default: '',
            description: 'The name of the procedure to execute',
        },
        // ======================== TEST =====================
        {
            displayName: 'Fields',
            name: 'fields',
            type: 'resourceMapper',
            default: { mappingMode: 'defineBelow', value: null },
            required: true,
            displayOptions: {
                show: {
                    resource: ['procedures'],
                    operation: ['run_procedures'],
                    procedureName: [{ _cnd: { not: '' } }]
                },
                hide: {
                    procedureName: ['']
                }
            },
            typeOptions: {
                loadOptionsDependsOn: ['procedureName'],
                refreshOn: ['procedureName'],
                resourceMapper: {
                    resourceMapperMethod: 'getMappingColumns',
                    mode: 'add',
                    addAllFields: true,
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        {
            displayName: 'Procedure Parameters',
            name: 'procedureParameters',
            type: 'fixedCollection',
            typeOptions: {
                multipleValues: true,
            },
            displayOptions: {
                show: {
                    resource: ['procedures'],
                    operation: ['run_procedures'],
                },
            },
            default: {},
            description: 'Parameters to pass to the procedure',
            options: [
                {
                    name: 'parameter',
                    displayName: 'Parameter',
                    values: [
                        {
                            displayName: 'Name',
                            name: 'name',
                            type: 'string',
                            default: '',
                            description: 'Parameter name',
                        },
                        {
                            displayName: 'Value',
                            name: 'value',
                            type: 'string',
                            default: '',
                            description: 'Parameter value',
                        },
                    ],
                },
            ],
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
