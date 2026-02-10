"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaPriorityAPI = void 0;
const SyncaService_1 = require("../shared/SyncaService");
class SyncaPriorityAPI {
    constructor() {
        this.description = {
            displayName: 'Synca Priority ERP API',
            name: 'customSyncaPriorityAPI',
            icon: 'fa:api',
            group: ['transform'],
            version: 1,
            description: 'Interact with Custom API for Orders, Items, Customers, and Purchase Orders',
            defaults: {
                name: 'Synca Priority ERP API',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'customSyncaApiCredentials',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Credentials',
                    name: 'credentials',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getCredentials',
                    },
                    default: '',
                    required: true,
                    description: 'Select the credentials to use',
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    noDataExpression: true,
                    options: [
                        {
                            name: 'Order',
                            value: 'order',
                        },
                        {
                            name: 'Item',
                            value: 'item',
                        },
                        {
                            name: 'Customer',
                            value: 'customer',
                        },
                        {
                            name: 'Purchase Order',
                            value: 'purchaseOrder',
                        },
                    ],
                    default: 'order',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['order'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Many',
                            value: 'getMany',
                            action: 'Get many orders',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get an order',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create an order',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            action: 'Update an order',
                        },
                    ],
                    default: 'getMany',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['item'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Many',
                            value: 'getMany',
                            action: 'Get many items',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get a item',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create a item',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            action: 'Update a item',
                        },
                    ],
                    default: 'getMany',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['customer'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Many',
                            value: 'getMany',
                            action: 'Get many customers',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get a customer',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create a customer',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            action: 'Update a customer',
                        },
                    ],
                    default: 'getMany',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: {
                        show: {
                            resource: ['purchaseOrder'],
                        },
                    },
                    options: [
                        {
                            name: 'Get Many',
                            value: 'getMany',
                            action: 'Get many purchase orders',
                        },
                        {
                            name: 'Get',
                            value: 'get',
                            action: 'Get a purchase order',
                        },
                        {
                            name: 'Create',
                            value: 'create',
                            action: 'Create a purchase order',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            action: 'Update a purchase order',
                        },
                    ],
                    default: 'getMany',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Top',
                            name: 'top',
                            type: 'number',
                            default: 100,
                            description: 'Number of records to return',
                        },
                        {
                            displayName: 'Skip',
                            name: 'skip',
                            type: 'number',
                            default: 50,
                            description: 'The amount of record to skip',
                        },
                        {
                            displayName: 'Filter',
                            name: 'filter',
                            type: 'string',
                            default: '',
                            description: 'Filter expression to apply to the results',
                        },
                        {
                            displayName: 'Select',
                            name: 'select',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of fields to select',
                        },
                    ],
                },
                {
                    displayName: 'ID',
                    name: 'id',
                    type: 'string',
                    default: '',
                    required: true,
                    displayOptions: {
                        show: {
                            operation: ['get', 'update'],
                        },
                    },
                    description: 'ID of the record to get or update',
                },
                {
                    displayName: 'Data',
                    name: 'data',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    description: 'JSON data for creating or updating the record',
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getCredentials() {
                    const service = new SyncaService_1.SyncaService(this);
                    return await service.getProviderCredentials();
                },
            },
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                const credentialsId = this.getNodeParameter('credentials', i);
                const additionalFields = this.getNodeParameter('additionalFields', i);
                const service = new SyncaService_1.SyncaService(this);
                let actionName = '';
                switch (operation) {
                    case 'getMany':
                        actionName = `get_${resource}s`;
                        break;
                    case 'get':
                        actionName = `get_${resource}`;
                        break;
                    case 'create':
                        actionName = `create_${resource}`;
                        break;
                    case 'update':
                        actionName = `update_${resource}`;
                        break;
                }
                const queryParams = {};
                if (additionalFields.top !== undefined) {
                    queryParams.top = additionalFields.top.toString();
                }
                if (additionalFields.skip !== undefined) {
                    queryParams.skip = additionalFields.skip.toString();
                }
                if (additionalFields.filter) {
                    queryParams.filter = additionalFields.filter;
                }
                if (additionalFields.select) {
                    queryParams.select = additionalFields.select;
                }
                if (operation === 'get' || operation === 'update') {
                    const id = this.getNodeParameter('id', i);
                    queryParams.id = id;
                }
                if (operation === 'create' || operation === 'update') {
                    let data = this.getNodeParameter('data', i);
                    if (data) {
                        data = JSON.parse(data);
                    }
                    queryParams.data = data;
                }
                const responseData = await service.invoke(credentialsId, actionName, queryParams);
                if (Array.isArray(responseData)) {
                    responseData.forEach((item) => {
                        returnData.push({
                            json: item,
                            pairedItem: { item: i },
                        });
                    });
                }
                else {
                    returnData.push({
                        json: responseData,
                        pairedItem: { item: i },
                    });
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error,
                        },
                        pairedItem: { item: i },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.SyncaPriorityAPI = SyncaPriorityAPI;
//# sourceMappingURL=SyncaPriorityAPI.node.js.map