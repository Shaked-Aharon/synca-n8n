"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaCashcow = void 0;
const cashcow_create_order_constant_1 = require("./constants/cashcow-create-order.constant");
const cashcow_create_or_update_product_constant_1 = require("./constants/cashcow-create-or-update-product.constant");
const cashcow_check_order_tracking_constant_1 = require("./constants/cashcow-check-order-tracking.constant");
const cashcow_get_store_mailbox_constant_1 = require("./constants/cashcow-get-store-mailbox.constant");
class SyncaCashcow {
    constructor() {
        this.description = {
            usableAsTool: true,
            displayName: 'Synca Cashcow',
            name: 'customSyncaCashcow',
            icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
            group: ['transform'],
            version: 1,
            description: 'Invoke Cashcow actions via the Synca backend',
            defaults: { name: 'Synca Cashcow' },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [{ name: 'customSyncaApiCredentials', required: true }],
            properties: [
                {
                    displayName: 'Credentials',
                    name: 'credentials',
                    type: 'options',
                    typeOptions: { loadOptionsMethod: 'getCredentials' },
                    default: '',
                    required: true,
                },
                {
                    displayName: 'Resource',
                    name: 'resource',
                    type: 'options',
                    options: [
                        { name: 'Account', value: 'account' },
                        { name: 'Store', value: 'store' },
                        { name: 'Product', value: 'product' },
                    ],
                    default: 'account',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['account'] } },
                    options: [{ name: 'Get Info', value: 'get_account_info' }],
                    default: 'get_account_info',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['store'] } },
                    options: [
                        { name: 'List Orders', value: 'list_orders' },
                        { name: 'Create Order', value: 'create_order' },
                        { name: 'Check Order Tracking', value: 'check_order_tracking' },
                        { name: 'Get Store Mailbox', value: 'get_store_mailbox' },
                    ],
                    default: 'list_orders',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    displayOptions: { show: { resource: ['product'] } },
                    options: [
                        { name: 'Create / Update', value: 'create_or_update_product' },
                        { name: 'Exists?', value: 'product_exists' },
                        { name: 'Get Quantity', value: 'get_product_qty' },
                    ],
                    default: 'create_or_update_product',
                },
                ...cashcow_create_order_constant_1.CashcowCreateOrder.declare,
                {
                    displayName: 'Order Status IDs',
                    name: 'order_status',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated status IDs (see Cashcow docs)',
                    displayOptions: { show: { resource: ['store'], operation: ['list_orders'] } },
                },
                ...cashcow_create_or_update_product_constant_1.CashcowCreateOrUpdateProduct.decalre,
                {
                    displayName: 'SKU',
                    name: 'sku',
                    type: 'string',
                    default: '',
                    displayOptions: { show: { resource: ['product'], operation: ['product_exists'] } },
                },
                {
                    displayName: 'Product IDs',
                    name: 'product_ids',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated list',
                    displayOptions: { show: { resource: ['product'], operation: ['get_product_qty'] } },
                },
                ...cashcow_check_order_tracking_constant_1.CashcowCheckOrderTracking.declare,
                ...cashcow_get_store_mailbox_constant_1.CashcowGetStoreMailbox.declare,
            ],
        };
        this.methods = {
            loadOptions: {
                async getCredentials() {
                    try {
                        const { apiToken, baseUrl } = await this.getCredentials('customSyncaApiCredentials');
                        const res = await this.helpers.httpRequest({
                            method: 'GET',
                            url: `${baseUrl}/v1/invoke/get-credentials`,
                            headers: { 'x-api-token': apiToken },
                        });
                        return Array.isArray(res)
                            ? res.map((c) => ({ name: c.name || c.id, value: c.id }))
                            : [];
                    }
                    catch {
                        return [{ name: 'Default', value: 'default' }];
                    }
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const out = [];
        const { apiToken, baseUrl } = await this.getCredentials('customSyncaApiCredentials');
        for (let i = 0; i < items.length; i++) {
            try {
                const credentialId = this.getNodeParameter('credentials', i);
                const operation = this.getNodeParameter('operation', i);
                let params = {};
                if (operation === 'create_or_update_product') {
                    params = cashcow_create_or_update_product_constant_1.CashcowCreateOrUpdateProduct.process(params, i, this.getNodeParameter);
                }
                else if (operation === 'create_order') {
                    params = cashcow_create_order_constant_1.CashcowCreateOrder.process(params, i, this.getNodeParameter);
                }
                else if (operation === 'check_order_tracking') {
                    params = cashcow_check_order_tracking_constant_1.CashcowCheckOrderTracking.process(params, i, this.getNodeParameter);
                }
                else if (operation === 'get_store_mailbox') {
                    params = cashcow_get_store_mailbox_constant_1.CashcowGetStoreMailbox.process(params, i, this.getNodeParameter);
                }
                else {
                    for (const p of [
                        'store_id', 'cart', 'is_confirm_payment', 'order_status',
                        'product', 'sku', 'product_ids',
                        'order_id', 'email_address',
                        'page', 'page_size', 'message_type', 'date_from', 'date_to',
                        'read_status', 'customer_id', 'search_query', 'order_by',
                    ]) {
                        try {
                            const val = this.getNodeParameter(p, i, undefined);
                            if (val !== undefined)
                                params[p] = val;
                        }
                        catch {
                        }
                    }
                }
                const req = {
                    method: 'POST',
                    url: `${baseUrl}/v1/invoke/${credentialId}/${operation}`,
                    headers: { 'x-api-token': apiToken, 'Content-Type': 'application/json' },
                    body: params,
                    json: true,
                };
                const response = await this.helpers.httpRequest(req);
                out.push({ json: response, pairedItem: { item: i } });
            }
            catch (err) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: err.message }, pairedItem: { item: i } });
                    continue;
                }
                throw err;
            }
        }
        return [out];
    }
}
exports.SyncaCashcow = SyncaCashcow;
//# sourceMappingURL=SyncaCashcow.node.js.map