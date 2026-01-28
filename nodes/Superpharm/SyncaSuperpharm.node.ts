import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeConnectionType,
	// Logger,
} from 'n8n-workflow';


function addResourceSpecificParams(requestParams: any, resource: string, operation: string, itemIndex: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object): void {
	// Add IDs based on operation
	const idFields = ['order_id', 'offer_id', 'return_id', 'tracking_id', 'thread_id', 'documentType', 'documentUrl', 'carrier_code', 'carrier_name', 'carrier_standard_code', 'tracking_number', 'carrier_url'];
	for (const field of idFields) {
		try {
			const value = getNodeParameter(field, itemIndex, '');
			if (value) {
				requestParams[field] = value;
			}
		} catch {
			// Field not present, continue
		}
	}

	// Add data fields based on operation
	const dataFields = [
		'order_lines', 'cancelations', 'refunds', 'shipments', 'offers', 'orders', 'data'
	];
	for (const field of dataFields) {
		try {
			const value = getNodeParameter(field, itemIndex, null);
			if (value !== null && value !== undefined) {
				if (typeof value === 'string' && value.trim() !== '' && value !== '{}' && value !== '[]') {
					try {
						requestParams[field] = JSON.parse(value);
					} catch {
						requestParams[field] = value;
					}
				} else if (typeof value === 'object') {
					requestParams[field] = value;
				}
			}
		} catch {
			// Field not present, continue
		}
	}
}

// async function makeRequestWithRetry(options: IHttpRequestOptions, maxRetries: number, httpRequest: (requestOptions: IHttpRequestOptions) => Promise<any>, logger: Logger): Promise<any> {
// 	let attempt = 0;
// 	while (attempt <= maxRetries) {
// 		try {
// 			return await httpRequest(options);
// 		} catch (error: any) {
// 			if (error.response?.status === 429 && attempt < maxRetries) {
// 				// Rate limited, wait and retry
// 				const retryAfter = error.response.headers['retry-after'];
// 				const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;

// 				logger?.warn(`Rate limited, retrying in ${waitTime}ms`, { attempt });
// 				await new Promise(resolve => setTimeout(resolve, waitTime));
// 				attempt++;
// 			} else {
// 				throw error;
// 			}
// 		}
// 	}
// }

function processResponseData(responseData: any, resource: string, operation: string): any {
	// Handle different response structures based on Mirakl API patterns
	if (responseData === null || responseData === undefined) {
		return {};
	}

	// If response has data property, extract it
	if (responseData.data && Array.isArray(responseData.data)) {
		return responseData.data;
	}

	// Look for common list properties
	const listProperties = [
		'orders', 'offers', 'products', 'items', 'threads', 'messages',
		'shipments', 'promotions', 'returns', 'incidents', 'results'
	];

	for (const prop of listProperties) {
		if (responseData[prop] && Array.isArray(responseData[prop])) {
			return responseData[prop];
		}
	}

	// If response itself is an array
	if (Array.isArray(responseData)) {
		return responseData;
	}

	// Return the response as-is
	return responseData;
}

function isListOperation(operation: string): boolean {
	const listOperations = [
		'get_orders', 'get_offers', 'get_products', 'get_inbox_threads',
		'get_promotions', 'get_returns', 'get_incidents', 'get_shipping_types'
	];
	return listOperations.includes(operation);
}

export class SyncaSuperpharm implements INodeType {
	description: INodeTypeDescription = {
		usableAsTool: true,
		displayName: 'Synca Superpharm',
		name: 'customSyncaSuperpharm',
		icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
		group: ['transform'],
		documentationUrl: 'https://n8n.synca.co.il/docs',
		version: 1,
		description: 'Comprehensive Superpharm Marketplace API integration for Orders, Offers, Products, Inventory, Messages, Shipping, and more',
		defaults: {
			name: 'Synca Superpharm',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				description: 'Select the Superpharm API credentials to use',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Orders',
						value: 'orders',
						description: 'Manage marketplace orders, acceptances, cancellations, refunds, and shipping',
					},
					{
						name: 'Offers',
						value: 'offers',
						description: 'Manage product offers, pricing, inventory, and offer status',
					},
					{
						name: 'Products',
						value: 'products',
						description: 'Manage product catalog, imports, attributes, and synchronization',
					},
					{
						name: 'Inventory',
						value: 'inventory',
						description: 'Manage inventory levels, stock synchronization, and fulfillment',
					},
					{
						name: 'Messages',
						value: 'messages',
						description: 'Manage customer communication, inbox threads, and order messages',
					},
					{
						name: 'Shipping',
						value: 'shipping',
						description: 'Manage shipping types, shipments, tracking, and fulfillment',
					},
					{
						name: 'Promotions',
						value: 'promotions',
						description: 'Manage promotional campaigns and marketing activities',
					},
					{
						name: 'Returns',
						value: 'returns',
						description: 'Manage returns, incidents, and customer service issues',
					},
				],
				default: 'orders',
			},

			// ==================== ORDERS OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['orders'] } },
				options: [
					{
						name: 'Get Orders',
						value: 'get_orders',
						action: 'Get orders with filters',
						description: 'Retrieve multiple orders with various filtering options',
					},
					{
						name: 'Get Order',
						value: 'get_order',
						action: 'Get a single order',
						description: 'Retrieve details of a specific order',
					},
					{
						name: 'Accept Order',
						value: 'accept_order',
						action: 'Accept order lines',
						description: 'Accept pending order lines',
					},
					{
						name: 'Cancel Order',
						value: 'cancel_order',
						action: 'Cancel order lines',
						description: 'Cancel specific order lines',
					},
					{
						name: 'Refund Order',
						value: 'refund_order',
						action: 'Process order refund',
						description: 'Process refunds for order lines',
					},
					{
						name: 'Ship Order',
						value: 'ship_order',
						action: 'Ship order',
						description: 'Create shipments and add tracking information',
					},
					{
						name: 'Update Order Status',
						value: 'update_order_status',
						action: 'Update order status',
						description: 'Update the status of order lines',
					},
					{
						name: 'Attach Documents To Order',
						value: 'attach_document_to_order',
						action: 'Attach documents to order',
						description: 'Attach documents to an order by file or URL',
					},
					{
						name: 'Update Order Tracking',
						value: 'update_order_tracking',
						action: 'Update Order Tracking',
						description: 'Update the tracking information of an order',
					},
					{
						name: 'Export Orders',
						value: 'export_orders',
						action: 'Export orders (async)',
						description: 'Start asynchronous order export process',
					},
				],
				default: 'get_orders',
			},

			// ==================== OFFERS OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['offers'] } },
				options: [
					{
						name: 'Get Offers',
						value: 'get_offers',
						action: 'Get offers with filters',
						description: 'Retrieve multiple offers with filtering options',
					},
					{
						name: 'Get Offer',
						value: 'get_offer',
						action: 'Get a single offer',
						description: 'Retrieve details of a specific offer',
					},
					{
						name: 'Create Offer',
						value: 'create_offer',
						action: 'Create new offers',
						description: 'Create new product offers',
					},
					{
						name: 'Update Offer',
						value: 'update_offer',
						action: 'Update existing offers',
						description: 'Update existing product offers',
					},
					{
						name: 'Import Offers',
						value: 'import_offers',
						action: 'Import offers (bulk)',
						description: 'Bulk import offers via file or data',
					},
					{
						name: 'Export Offers',
						value: 'export_offers',
						action: 'Export offers (async)',
						description: 'Start asynchronous offer export process',
					},
					{
						name: 'Update Offer Status',
						value: 'update_offer_status',
						action: 'Update offer status',
						description: 'Update the status of offers',
					},
				],
				default: 'get_offers',
			},

			// ==================== PRODUCTS OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['products'] } },
				options: [
					{
						name: 'Get Products',
						value: 'get_products',
						action: 'Get products',
						description: 'Retrieve product information',
					},
					{
						name: 'Import Products',
						value: 'import_products',
						action: 'Import products (bulk)',
						description: 'Bulk import products via file or data',
					},
					{
						name: 'Sync Catalog',
						value: 'sync_catalog',
						action: 'Synchronize catalog',
						description: 'Synchronize product catalog data',
					},
					{
						name: 'Get Product Attributes',
						value: 'get_product_attributes',
						action: 'Get product attributes',
						description: 'Retrieve product attribute definitions',
					},
				],
				default: 'get_products',
			},

			// ==================== INVENTORY OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['inventory'] } },
				options: [
					{
						name: 'Update Inventory',
						value: 'update_inventory',
						action: 'Update inventory levels',
						description: 'Update product inventory quantities',
					},
					{
						name: 'Get Inventory Status',
						value: 'get_inventory_status',
						action: 'Get inventory status',
						description: 'Retrieve current inventory status',
					},
					{
						name: 'Sync Inventory',
						value: 'sync_inventory',
						action: 'Synchronize inventory',
						description: 'Synchronize inventory data',
					},
				],
				default: 'update_inventory',
			},

			// ==================== MESSAGES OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['messages'] } },
				options: [
					{
						name: 'Get Inbox Threads',
						value: 'get_inbox_threads',
						action: 'Get inbox threads',
						description: 'Retrieve message threads from inbox',
					},
					{
						name: 'Send Message',
						value: 'send_message',
						action: 'Send message',
						description: 'Send a new message or reply to thread',
					},
					{
						name: 'Get Order Messages',
						value: 'get_order_messages',
						action: 'Get order messages',
						description: 'Retrieve messages related to specific order',
					},
				],
				default: 'get_inbox_threads',
			},

			// ==================== SHIPPING OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['shipping'] } },
				options: [
					{
						name: 'Get Shipping Types',
						value: 'get_shipping_types',
						action: 'Get shipping types',
						description: 'Retrieve available shipping methods',
					},
					{
						name: 'Create Shipment',
						value: 'create_shipment',
						action: 'Create shipment',
						description: 'Create new shipment with tracking',
					},
					{
						name: 'Get Tracking Info',
						value: 'get_tracking_info',
						action: 'Get tracking information',
						description: 'Retrieve shipment tracking details',
					},
					{
						name: 'Update Shipping From',
						value: 'update_shipping_from',
						action: 'Update shipping origin',
						description: 'Update shipping origin warehouse',
					},
				],
				default: 'get_shipping_types',
			},

			// ==================== PROMOTIONS OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['promotions'] } },
				options: [
					{
						name: 'Get Promotions',
						value: 'get_promotions',
						action: 'Get promotions',
						description: 'Retrieve promotional campaigns',
					},
					{
						name: 'Create Promotion',
						value: 'create_promotion',
						action: 'Create promotion',
						description: 'Create new promotional campaign',
					},
				],
				default: 'get_promotions',
			},

			// ==================== RETURNS OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['returns'] } },
				options: [
					{
						name: 'Get Returns',
						value: 'get_returns',
						action: 'Get returns',
						description: 'Retrieve return requests',
					},
					{
						name: 'Process Return',
						value: 'process_return',
						action: 'Process return',
						description: 'Process a return request',
					},
					{
						name: 'Get Incidents',
						value: 'get_incidents',
						action: 'Get incidents',
						description: 'Retrieve customer service incidents',
					},
					{
						name: 'Create Incident',
						value: 'create_incident',
						action: 'Create incident',
						description: 'Create new customer service incident',
					},
				],
				default: 'get_returns',
			},

			// ==================== ID PARAMETERS ====================
			{
				displayName: 'Order ID',
				name: 'order_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['get_order', 'accept_order', 'cancel_order', 'refund_order', 'ship_order', 'attach_document_to_order', 'update_order_tracking'],
					},
				},
				description: 'The unique identifier of the order',
				placeholder: 'ORD-12345-A',
			},
			{
				displayName: 'Document Type',
				name: 'documentType',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['attach_document_to_order'],
					},
				},
				description: 'Type of document being attached',
				placeholder: 'CUSTOMER_INVOICE',
			},
			{
				displayName: 'Document URL',
				name: 'documentUrl',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['attach_document_to_order'],
						// documentSource: ['url'],
					},
				},
				description: 'URL of the document to attach',
				placeholder: 'https://example.com/document.pdf',
			},
			{
				displayName: 'Carrier Code',
				name: 'carrier_code',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_tracking'],
					},
				},
				description: 'Order tracking carrier code',
				placeholder: 'UPS',
			},
			{
				displayName: 'Carrier Name',
				name: 'carrier_name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_tracking'],
					},
				},
				description: 'Order tracking carrier name',
				placeholder: 'UPS',
			},
			{
				displayName: 'Carrier Standard Code',
				name: 'carrier_standard_code',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_tracking'],
					},
				},
				description: 'Order tracking carrier standard code',
				placeholder: 'UPS',
			},
			{
				displayName: 'Tracking Number',
				name: 'tracking_number',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_tracking'],
					},
				},
				description: 'Order tracking tracking number',
				placeholder: '1Z999AA1234567890',
			},
			{
				displayName: 'Carrier URL',
				name: 'carrier_url',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_tracking'],
					},
				},
				description: 'Order tracking tracking URL',
				placeholder: 'https://example.com/tracking',
			},
			{
				displayName: 'Offer ID',
				name: 'offer_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['offers'],
						operation: ['get_offer'],
					},
				},
				description: 'The unique identifier of the offer',
			},
			{
				displayName: 'Return ID',
				name: 'return_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['returns'],
						operation: ['process_return'],
					},
				},
				description: 'The unique identifier of the return',
			},
			{
				displayName: 'Tracking ID',
				name: 'tracking_id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['shipping'],
						operation: ['get_tracking_info'],
					},
				},
				description: 'The tracking identifier for the shipment',
			},
			{
				displayName: 'Thread ID',
				name: 'thread_id',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['messages'],
						operation: ['send_message'],
					},
				},
				description: 'The thread ID for replying to existing message thread',
			},

			// ==================== DATA PARAMETERS ====================
			{
				displayName: 'Order Lines Data',
				name: 'order_lines',
				type: 'json',
				default: '[]',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['accept_order', 'update_shipping_from'],
					},
				},
				description: 'JSON array of order line data for accepting orders',
				placeholder: '[{"id": "order-line-1", "accepted": true}]',
			},
			{
				displayName: 'Cancelations Data',
				name: 'cancelations',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['cancel_order'],
					},
				},
				description: 'JSON array of cancelation data',
				placeholder: '[{"order_line_id": "line-1", "quantity": 1, "reason": "CUSTOMER_CANCELATION"}]',
			},
			{
				displayName: 'Refunds Data',
				name: 'refunds',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['refund_order'],
					},
				},
				description: 'JSON array of refund data',
				placeholder: '[{"order_line_id": "line-1", "quantity": 1, "reason": "ITEM_NOT_RECEIVED"}]',
			},
			{
				displayName: 'Shipments Data',
				name: 'shipments',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders', 'shipping'],
						operation: ['ship_order', 'create_shipment'],
					},
				},
				description: 'JSON array of shipment data',
				placeholder: '[{"order_line_id": "line-1", "carrier_code": "UPS", "tracking_number": "1Z999AA1234567890"}]',
			},
			{
				displayName: 'Offers Data',
				name: 'offers',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['offers'],
						operation: ['create_offer', 'update_offer', 'update_offer_status'],
					},
				},
				description: 'JSON array of offer data',
				placeholder: '[{"product_sku": "SKU123", "price": 29.99, "quantity": 100}]',
			},
			{
				displayName: 'Orders Data',
				name: 'orders',
				type: 'json',
				default: '[]',
				required: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_order_status'],
					},
				},
				description: 'JSON array of order status updates',
				placeholder: '[{"order_id": "ORD-123", "order_lines": [{"id": "line-1", "status": "SHIPPED"}]}]',
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['import_products', 'import_offers', 'update_inventory', 'send_message', 'create_promotion', 'process_return', 'create_incident'],
					},
				},
				description: 'JSON data for the operation',
			},

			// ==================== QUERY OPTIONS ====================
			{
				displayName: 'Query Options',
				name: 'queryOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						default: 10,
						description: 'Maximum number of items to return (1-100)',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Number of items to skip (for pagination)',
						typeOptions: {
							minValue: 0,
						},
					},
					{
						displayName: 'Page Token',
						name: 'page_token',
						type: 'string',
						default: '',
						description: 'Token for seek-based pagination',
					},
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'string',
						default: '',
						description: 'Field to sort by',
						placeholder: 'date_created',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'options',
						options: [
							{ name: 'Ascending', value: 'asc' },
							{ name: 'Descending', value: 'desc' },
						],
						default: 'asc',
						description: 'Sort direction',
					},
					{
						displayName: 'Shop ID',
						name: 'shop_id',
						type: 'string',
						default: '',
						description: 'Shop ID for multi-shop users',
					},
					{
						displayName: 'Locale',
						name: 'locale',
						type: 'string',
						default: '',
						description: 'Locale for internationalized data',
						placeholder: 'en_US',
					},
				],
			},

			// ==================== FILTERS ====================
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						operation: ['get_orders', 'get_offers', 'get_products', 'export_orders', 'export_offers'],
					},
				},
				options: [
					// Order Filters
					{
						displayName: 'Order State Codes',
						name: 'order_state_codes',
						type: 'string',
						default: '',
						description: 'Comma-separated order state codes (e.g., SHIPPING,SHIPPED)',
						placeholder: 'SHIPPING,SHIPPED,CLOSED',
						displayOptions: {
							show: {
								'/resource': ['orders'],
							},
						},
					},
					{
						displayName: 'Order IDs',
						name: 'order_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated order IDs',
						displayOptions: {
							show: {
								'/resource': ['orders'],
							},
						},
					},
					{
						displayName: 'Start Date',
						name: 'start_date',
						type: 'dateTime',
						default: '',
						description: 'Start date for filtering (ISO 8601 format)',
						displayOptions: {
							show: {
								'/resource': ['orders', 'promotions', 'returns'],
							},
						},
					},
					{
						displayName: 'End Date',
						name: 'end_date',
						type: 'dateTime',
						default: '',
						description: 'End date for filtering (ISO 8601 format)',
						displayOptions: {
							show: {
								'/resource': ['orders', 'promotions', 'returns'],
							},
						},
					},
					{
						displayName: 'Payment Workflow',
						name: 'payment_workflow',
						type: 'options',
						options: [
							{ name: 'Pay on Acceptance', value: 'PAY_ON_ACCEPTANCE' },
							{ name: 'Pay on Delivery', value: 'PAY_ON_DELIVERY' },
							{ name: 'Pay on Due Date', value: 'PAY_ON_DUE_DATE' },
							{ name: 'Pay on Shipment', value: 'PAY_ON_SHIPMENT' },
						],
						default: '',
						description: 'Payment workflow filter',
						displayOptions: {
							show: {
								'/resource': ['orders'],
							},
						},
					},
					{
						displayName: 'Channel Codes',
						name: 'channel_codes',
						type: 'string',
						default: '',
						description: 'Comma-separated channel codes',
						displayOptions: {
							show: {
								'/resource': ['orders'],
							},
						},
					},
					{
						displayName: 'Has Incident',
						name: 'has_incident',
						type: 'boolean',
						default: false,
						description: 'Filter orders with incidents',
						displayOptions: {
							show: {
								'/resource': ['orders'],
							},
						},
					},

					// Offer Filters
					{
						displayName: 'Product IDs',
						name: 'product_ids',
						type: 'string',
						default: '',
						description: 'Comma-separated product IDs',
						displayOptions: {
							show: {
								'/resource': ['offers', 'products', 'inventory'],
							},
						},
					},
					{
						displayName: 'Offer State Codes',
						name: 'offer_state_codes',
						type: 'string',
						default: '',
						description: 'Comma-separated offer state codes',
						placeholder: 'ACTIVE,INACTIVE',
						displayOptions: {
							show: {
								'/resource': ['offers'],
							},
						},
					},
					{
						displayName: 'Category Codes',
						name: 'category_codes',
						type: 'string',
						default: '',
						description: 'Comma-separated category codes',
						displayOptions: {
							show: {
								'/resource': ['offers', 'products'],
							},
						},
					},
					{
						displayName: 'Updated Since',
						name: 'updated_since',
						type: 'dateTime',
						default: '',
						description: 'Filter items updated since this date',
						displayOptions: {
							show: {
								'/resource': ['offers', 'products'],
							},
						},
					},

					// Message Filters
					{
						displayName: 'Entity Type',
						name: 'entity_type',
						type: 'string',
						default: '',
						description: 'Entity type for message filtering',
						displayOptions: {
							show: {
								'/resource': ['messages'],
							},
						},
					},
					{
						displayName: 'Entity ID',
						name: 'entity_id',
						type: 'string',
						default: '',
						description: 'Entity ID for message filtering',
						displayOptions: {
							show: {
								'/resource': ['messages'],
							},
						},
					},
					{
						displayName: 'Read Status',
						name: 'read_status',
						type: 'options',
						options: [
							{ name: 'Read', value: 'READ' },
							{ name: 'Unread', value: 'UNREAD' },
						],
						default: '',
						description: 'Message read status filter',
						displayOptions: {
							show: {
								'/resource': ['messages'],
							},
						},
					},
				],
			},

			// ==================== ADVANCED OPTIONS ====================
			{
				displayName: 'Advanced Options',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Return Full Response',
						name: 'returnFullResponse',
						type: 'boolean',
						default: false,
						description: 'Whether to return the full API response including metadata',
					},
					{
						displayName: 'Handle Rate Limiting',
						name: 'handleRateLimit',
						type: 'boolean',
						default: true,
						description: 'Whether to automatically retry on rate limit (429) errors',
					},
					{
						displayName: 'Request Timeout',
						name: 'timeout',
						type: 'number',
						default: 60,
						description: 'Request timeout in seconds',
						typeOptions: {
							minValue: 10,
							maxValue: 300,
						},
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `${credentials.baseUrl}/v1/invoke/get-credentials`,
						headers: {
							'x-api-token': credentials?.apiToken as string,
						},
					};

					const response = await this.helpers.httpRequest(options);

					if (Array.isArray(response)) {
						return response.map((cred: any) => ({
							name: cred.name || cred.id,
							value: cred.id,
						}));
					}

					return [];
				} catch (error) {
					return [
						{
							name: 'Default Superpharm Credentials',
							value: 'default',
						},
					];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const credentialsId = this.getNodeParameter('credentials', i) as string;
				const queryOptions = this.getNodeParameter('queryOptions', i, {}) as any;
				const filters = this.getNodeParameter('filters', i, {}) as any;
				const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as any;

				// Get credentials
				const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');

				// Build request parameters
				const requestParams: any = {
					...queryOptions,
					...filters,
				};

				// Add resource-specific parameters
				addResourceSpecificParams(requestParams, resource, operation, i, this.getNodeParameter as any);
				// if (operation === 'attach_document_to_order') {

				// if (documentSource === 'file') {
				// 	const binaryPropertyName = this.getNodeParameter('documentFile', i) as string;
				// 	const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);

				// 	// Add binary data to request
				// 	requestParams.documentFile = {
				// 		filename: binaryData.fileName,
				// 		mimeType: binaryData.mimeType,
				// 		data: binaryData.data, // base64 encoded data
				// 	};
				// }
				// }
				// Build headers
				const headers: Record<string, string> = {
					'x-api-token': credentials.apiToken,
					'Content-Type': 'application/json',
				};

				// Set timeout if specified
				const timeout = advancedOptions.timeout ? advancedOptions.timeout * 1000 : 60000;

				// Make the API request
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: `${credentials.baseUrl}/v1/invoke/${credentialsId}/${operation}`,
					headers,
					body: requestParams,
					json: true,
					timeout,
				};

				this.logger?.debug('Superpharm API Request', {
					action: operation,
					resource,
					url: options.url,
					params: requestParams
				});

				let responseData: any;

				// Handle rate limiting if enabled
				// if (advancedOptions.handleRateLimit) {
				// 	responseData = await makeRequestWithRetry(options, 3, this.helpers.httpRequest, this.logger);
				// } else {
				responseData = await this.helpers.httpRequest(options);
				// }

				// Process response based on operation and options
				if (advancedOptions.returnFullResponse) {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				} else {
					// Extract and process data based on response structure
					const processedData = processResponseData(responseData, resource, operation);

					if (isListOperation(operation) && Array.isArray(processedData)) {
						if (processedData.length > 0) {
							processedData.forEach((item) => {
								returnData.push({
									json: item,
									pairedItem: { item: i },
								});
							});
						} else {
							returnData.push({
								json: {
									message: `No ${resource} found`,
									count: 0,
									resource,
									operation
								},
								pairedItem: { item: i },
							});
						}
					} else {
						returnData.push({
							json: processedData,
							pairedItem: { item: i },
						});
					}
				}

			} catch (error: any) {
				this.logger?.error('Superpharm API Error', {
					error: error.message,
					resource: this.getNodeParameter('resource', i),
					operation: this.getNodeParameter('operation', i),
				});

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							resource: this.getNodeParameter('resource', i, ''),
							operation: this.getNodeParameter('operation', i, ''),
							timestamp: new Date().toISOString(),
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