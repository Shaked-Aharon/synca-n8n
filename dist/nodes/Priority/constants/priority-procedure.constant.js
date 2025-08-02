"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityProcedures = void 0;
exports.PriorityProcedures = {
    declare: [
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
//# sourceMappingURL=priority-procedure.constant.js.map