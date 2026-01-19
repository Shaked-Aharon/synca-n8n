import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    IHttpRequestOptions,
    ILoadOptionsFunctions,
    INodePropertyOptions,
    NodeConnectionType,
} from 'n8n-workflow';

interface SyncaCreds {
    apiToken: string;
    baseUrl: string;
}

export class SyncaKonimbo implements INodeType {
    description: INodeTypeDescription = {
        usableAsTool: true,
        displayName: 'Synca Konimbo (Beta)',
        name: 'customSyncaKonimbo',
        documentationUrl: 'https://n8n.synca.co.il/docs',
        icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
        group: ['transform'],
        version: 1,
        description: 'Invoke Konimbo actions via the Synca backend - Items, Orders, Customers, Carts, Store Categories, and Webhooks management',
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        defaults: { name: 'Synca Konimbo' },
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [{ name: 'customSyncaApiCredentials', required: true }],
        properties: [
            /* ------------------------------------------------------------ */
            /* Credential picker                                            */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Credentials',
                name: 'credentials',
                type: 'options',
                typeOptions: { loadOptionsMethod: 'getCredentials' },
                default: '',
                required: true,
                description: 'Select the Konimbo credentials to use',
            },

            /* ------------------------------------------------------------ */
            /* Resource / operation                                         */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Items',
                        value: 'items',
                        description: 'Manage products/items in the store',
                    },
                    {
                        name: 'Orders',
                        value: 'orders',
                        description: 'Manage orders',
                    },
                    {
                        name: 'Customers',
                        value: 'customers',
                        description: 'Manage customers',
                    },
                    {
                        name: 'Carts',
                        value: 'carts',
                        description: 'Manage shopping carts',
                    },
                    {
                        name: 'Store Categories',
                        value: 'store_categories',
                        description: 'Manage store categories',
                    },
                    {
                        name: 'Webhooks',
                        value: 'webhooks',
                        description: 'Manage webhooks',
                    },
                    // {
                    // 	name: 'Amazon S3',
                    // 	value: 'amazon',
                    // 	description: 'Read/write files from Amazon S3',
                    // },
                ],
                default: 'items',
            },

            /* ------------------------------------------------------------ */
            /* ITEMS OPERATIONS                                             */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['items'] } },
                options: [
                    {
                        name: 'Get Item',
                        value: 'get_item',
                        description: 'Retrieve a single item by ID, code, or second_code',
                    },
                    {
                        name: 'Get Items',
                        value: 'get_items',
                        description: 'Retrieve multiple items with filtering and pagination',
                    },
                    {
                        name: 'Create Item',
                        value: 'create_item',
                        description: 'Create a new item',
                    },
                    {
                        name: 'Update Item',
                        value: 'update_item',
                        description: 'Update an existing item',
                    },
                    {
                        name: 'Delete Item',
                        value: 'delete_item',
                        description: 'Move item to trash (can be restored from admin panel)',
                    },
                ],
                default: 'get_items',
            },

            /* ------------------------------------------------------------ */
            /* ORDERS OPERATIONS                                            */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['orders'] } },
                options: [
                    {
                        name: 'Get Order',
                        value: 'get_order',
                        description: 'Retrieve a single order by ID',
                    },
                    {
                        name: 'Get Orders',
                        value: 'get_orders',
                        description: 'Retrieve multiple orders with filtering and pagination',
                    },
                    {
                        name: 'Create Order',
                        value: 'create_order',
                        description: 'Create a new order',
                    },
                    {
                        name: 'Update Order',
                        value: 'update_order',
                        description: 'Update an order (primarily used for adding statuses)',
                    },
                ],
                default: 'get_orders',
            },

            /* ------------------------------------------------------------ */
            /* CUSTOMERS OPERATIONS                                         */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['customers'] } },
                options: [
                    {
                        name: 'Get Customer',
                        value: 'get_customer',
                        description: 'Retrieve a single customer by ID',
                    },
                    {
                        name: 'Get Customers',
                        value: 'get_customers',
                        description: 'Retrieve multiple customers with filtering and pagination',
                    },
                    {
                        name: 'Create Customer',
                        value: 'create_customer',
                        description: 'Create a new customer',
                    },
                    {
                        name: 'Update Customer',
                        value: 'update_customer',
                        description: 'Update an existing customer',
                    },
                ],
                default: 'get_customers',
            },

            /* ------------------------------------------------------------ */
            /* CARTS OPERATIONS                                             */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['carts'] } },
                options: [
                    {
                        name: 'Get Cart',
                        value: 'get_cart',
                        description: 'Retrieve a single cart by ID',
                    },
                    {
                        name: 'Create Cart',
                        value: 'create_cart',
                        description: 'Create a new cart',
                    },
                    {
                        name: 'Update Cart',
                        value: 'update_cart',
                        description: 'Update an existing cart',
                    },
                ],
                default: 'get_cart',
            },

            /* ------------------------------------------------------------ */
            /* STORE CATEGORIES OPERATIONS                                  */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['store_categories'] } },
                options: [
                    {
                        name: 'Get Store Categories',
                        value: 'get_store_categories',
                        description: 'Retrieve all store categories',
                    },
                ],
                default: 'get_store_categories',
            },

            /* ------------------------------------------------------------ */
            /* WEBHOOKS OPERATIONS                                          */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: { show: { resource: ['webhooks'] } },
                options: [
                    {
                        name: 'Get Webhooks',
                        value: 'get_webhooks',
                        description: 'Retrieve all webhooks',
                    },
                    {
                        name: 'Create Webhook',
                        value: 'create_webhook',
                        description: 'Create a new webhook',
                    },
                    {
                        name: 'Update Webhook',
                        value: 'update_webhook',
                        description: 'Update an existing webhook',
                    },
                    {
                        name: 'Delete Webhook',
                        value: 'delete_webhook',
                        description: 'Delete a webhook',
                    },
                ],
                default: 'get_webhooks',
            },

            /* ------------------------------------------------------------ */
            /* AMAZON S3 OPERATIONS                                         */
            /* ------------------------------------------------------------ */
            // {
            // 	displayName: 'Operation',
            // 	name: 'operation',
            // 	type: 'options',
            // 	noDataExpression: true,
            // 	displayOptions: { show: { resource: ['amazon'] } },
            // 	options: [
            // 		{
            // 			name: 'Read File',
            // 			value: 'read_amazon_file',
            // 			description: 'Read a file from Amazon S3',
            // 		},
            // 		{
            // 			name: 'Write File',
            // 			value: 'write_amazon_file',
            // 			description: 'Write a file to Amazon S3',
            // 		},
            // 	],
            // 	default: 'read_amazon_file',
            // },

            /* ------------------------------------------------------------ */
            /* COMMON PARAMETERS - Identifier                               */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Identifier Type',
                name: 'identifier_type',
                type: 'options',
                required: true,
                default: 'id',
                options: [
                    { name: 'ID', value: 'id' },
                    { name: 'Code', value: 'code' },
                    { name: 'Second Code', value: 'second_code' },
                ],
                displayOptions: {
                    show: {
                        resource: ['items'],
                        operation: ['get_item', 'update_item', 'delete_item'],
                    },
                },
                description: 'Type of identifier to use for the item',
            },
            {
                displayName: 'Identifier Value',
                name: 'identifier_value',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['items'],
                        operation: ['get_item', 'update_item', 'delete_item'],
                    },
                },
                description: 'The value of the identifier (ID, code, or second_code)',
            },

            /* ------------------------------------------------------------ */
            /* ITEMS PARAMETERS                                             */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Attributes',
                name: 'attributes',
                type: 'string',
                default: '',
                displayOptions: {
                    show: {
                        resource: ['items', 'orders', 'customers', 'carts', 'store_categories', 'webhooks'],
                        operation: ['get_item', 'get_items', 'get_order', 'get_orders', 'get_customer', 'get_customers', 'get_cart', 'get_store_categories', 'get_webhooks'],
                    },
                },
                description: 'Comma-separated list of fields to return (e.g., "id,title,price")',
            },
            {
                displayName: 'Item Data',
                name: 'item_data',
                type: 'json',
                required: true,
                default: '{}',
                displayOptions: {
                    show: {
                        resource: ['items'],
                        operation: ['create_item', 'update_item'],
                    },
                },
                description: 'JSON object with item data. Required fields for create: title, store_category_title',
                placeholder: '{"title": "Product Name", "store_category_title": "Category", "price": 100}',
            },

            /* ------------------------------------------------------------ */
            /* ITEMS LIST FILTERS                                           */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Filters',
                name: 'item_filters',
                type: 'collection',
                placeholder: 'Add Filter',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['items'],
                        operation: ['get_items'],
                    },
                },
                options: [
                    {
                        displayName: 'Sort By',
                        name: 'sort_by',
                        type: 'options',
                        default: 'created_at',
                        options: [
                            { name: 'Created At', value: 'created_at' },
                            { name: 'Updated At', value: 'updated_at' },
                            { name: 'Price', value: 'price' },
                            { name: 'Title', value: 'title' },
                        ],
                    },
                    {
                        displayName: 'Sort Order',
                        name: 'sort_order',
                        type: 'options',
                        default: 'desc',
                        options: [
                            { name: 'Ascending', value: 'asc' },
                            { name: 'Descending', value: 'desc' },
                        ],
                    },
                    {
                        displayName: 'Page',
                        name: 'page',
                        type: 'number',
                        default: 1,
                        typeOptions: { minValue: 1 },
                    },
                    {
                        displayName: 'Visible',
                        name: 'visible',
                        type: 'boolean',
                        default: true,
                        description: 'Filter by visibility in store',
                    },
                    {
                        displayName: 'Min Price',
                        name: 'min_price',
                        type: 'number',
                        default: 0,
                    },
                    {
                        displayName: 'Max Price',
                        name: 'max_price',
                        type: 'number',
                        default: 0,
                    },
                    {
                        displayName: 'Tag ID',
                        name: 'tag_id',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Store Category ID',
                        name: 'store_category_id',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Created At Min',
                        name: 'created_at_min',
                        type: 'dateTime',
                        default: '',
                        description: 'Filter: created after this date (ISO-8601)',
                    },
                    {
                        displayName: 'Created At Max',
                        name: 'created_at_max',
                        type: 'dateTime',
                        default: '',
                        description: 'Filter: created before this date (ISO-8601)',
                    },
                    {
                        displayName: 'Updated At Min',
                        name: 'updated_at_min',
                        type: 'dateTime',
                        default: '',
                        description: 'Filter: updated after this date (ISO-8601)',
                    },
                    {
                        displayName: 'Updated At Max',
                        name: 'updated_at_max',
                        type: 'dateTime',
                        default: '',
                        description: 'Filter: updated before this date (ISO-8601)',
                    },
                ],
            },

            /* ------------------------------------------------------------ */
            /* ORDERS PARAMETERS                                            */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Order ID',
                name: 'order_id',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['orders'],
                        operation: ['get_order', 'update_order'],
                    },
                },
                description: 'The unique identifier of the order',
            },
            {
                displayName: 'Order Data',
                name: 'order_data',
                type: 'json',
                required: true,
                default: '{}',
                displayOptions: {
                    show: {
                        resource: ['orders'],
                        operation: ['create_order', 'update_order'],
                    },
                },
                description: 'JSON object with order data',
                placeholder: '{"customer_id": "123", "items": [...]}',
            },

            /* ------------------------------------------------------------ */
            /* ORDERS LIST FILTERS                                          */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Filters',
                name: 'order_filters',
                type: 'collection',
                placeholder: 'Add Filter',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['orders'],
                        operation: ['get_orders'],
                    },
                },
                options: [
                    {
                        displayName: 'Sort By',
                        name: 'sort_by',
                        type: 'options',
                        default: 'created_at',
                        options: [
                            { name: 'Created At', value: 'created_at' },
                            { name: 'Updated At', value: 'updated_at' },
                        ],
                    },
                    {
                        displayName: 'Sort Order',
                        name: 'sort_order',
                        type: 'options',
                        default: 'desc',
                        options: [
                            { name: 'Ascending', value: 'asc' },
                            { name: 'Descending', value: 'desc' },
                        ],
                    },
                    {
                        displayName: 'Page',
                        name: 'page',
                        type: 'number',
                        default: 1,
                        typeOptions: { minValue: 1 },
                    },
                    {
                        displayName: 'Payment Status',
                        name: 'payment_status',
                        type: 'string',
                        default: '',
                        description: 'Filter by payment status (Hebrew, e.g., "שולם")',
                    },
                    {
                        displayName: 'Status Option Title',
                        name: 'status_option_title',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Created At Min',
                        name: 'created_at_min',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Created At Max',
                        name: 'created_at_max',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Updated At Min',
                        name: 'updated_at_min',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Updated At Max',
                        name: 'updated_at_max',
                        type: 'dateTime',
                        default: '',
                    },
                ],
            },

            /* ------------------------------------------------------------ */
            /* CUSTOMERS PARAMETERS                                         */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Customer ID',
                name: 'customer_id',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['customers'],
                        operation: ['get_customer', 'update_customer'],
                    },
                },
                description: 'The unique identifier of the customer',
            },
            {
                displayName: 'Customer Data',
                name: 'customer_data',
                type: 'json',
                required: true,
                default: '{}',
                displayOptions: {
                    show: {
                        resource: ['customers'],
                        operation: ['create_customer', 'update_customer'],
                    },
                },
                description: 'JSON object with customer data',
                placeholder: '{"email": "customer@example.com", "name": "John Doe"}',
            },

            /* ------------------------------------------------------------ */
            /* CUSTOMERS LIST FILTERS                                       */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Filters',
                name: 'customer_filters',
                type: 'collection',
                placeholder: 'Add Filter',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['customers'],
                        operation: ['get_customers'],
                    },
                },
                options: [
                    {
                        displayName: 'Sort By',
                        name: 'sort_by',
                        type: 'options',
                        default: 'created_at',
                        options: [
                            { name: 'Created At', value: 'created_at' },
                            { name: 'Updated At', value: 'updated_at' },
                        ],
                    },
                    {
                        displayName: 'Sort Order',
                        name: 'sort_order',
                        type: 'options',
                        default: 'desc',
                        options: [
                            { name: 'Ascending', value: 'asc' },
                            { name: 'Descending', value: 'desc' },
                        ],
                    },
                    {
                        displayName: 'Page',
                        name: 'page',
                        type: 'number',
                        default: 1,
                        typeOptions: { minValue: 1 },
                    },
                    {
                        displayName: 'Email',
                        name: 'email',
                        type: 'string',
                        default: '',
                        description: 'Filter by customer email',
                    },
                    {
                        displayName: 'Phone',
                        name: 'phone',
                        type: 'string',
                        default: '',
                        description: 'Filter by customer phone',
                    },
                    {
                        displayName: 'Created At Min',
                        name: 'created_at_min',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Created At Max',
                        name: 'created_at_max',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Updated At Min',
                        name: 'updated_at_min',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Updated At Max',
                        name: 'updated_at_max',
                        type: 'dateTime',
                        default: '',
                    },
                ],
            },

            /* ------------------------------------------------------------ */
            /* CARTS PARAMETERS                                             */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Cart ID',
                name: 'cart_id',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['carts'],
                        operation: ['get_cart', 'update_cart'],
                    },
                },
                description: 'The unique identifier of the cart',
            },
            {
                displayName: 'Cart Data',
                name: 'cart_data',
                type: 'json',
                required: true,
                default: '{}',
                displayOptions: {
                    show: {
                        resource: ['carts'],
                        operation: ['create_cart', 'update_cart'],
                    },
                },
                description: 'JSON object with cart data',
                placeholder: '{"items": [{"item_id": "123", "quantity": 2}]}',
            },

            /* ------------------------------------------------------------ */
            /* WEBHOOKS PARAMETERS                                          */
            /* ------------------------------------------------------------ */
            {
                displayName: 'Webhook ID',
                name: 'webhook_id',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['webhooks'],
                        operation: ['update_webhook', 'delete_webhook'],
                    },
                },
                description: 'The unique identifier of the webhook',
            },
            {
                displayName: 'Callback URL',
                name: 'callback_url',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['webhooks'],
                        operation: ['create_webhook'],
                    },
                },
                description: 'The URL to call when the webhook event occurs',
            },
            {
                displayName: 'Event',
                name: 'webhook_event',
                type: 'options',
                required: true,
                default: 'order_created',
                options: [
                    { name: 'Order Created', value: 'order_created' },
                ],
                displayOptions: {
                    show: {
                        resource: ['webhooks'],
                        operation: ['create_webhook'],
                    },
                },
                description: 'The event that triggers the webhook',
            },
            {
                displayName: 'Webhook Data',
                name: 'webhook_data',
                type: 'json',
                required: true,
                default: '{}',
                displayOptions: {
                    show: {
                        resource: ['webhooks'],
                        operation: ['update_webhook'],
                    },
                },
                description: 'JSON object with webhook data to update',
                placeholder: '{"callback_url": "https://example.com/webhook"}',
            },

            /* ------------------------------------------------------------ */
            /* AMAZON S3 PARAMETERS                                         */
            /* ------------------------------------------------------------ */
            // {
            // 	displayName: 'Region',
            // 	name: 'amazon_region',
            // 	type: 'string',
            // 	required: true,
            // 	default: '',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file'],
            // 		},
            // 	},
            // 	description: 'AWS region (e.g., us-east-1)',
            // },
            // {
            // 	displayName: 'Bucket Name',
            // 	name: 'amazon_bucket_name',
            // 	type: 'string',
            // 	required: true,
            // 	default: '',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file'],
            // 		},
            // 	},
            // 	description: 'S3 bucket name',
            // },
            // {
            // 	displayName: 'File Name',
            // 	name: 'amazon_file_name',
            // 	type: 'string',
            // 	required: true,
            // 	default: '',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file', 'write_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Name of the file in S3',
            // },
            // {
            // 	displayName: 'File Format',
            // 	name: 'amazon_file_format',
            // 	type: 'options',
            // 	required: true,
            // 	default: 'json',
            // 	options: [
            // 		{ name: 'JSON', value: 'json' },
            // 		{ name: 'XML', value: 'xml' },
            // 	],
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Format of the file to read',
            // },
            // {
            // 	displayName: 'File Type',
            // 	name: 'amazon_file_type',
            // 	type: 'options',
            // 	required: true,
            // 	default: 'json',
            // 	options: [
            // 		{ name: 'JSON', value: 'json' },
            // 		{ name: 'XML', value: 'xml' },
            // 		{ name: 'String', value: 'string' },
            // 		{ name: 'Query', value: 'query' },
            // 	],
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['write_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Type of file to write',
            // },
            // {
            // 	displayName: 'File Content',
            // 	name: 'amazon_content',
            // 	type: 'json',
            // 	required: true,
            // 	default: '{}',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['write_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Content to write to the file',
            // },
            // {
            // 	displayName: 'AWS Access Key ID',
            // 	name: 'amazon_access_key_id',
            // 	type: 'string',
            // 	default: '',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file', 'write_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Optional AWS Access Key ID (if not using Konimbo default bucket)',
            // },
            // {
            // 	displayName: 'AWS Secret Access Key',
            // 	name: 'amazon_secret_access_key',
            // 	type: 'string',
            // 	typeOptions: { password: true },
            // 	default: '',
            // 	displayOptions: {
            // 		show: {
            // 			resource: ['amazon'],
            // 			operation: ['read_amazon_file', 'write_amazon_file'],
            // 		},
            // 	},
            // 	description: 'Optional AWS Secret Access Key (if not using Konimbo default bucket)',
            // },
        ],
    };

    /* -------------------------------------------------------------- */
    /* Dynamic credential list                                        */
    /* -------------------------------------------------------------- */
    methods = {
        loadOptions: {
            async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
                try {
                    const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');
                    const res = await this.helpers.httpRequest({
                        method: 'GET',
                        url: `${baseUrl}/v1/invoke/get-credentials`,
                        headers: { 'x-api-token': apiToken },
                    });
                    return Array.isArray(res)
                        ? res.map((c: any) => ({ name: c.name || c.id, value: c.id }))
                        : [];
                } catch {
                    return [{ name: 'Default', value: 'default' }];
                }
            },
        },
    };

    /* -------------------------------------------------------------- */
    /* Main execution                                                 */
    /* -------------------------------------------------------------- */
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const out: INodeExecutionData[] = [];

        const { apiToken, baseUrl } = await this.getCredentials<SyncaCreds>('customSyncaApiCredentials');

        for (let i = 0; i < items.length; i++) {
            try {
                const credentialId = this.getNodeParameter('credentials', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;
                const resource = this.getNodeParameter('resource', i) as string;

                let params: Record<string, any> = {};

                // Handle attributes parameter (common across many operations)
                try {
                    const attributes = this.getNodeParameter('attributes', i, '') as string;
                    if (attributes) {
                        params.attributes = attributes;
                    }
                } catch {
                    // Field not present, skip
                }

                /* ------------------------------------------------------------ */
                /* ITEMS PARAMETERS HANDLING                                    */
                /* ------------------------------------------------------------ */
                if (resource === 'items') {
                    // Handle identifier for get_item, update_item, delete_item
                    if (['get_item', 'update_item', 'delete_item'].includes(operation)) {
                        const idType = this.getNodeParameter('identifier_type', i) as string;
                        const idValue = this.getNodeParameter('identifier_value', i) as string;
                        params[idType] = idValue;
                    }

                    // Handle item data for create_item, update_item
                    if (['create_item', 'update_item'].includes(operation)) {
                        const itemData = this.getNodeParameter('item_data', i, '{}') as string;
                        try {
                            params.item = JSON.parse(itemData);
                        } catch {
                            params.item = itemData;
                        }
                    }

                    // Handle filters for get_items
                    if (operation === 'get_items') {
                        try {
                            const filters = this.getNodeParameter('item_filters', i, {}) as Record<string, any>;
                            Object.entries(filters).forEach(([key, value]) => {
                                if (value !== undefined && value !== null && value !== '') {
                                    params[key] = value;
                                }
                            });
                        } catch {
                            // No filters
                        }
                    }
                }

                /* ------------------------------------------------------------ */
                /* ORDERS PARAMETERS HANDLING                                   */
                /* ------------------------------------------------------------ */
                if (resource === 'orders') {
                    // Handle order_id for get_order, update_order
                    if (['get_order', 'update_order'].includes(operation)) {
                        const orderId = this.getNodeParameter('order_id', i) as string;
                        params.order_id = orderId;
                    }

                    // Handle order data for create_order, update_order
                    if (['create_order', 'update_order'].includes(operation)) {
                        const orderData = this.getNodeParameter('order_data', i, '{}') as string;
                        try {
                            params.order = JSON.parse(orderData);
                        } catch {
                            params.order = orderData;
                        }
                    }

                    // Handle filters for get_orders
                    if (operation === 'get_orders') {
                        try {
                            const filters = this.getNodeParameter('order_filters', i, {}) as Record<string, any>;
                            Object.entries(filters).forEach(([key, value]) => {
                                if (value !== undefined && value !== null && value !== '') {
                                    params[key] = value;
                                }
                            });
                        } catch {
                            // No filters
                        }
                    }
                }

                /* ------------------------------------------------------------ */
                /* CUSTOMERS PARAMETERS HANDLING                                */
                /* ------------------------------------------------------------ */
                if (resource === 'customers') {
                    // Handle customer_id for get_customer, update_customer
                    if (['get_customer', 'update_customer'].includes(operation)) {
                        const customerId = this.getNodeParameter('customer_id', i) as string;
                        params.customer_id = customerId;
                    }

                    // Handle customer data for create_customer, update_customer
                    if (['create_customer', 'update_customer'].includes(operation)) {
                        const customerData = this.getNodeParameter('customer_data', i, '{}') as string;
                        try {
                            params.customer = JSON.parse(customerData);
                        } catch {
                            params.customer = customerData;
                        }
                    }

                    // Handle filters for get_customers
                    if (operation === 'get_customers') {
                        try {
                            const filters = this.getNodeParameter('customer_filters', i, {}) as Record<string, any>;
                            Object.entries(filters).forEach(([key, value]) => {
                                if (value !== undefined && value !== null && value !== '') {
                                    params[key] = value;
                                }
                            });
                        } catch {
                            // No filters
                        }
                    }
                }

                /* ------------------------------------------------------------ */
                /* CARTS PARAMETERS HANDLING                                    */
                /* ------------------------------------------------------------ */
                if (resource === 'carts') {
                    // Handle cart_id for get_cart, update_cart
                    if (['get_cart', 'update_cart'].includes(operation)) {
                        const cartId = this.getNodeParameter('cart_id', i) as string;
                        params.cart_id = cartId;
                    }

                    // Handle cart data for create_cart, update_cart
                    if (['create_cart', 'update_cart'].includes(operation)) {
                        const cartData = this.getNodeParameter('cart_data', i, '{}') as string;
                        try {
                            params.cart = JSON.parse(cartData);
                        } catch {
                            params.cart = cartData;
                        }
                    }
                }

                /* ------------------------------------------------------------ */
                /* WEBHOOKS PARAMETERS HANDLING                                 */
                /* ------------------------------------------------------------ */
                if (resource === 'webhooks') {
                    // Handle webhook_id for update_webhook, delete_webhook
                    if (['update_webhook', 'delete_webhook'].includes(operation)) {
                        const webhookId = this.getNodeParameter('webhook_id', i) as string;
                        params.webhook_id = webhookId;
                    }

                    // Handle create_webhook
                    if (operation === 'create_webhook') {
                        const callbackUrl = this.getNodeParameter('callback_url', i) as string;
                        const event = this.getNodeParameter('webhook_event', i) as string;
                        params.callback_url = callbackUrl;
                        params.event = event;
                    }

                    // Handle update_webhook
                    if (operation === 'update_webhook') {
                        const webhookData = this.getNodeParameter('webhook_data', i, '{}') as string;
                        try {
                            params.webhook = JSON.parse(webhookData);
                        } catch {
                            params.webhook = webhookData;
                        }
                    }
                }

                /* ------------------------------------------------------------ */
                /* AMAZON S3 PARAMETERS HANDLING (COMMENTED OUT)                */
                /* ------------------------------------------------------------ */
                // if (resource === 'amazon') {
                // 	if (operation === 'read_amazon_file') {
                // 		params.amazon = {
                // 			region: this.getNodeParameter('amazon_region', i) as string,
                // 			bucket_name: this.getNodeParameter('amazon_bucket_name', i) as string,
                // 			file_name: this.getNodeParameter('amazon_file_name', i) as string,
                // 			file_format: this.getNodeParameter('amazon_file_format', i) as string,
                // 		};
                // 		try {
                // 			const accessKeyId = this.getNodeParameter('amazon_access_key_id', i, '') as string;
                // 			const secretAccessKey = this.getNodeParameter('amazon_secret_access_key', i, '') as string;
                // 			if (accessKeyId) params.amazon.access_key_id = accessKeyId;
                // 			if (secretAccessKey) params.amazon.secret_access_key = secretAccessKey;
                // 		} catch {
                // 			// Optional fields
                // 		}
                // 	}
                // 	if (operation === 'write_amazon_file') {
                // 		const content = this.getNodeParameter('amazon_content', i, '{}') as string;
                // 		params.data = {
                // 			file_name: this.getNodeParameter('amazon_file_name', i) as string,
                // 			file_type: this.getNodeParameter('amazon_file_type', i) as string,
                // 			content: JSON.parse(content),
                // 		};
                // 		try {
                // 			const accessKeyId = this.getNodeParameter('amazon_access_key_id', i, '') as string;
                // 			const secretAccessKey = this.getNodeParameter('amazon_secret_access_key', i, '') as string;
                // 			const region = this.getNodeParameter('amazon_region', i, '') as string;
                // 			const bucketName = this.getNodeParameter('amazon_bucket_name', i, '') as string;
                // 			if (accessKeyId || secretAccessKey || region || bucketName) {
                // 				params.data.credentials = {};
                // 				if (region) params.data.credentials.region = region;
                // 				if (bucketName) params.data.credentials.bucket_name = bucketName;
                // 				if (accessKeyId) params.data.credentials.access_key_id = accessKeyId;
                // 				if (secretAccessKey) params.data.credentials.secret_access_key = secretAccessKey;
                // 			}
                // 		} catch {
                // 			// Optional fields
                // 		}
                // 	}
                // }

                const req: IHttpRequestOptions = {
                    method: 'POST',
                    url: `${baseUrl}/v1/invoke/${credentialId}/${operation}`,
                    headers: { 'x-api-token': apiToken, 'Content-Type': 'application/json' },
                    body: params,
                    json: true,
                };

                const response = await this.helpers.httpRequest(req);
                out.push({ json: response, pairedItem: { item: i } });
            } catch (err) {
                if (this.continueOnFail()) {
                    out.push({ json: { error: (err as any).message }, pairedItem: { item: i } });
                    continue;
                }
                throw err;
            }
        }
        return [out];
    }
}