"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaPriority = void 0;
const methods_1 = require("./constants/methods");
const priority_products_constant_1 = require("./constants/priority-products.constant");
const priority_sales_constant_1 = require("./constants/priority-sales.constant");
const priority_purchase_orders_constant_1 = require("./constants/priority-purchase-orders.constant");
const priority_procedure_constant_1 = require("./constants/priority-procedure.constant");
const priority_generic_constant_1 = require("./constants/priority-generic.constant");
const opDict = {
    'eq': "=",
    'in': "=",
    'startWith': "=",
    'endWith': "=",
    'neq': "<>",
    'gt': ">",
    'gte': ">=",
    'lt': "<",
    'lte': "<=",
};
function getFinalFilter(f) {
    const op = opDict[f.op];
    let fromval = f.fromval;
    if (f.op === 'in') {
        fromval = `*${fromval}*`;
    }
    if (f.op === 'startWith') {
        fromval = `${fromval}*`;
    }
    if (f.op === 'endWith') {
        fromval = `*${fromval}`;
    }
    return {
        fromval,
        op: op,
        field: f.field
    };
}
function processFieldsToSend(value, schemas) {
    var _a;
    const result = {};
    if (value === null)
        return result;
    for (const key in value) {
        const isRemoved = (_a = schemas.find(s => s.id === key)) === null || _a === void 0 ? void 0 : _a.removed;
        if (!isRemoved) {
            result[key] = value[key];
        }
    }
    return result;
}
class SyncaPriority {
    constructor() {
        this.description = {
            usableAsTool: true,
            displayName: 'Synca Priority ERP',
            name: 'customNewSyncaPriority',
            icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
            group: ['transform'],
            version: 1,
            description: 'Interact with Priority ERP for Products, Sales, Purchase Orders, Agents, and Procedures',
            defaults: {
                name: 'Synca Priority ERP',
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
                            name: 'Products',
                            value: 'products',
                        },
                        {
                            name: 'Sales',
                            value: 'sales',
                        },
                        {
                            name: 'Purchase Orders',
                            value: 'purchaseOrders',
                        },
                        {
                            name: 'Procedures',
                            value: 'procedures',
                        },
                        {
                            name: 'Generic',
                            value: 'generic',
                        },
                    ],
                    default: 'products',
                    description: 'The resource to operate on',
                },
                ...priority_products_constant_1.PriorityProducts.declare,
                ...priority_sales_constant_1.PrioritySales.declare,
                ...priority_purchase_orders_constant_1.PriorityPurchaseOrders.declare,
                ...priority_procedure_constant_1.PriorityProcedures.declare,
                ...priority_generic_constant_1.PriorityGeneric.declare,
                {
                    displayName: 'Limit',
                    name: 'limit',
                    type: 'number',
                    typeOptions: {
                        minValue: 1,
                        maxValue: 1000,
                    },
                    displayOptions: {
                        show: {
                            operation: ['search_form', 'search_sub_form', 'list_products', 'list_customers', 'list_orders', 'list_invoices', 'list_purchase_orders', 'list_agents', 'list_price_lists'],
                        },
                    },
                    default: 50,
                    description: 'Max number of results to return',
                },
                {
                    displayName: 'Skip',
                    name: 'skip',
                    type: 'number',
                    typeOptions: {
                        minValue: 0,
                    },
                    displayOptions: {
                        show: {
                            operation: ['search_form', 'search_sub_form', 'list_products', 'list_customers', 'list_orders', 'list_invoices', 'list_purchase_orders', 'list_agents', 'list_price_lists'],
                        },
                    },
                    default: '',
                    description: 'number of items to skip',
                },
            ],
        };
        this.methods = methods_1.PriorityMethods;
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const credentialsId = this.getNodeParameter('credentials', i);
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const apiToken = credentials.apiToken;
                const baseURL = credentials.baseUrl;
                let operation = this.getNodeParameter('operation', i);
                let requestParams = {};
                let tempFields;
                switch (operation) {
                    case 'get_product':
                    case 'get_customer':
                    case 'get_order':
                    case 'get_invoice':
                    case 'get_purchase_order':
                        const param = `${operation.split('_')[1]}Id`;
                        requestParams = {
                            id: this.getNodeParameter(param, i),
                            include_subforms: this.getNodeParameter('includeSubforms', i, []),
                            formName: methods_1.operationToFormName[operation]
                        };
                        operation = 'get_row_in_form';
                        break;
                    case 'create_product':
                    case 'update_product':
                    case 'create_customer':
                    case 'update_customer':
                    case 'create_order':
                    case 'update_order':
                    case 'create_invoice':
                    case 'update_invoice':
                    case 'create_purchase_order':
                    case 'update_purchase_order':
                    case 'add_to_form':
                    case 'update_row_in_form':
                        const formFilters = this.getNodeParameter('filters.filter', 0, []);
                        tempFields = this.getNodeParameter('rowData', 0, {});
                        requestParams = {
                            formName: operation.includes('form') ? this.getNodeParameter('formName', i) : methods_1.operationToFormName[operation],
                            fields: processFieldsToSend(tempFields.value, tempFields.schema),
                            formFilters: formFilters.map(f => getFinalFilter(f))
                        };
                        if (operation.startsWith('update_'))
                            operation = 'update_row_in_form';
                        else
                            operation = 'add_to_form';
                        break;
                    case 'get_agent':
                        requestParams = {
                            id: this.getNodeParameter('agentId', i),
                        };
                        break;
                    case 'run_procedures':
                        const parameters = this.getNodeParameter('fields', 0, {});
                        console.log({ parameters });
                        requestParams = {
                            procedure_name: this.getNodeParameter('procedureName', i),
                            parameters: parameters.value
                        };
                        break;
                    case 'list_products':
                    case 'list_customers':
                    case 'list_orders':
                    case 'list_invoices':
                    case 'list_purchase_orders':
                    case 'search_form':
                        const filters = this.getNodeParameter('filters.filter', 0, []);
                        const finalFormName = operation.startsWith('list_') ? methods_1.operationToFormName[operation] : this.getNodeParameter('formName', i);
                        const isSearchForm = operation == "search_form";
                        if (operation.startsWith('list_')) {
                            operation = 'search_form';
                        }
                        const fields = this.getNodeParameter('fields', 0, []);
                        requestParams = {
                            formName: finalFormName,
                            limit: this.getNodeParameter('limit', i, 50),
                            skip: this.getNodeParameter('skip', i, 0),
                            include_subforms: isSearchForm ? undefined : this.getNodeParameter('includeSubforms', i, []),
                            fields,
                            filters: filters.map(f => getFinalFilter(f))
                        };
                        break;
                    case 'search_sub_form':
                        const searchSubFormFilters = this.getNodeParameter('filters.filter', 0, []);
                        const searchSubFormFields = this.getNodeParameter('fields', 0, []);
                        requestParams = {
                            formName: this.getNodeParameter('formName', i),
                            subFormName: this.getNodeParameter('subFormName', i),
                            mainEntityId: this.getNodeParameter('mainEntityId', i),
                            limit: this.getNodeParameter('limit', i, 50),
                            skip: this.getNodeParameter('skip', i, 0),
                            fields: searchSubFormFields,
                            filters: searchSubFormFilters.map(f => getFinalFilter(f))
                        };
                        break;
                    case 'add_to_sub_form':
                        tempFields = this.getNodeParameter('rowData', 0, {});
                        requestParams = {
                            formName: this.getNodeParameter('formName', i),
                            subFormName: this.getNodeParameter('subFormName', i),
                            mainEntityId: this.getNodeParameter('mainEntityId', i),
                            fields: processFieldsToSend(tempFields.value, tempFields.schema),
                        };
                        break;
                    case 'update_row_in_sub_form':
                        const subFormFilters = this.getNodeParameter('filters.filter', 0, []);
                        tempFields = this.getNodeParameter('rowData', 0, {});
                        requestParams = {
                            formName: this.getNodeParameter('formName', i),
                            subFormName: this.getNodeParameter('subFormName', i),
                            mainEntityId: this.getNodeParameter('mainEntityId', i),
                            fields: processFieldsToSend(tempFields.value, tempFields.schema),
                            subFormFilters: subFormFilters.map(f => getFinalFilter(f))
                        };
                        break;
                    default:
                        if (operation.startsWith('list_')) {
                            requestParams = {
                                limit: this.getNodeParameter('limit', i, 50),
                                skip: this.getNodeParameter('skip', i, 0),
                            };
                        }
                }
                const url = `${baseURL}/v1/invoke/${credentialsId}/${operation}`;
                const options = {
                    method: 'POST',
                    url,
                    headers: {
                        'x-api-token': apiToken,
                        'Content-Type': 'application/json',
                    },
                    body: requestParams,
                };
                console.log({ executeOptions: options });
                const responseData = await this.helpers.httpRequest(options);
                returnData.push({
                    json: responseData,
                    pairedItem: { item: i },
                });
            }
            catch (error) {
                console.log({ error });
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
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
exports.SyncaPriority = SyncaPriority;
//# sourceMappingURL=SyncaPriority.node.js.map