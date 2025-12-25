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

export class SyncaWolt implements INodeType {
	description: INodeTypeDescription = {
		usableAsTool: true,
		displayName: 'Synca Wolt',
		name: 'customSyncaWolt',
		icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Invoke Wolt actions via the Synca backend - Orders, Venue, Menu, and Timeslots management',
		defaults: { name: 'Synca Wolt' },
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
				description: 'Select the Wolt credentials to use',
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
						name: 'Orders',
						value: 'orders',
						description: 'Manage orders, refunds, tracking, and cancellations',
					},
					{
						name: 'Venue',
						value: 'venue',
						description: 'Manage venue status, delivery provider, and opening times',
					},
					{
						name: 'Menu',
						value: 'menu',
						description: 'Manage menu items, inventory, and options',
					},
					{
						name: 'Timeslots',
						value: 'timeslots',
						description: 'Manage delivery timeslot configurations',
					},
				],
				default: 'orders',
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
						name: 'Confirm pre-order',
						value: 'confirm_preorder',
						description: 'Confirm pre-order with customer',
					},
					{
						name: 'Accept order',
						value: 'accept_order',
						description: 'Accept order with date',
					},
					{
						name: 'Mark Order as Ready',
						value: 'mark_order_as_ready',
						description: 'Mark order as ready for pickup',
					},
					{
						name: 'Mark Order as Pickup Completed',
						value: 'mark_order_pickup_completed',
						description: 'Mark order as pickup completed',
					},
					{
						name: 'Mark Order as Delivered',
						value: 'mark_order_delivered',
						description: 'Mark order as delivered to customer',
					},
					{
						name: 'Get Order',
						value: 'get_order',
						description: 'Retrieve detailed order information',
					},
					{
						name: 'Mark Order Sent to POS',
						value: 'mark_order_sent_to_pos',
						description: 'Mark order as sent to POS system',
					},
					{
						name: 'Replace Order Items',
						value: 'replace_order_items',
						description: 'Replace items in order during picking',
					},
					{
						name: 'Refund Order Items',
						value: 'refund_order_items',
						description: 'Refund specific items (requires endpoint enablement)',
					},
					{
						name: 'Refund Order Basket',
						value: 'refund_order_basket',
						description: 'Refund at basket level (requires endpoint enablement)',
					},
					{
						name: 'Update Courier Location',
						value: 'update_courier_location',
						description: 'Send courier location (Self Delivery only)',
					},
					{
						name: 'Update Delivery ETA',
						value: 'update_delivery_eta',
						description: 'Send estimated time of arrival (Self Delivery only)',
					},
					{
						name: 'Get Document Upload Link',
						value: 'get_document_upload_link',
						description: 'Get pre-signed URL for uploading order documents',
					},
					{
						name: 'Cancel Order',
						value: 'cancel_order',
						description: 'Cancel order before courier accepts delivery task',
					},
				],
				default: 'get_order',
			},

			/* ------------------------------------------------------------ */
			/* VENUE OPERATIONS                                             */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['venue'] } },
				options: [
					{
						name: 'Get Venue Status',
						value: 'get_venue_status',
						description: 'Get venue status information',
					},
					{
						name: 'Get Delivery Provider',
						value: 'get_delivery_provider',
						description: 'Get delivery provider configuration',
					},
					{
						name: 'Update Delivery Provider',
						value: 'update_delivery_provider',
						description: 'Update delivery provider configuration',
					},
					{
						name: 'Update Venue Online Status',
						value: 'update_venue_online_status',
						description: 'Update venue online/offline status',
					},
					{
						name: 'Update Venue Opening Time',
						value: 'update_venue_opening_time',
						description: 'Update venue opening hours',
					},
					{
						name: 'Set Special Opening Time',
						value: 'set_special_opening_time',
						description: 'Set special opening time (e.g., holidays)',
					},
				],
				default: 'get_venue_status',
			},

			/* ------------------------------------------------------------ */
			/* MENU OPERATIONS                                              */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['menu'] } },
				options: [
					{
						name: 'Get Menu',
						value: 'get_menu',
						description: 'Retrieve venue menu',
					},
					{
						name: 'Create or Update Menu',
						value: 'create_or_update_menu',
						description: 'Create or update entire menu',
					},
					{
						name: 'Update Item Inventory',
						value: 'update_item_inventory',
						description: 'Update item inventory/availability',
					},
					{
						name: 'Update Item',
						value: 'update_item',
						description: 'Update item details (price, name, etc.)',
					},
					{
						name: 'Update Option Value',
						value: 'update_option_value',
						description: 'Update option value (e.g., modifier price)',
					},
				],
				default: 'get_menu',
			},

			/* ------------------------------------------------------------ */
			/* TIMESLOTS OPERATIONS                                         */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['timeslots'] } },
				options: [
					{
						name: 'Get Timeslots',
						value: 'get_timeslots',
						description: 'Retrieve timeslot configurations for next 7 days',
					},
					{
						name: 'Update Timeslots',
						value: 'update_timeslots',
						description: 'Update timeslot configurations',
					},
				],
				default: 'get_timeslots',
			},

			/* ------------------------------------------------------------ */
			/* ORDER PARAMETERS                                             */
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
						operation: [
							'get_order',
							'confirm_preorder',
							'accept_order',
							'mark_order_as_ready',
							'mark_order_pickup_completed',
							'mark_order_delivered',
							'mark_order_sent_to_pos',
							'replace_order_items',
							'refund_order_items',
							'refund_order_basket',
							'update_courier_location',
							'update_delivery_eta',
							'get_document_upload_link',
						],
					},
				},
				description: 'The unique identifier of the order',
			},
			{
				displayName: 'Order Reference ID',
				name: 'order_reference_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['cancel_order'],
					},
				},
				description: 'The order reference ID for cancellation',
			},
			{
				displayName: 'Success',
				name: 'success',
				type: 'boolean',
				required: true,
				default: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['mark_order_sent_to_pos'],
					},
				},
				description: 'Whether the order was successfully sent to POS',
			},
			{
				displayName: 'Adjusted Pickup Time',
				name: 'adjusted_pickup_time',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['accept_order'],
					},
				},
				description: 'ISO 8601 timestamp when order was sent to POS',
			},
			{
				displayName: 'Time Sent to POS',
				name: 'time_sent_to_pos',
				type: 'dateTime',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['mark_order_sent_to_pos'],
					},
				},
				description: 'ISO 8601 timestamp when order was sent to POS',
			},
			{
				displayName: 'Item Changes',
				name: 'item_changes',
				type: 'json',
				required: true,
				default: '[]',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['replace_order_items'],
					},
				},
				description: 'JSON array of item changes',
				placeholder: '[{"item_id": "item-1", "quantity": 2}]',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'options',
				required: true,
				options: [
					{ name: 'Price Difference', value: 'PRICE_DIFFERENCE' },
					{ name: 'Quality Issues', value: 'QUALITY_ISSUES' },
				],
				default: 'PRICE_DIFFERENCE',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['refund_order_items'],
					},
				},
				description: 'Reason for refund',
			},
			{
				displayName: 'Item Refunds',
				name: 'item_refunds',
				type: 'json',
				required: true,
				default: '[]',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['refund_order_items'],
					},
				},
				description: 'JSON array of item refund data',
				placeholder: '[{"item_id": "item-1", "quantity": 1, "amount": 10.50}]',
			},
			{
				displayName: 'Basket Refunds',
				name: 'basket_refunds',
				type: 'json',
				required: true,
				default: '[]',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['refund_order_basket'],
					},
				},
				description: 'JSON array of basket refund data',
				placeholder: '[{"amount": 10.50, "reason": "Customer request"}]',
			},
			{
				displayName: 'Location (Longitude)',
				name: 'location_lon',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_courier_location'],
					},
				},
				description: 'Longitude coordinate',
			},
			{
				displayName: 'Location (Latitude)',
				name: 'location_lat',
				type: 'number',
				required: true,
				default: 0,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_courier_location'],
					},
				},
				description: 'Latitude coordinate',
			},
			{
				displayName: 'Heading',
				name: 'heading',
				type: 'number',
				default: 0,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_courier_location'],
					},
				},
				description: 'Direction in degrees (0-360)',
			},
			{
				displayName: 'Is Delivering This Order',
				name: 'is_delivering_this_order',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_courier_location'],
					},
				},
				description: 'Whether courier is currently delivering this order',
			},
			{
				displayName: 'ETA Minutes',
				name: 'eta_minutes',
				type: 'number',
				required: true,
				default: 30,
				typeOptions: {
					minValue: 0,
				},
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['update_delivery_eta'],
					},
				},
				description: 'Estimated time of arrival in minutes',
			},
			{
				displayName: 'Document Type',
				name: 'document_type',
				type: 'options',
				required: true,
				options: [
					{ name: 'Invoice', value: 'INVOICE' },
					{ name: 'Receipt', value: 'RECEIPT' },
					{ name: 'Refund', value: 'REFUND' },
					{ name: 'Return', value: 'RETURN' },
					{ name: 'Alcohol Sale', value: 'ALCOHOL_SALE' },
					{ name: 'Invoice Correction', value: 'INVOICE_CORRECTION' },
					{ name: 'Alcohol Sale Correction', value: 'ALCOHOL_SALE_CORRECTION' },
				],
				default: 'INVOICE',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['get_document_upload_link'],
					},
				},
				description: 'Type of document to upload',
			},
			{
				displayName: 'Cancel Reason',
				name: 'cancel_reason',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['orders'],
						operation: ['cancel_order'],
					},
				},
				description: 'Reason for cancelling the order',
			},

			/* ------------------------------------------------------------ */
			/* VENUE PARAMETERS                                             */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Delivery Provider',
				name: 'delivery_provider',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['venue'],
						operation: ['update_delivery_provider'],
					},
				},
				description: 'JSON object with delivery provider configuration',
				placeholder: '{"provider": "WOLT", "enabled": true}',
			},
			{
				displayName: 'Online',
				name: 'online',
				type: 'boolean',
				required: true,
				default: true,
				displayOptions: {
					show: {
						resource: ['venue'],
						operation: ['update_venue_online_status'],
					},
				},
				description: 'Whether the venue is online (accepting orders)',
			},
			{
				displayName: 'Opening Time',
				name: 'opening_time',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['venue'],
						operation: ['update_venue_opening_time'],
					},
				},
				description: 'JSON object with opening time configuration',
				placeholder: '{"monday": {"open": "09:00", "close": "22:00"}}',
			},
			{
				displayName: 'Special Opening Time',
				name: 'special_opening_time',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['venue'],
						operation: ['set_special_opening_time'],
					},
				},
				description: 'JSON object with special opening time (e.g., holidays)',
				placeholder: '{"date": "2024-12-25", "open": "10:00", "close": "18:00"}',
			},

			/* ------------------------------------------------------------ */
			/* MENU PARAMETERS                                              */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Menu',
				name: 'menu',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['create_or_update_menu'],
					},
				},
				description: 'JSON object with complete menu structure',
				placeholder: '{"sections": [{"name": "Main", "items": [...]}]}',
			},
			{
				displayName: 'Item ID',
				name: 'item_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['update_item_inventory', 'update_item', 'update_option_value'],
					},
				},
				description: 'The unique identifier of the menu item',
			},
			{
				displayName: 'Inventory',
				name: 'inventory',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['update_item_inventory'],
					},
				},
				description: 'JSON object with inventory/availability data',
				placeholder: '{"available": true, "quantity": 10}',
			},
			{
				displayName: 'Item',
				name: 'item',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['update_item'],
					},
				},
				description: 'JSON object with item details to update',
				placeholder: '{"name": "Pizza", "price": 12.99}',
			},
			{
				displayName: 'Option ID',
				name: 'option_id',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['update_option_value'],
					},
				},
				description: 'The unique identifier of the option',
			},
			{
				displayName: 'Option Value',
				name: 'option_value',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['menu'],
						operation: ['update_option_value'],
					},
				},
				description: 'JSON object with option value to update',
				placeholder: '{"price": 2.50, "available": true}',
			},

			/* ------------------------------------------------------------ */
			/* TIMESLOTS PARAMETERS                                         */
			/* ------------------------------------------------------------ */
			{
				displayName: 'Schedule',
				name: 'schedule',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						resource: ['timeslots'],
						operation: ['update_timeslots'],
					},
				},
				description: 'JSON object with schedule configuration',
				placeholder: '{"monday": {"slots": [{"start": "10:00", "end": "14:00"}]}}',
			},
			{
				displayName: 'Delivery Lead Time',
				name: 'delivery_lead_time',
				type: 'number',
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				displayOptions: {
					show: {
						resource: ['timeslots'],
						operation: ['update_timeslots'],
					},
				},
				description: 'Delivery lead time in minutes (at least one of schedule or delivery_lead_time must be provided)',
			},
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
				// const resource = this.getNodeParameter('resource', i) as string;

				/* Gather all user-supplied params */
				let params: Record<string, any> = {};

				// Handle order_id parameter
				try {
					const orderId = this.getNodeParameter('order_id', i, undefined) as string;
					if (orderId !== undefined && orderId !== '') {
						params.order_id = orderId;
					}
				} catch {
					// Field not present, skip
				}

				// Handle order_reference_id parameter
				try {
					const orderRefId = this.getNodeParameter('order_reference_id', i, undefined) as string;
					if (orderRefId !== undefined && orderRefId !== '') {
						params.order_reference_id = orderRefId;
					}
				} catch {
					// Field not present, skip
				}

				// Handle success parameter
				try {
					const success = this.getNodeParameter('success', i, undefined);
					if (success !== undefined) {
						params.success = success;
					}
				} catch {
					// Field not present, skip
				}

				// Handle time_sent_to_pos parameter
				try {
					const timeSentToPos = this.getNodeParameter('time_sent_to_pos', i, undefined) as string;
					if (timeSentToPos !== undefined && timeSentToPos !== '') {
						params.time_sent_to_pos = timeSentToPos;
					}
				} catch {
					// Field not present, skip
				}

				// Handle item_changes parameter
				try {
					const itemChanges = this.getNodeParameter('item_changes', i, undefined) as string;
					if (itemChanges !== undefined && itemChanges !== '' && itemChanges !== '[]') {
						try {
							params.item_changes = JSON.parse(itemChanges);
						} catch {
							params.item_changes = itemChanges;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle reason parameter (for refund_order_items)
				try {
					const reason = this.getNodeParameter('reason', i, undefined) as string;
					if (reason !== undefined && reason !== '') {
						params.reason = reason;
					}
				} catch {
					// Field not present, skip
				}

				// Handle item_refunds parameter
				try {
					const itemRefunds = this.getNodeParameter('item_refunds', i, undefined) as string;
					if (itemRefunds !== undefined && itemRefunds !== '' && itemRefunds !== '[]') {
						try {
							params.item_refunds = JSON.parse(itemRefunds);
						} catch {
							params.item_refunds = itemRefunds;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle basket_refunds parameter
				try {
					const basketRefunds = this.getNodeParameter('basket_refunds', i, undefined) as string;
					if (basketRefunds !== undefined && basketRefunds !== '' && basketRefunds !== '[]') {
						try {
							params.basket_refunds = JSON.parse(basketRefunds);
						} catch {
							params.basket_refunds = basketRefunds;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle location parameters
				try {
					const locationLon = this.getNodeParameter('location_lon', i, undefined) as number;
					const locationLat = this.getNodeParameter('location_lat', i, undefined) as number;
					if (locationLon !== undefined && locationLat !== undefined) {
						params.location = {
							lon: locationLon,
							lat: locationLat,
						};
					}
				} catch {
					// Field not present, skip
				}

				// Handle heading parameter
				try {
					const heading = this.getNodeParameter('heading', i, undefined) as number;
					if (heading !== undefined) {
						params.heading = heading;
					}
				} catch {
					// Field not present, skip
				}

				// Handle is_delivering_this_order parameter
				try {
					const isDelivering = this.getNodeParameter('is_delivering_this_order', i, undefined);
					if (isDelivering !== undefined) {
						params.is_delivering_this_order = isDelivering;
					}
				} catch {
					// Field not present, skip
				}

				// Handle eta_minutes parameter
				try {
					const etaMinutes = this.getNodeParameter('eta_minutes', i, undefined) as number;
					if (etaMinutes !== undefined) {
						params.eta_minutes = etaMinutes;
					}
				} catch {
					// Field not present, skip
				}

				// Handle document_type parameter
				try {
					const documentType = this.getNodeParameter('document_type', i, undefined) as string;
					if (documentType !== undefined && documentType !== '') {
						params.document_type = documentType;
					}
				} catch {
					// Field not present, skip
				}

				// Handle cancel_reason parameter
				try {
					const cancelReason = this.getNodeParameter('cancel_reason', i, undefined) as string;
					if (cancelReason !== undefined && cancelReason !== '') {
						params.reason = cancelReason;
					}
				} catch {
					// Field not present, skip
				}

				// Handle delivery_provider parameter
				try {
					const deliveryProvider = this.getNodeParameter('delivery_provider', i, undefined) as string;
					if (deliveryProvider !== undefined && deliveryProvider !== '' && deliveryProvider !== '{}') {
						try {
							params.delivery_provider = JSON.parse(deliveryProvider);
						} catch {
							params.delivery_provider = deliveryProvider;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle online parameter
				try {
					const online = this.getNodeParameter('online', i, undefined);
					if (online !== undefined) {
						params.online = online;
					}
				} catch {
					// Field not present, skip
				}

				// Handle opening_time parameter
				try {
					const openingTime = this.getNodeParameter('opening_time', i, undefined) as string;
					if (openingTime !== undefined && openingTime !== '' && openingTime !== '{}') {
						try {
							params.opening_time = JSON.parse(openingTime);
						} catch {
							params.opening_time = openingTime;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle special_opening_time parameter
				try {
					const specialOpeningTime = this.getNodeParameter('special_opening_time', i, undefined) as string;
					if (specialOpeningTime !== undefined && specialOpeningTime !== '' && specialOpeningTime !== '{}') {
						try {
							params.special_opening_time = JSON.parse(specialOpeningTime);
						} catch {
							params.special_opening_time = specialOpeningTime;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle menu parameter
				try {
					const menu = this.getNodeParameter('menu', i, undefined) as string;
					if (menu !== undefined && menu !== '' && menu !== '{}') {
						try {
							params.menu = JSON.parse(menu);
						} catch {
							params.menu = menu;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle item_id parameter
				try {
					const itemId = this.getNodeParameter('item_id', i, undefined) as string;
					if (itemId !== undefined && itemId !== '') {
						params.item_id = itemId;
					}
				} catch {
					// Field not present, skip
				}

				// Handle inventory parameter
				try {
					const inventory = this.getNodeParameter('inventory', i, undefined) as string;
					if (inventory !== undefined && inventory !== '' && inventory !== '{}') {
						try {
							params.inventory = JSON.parse(inventory);
						} catch {
							params.inventory = inventory;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle item parameter
				try {
					const item = this.getNodeParameter('item', i, undefined) as string;
					if (item !== undefined && item !== '' && item !== '{}') {
						try {
							params.item = JSON.parse(item);
						} catch {
							params.item = item;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle option_id parameter
				try {
					const optionId = this.getNodeParameter('option_id', i, undefined) as string;
					if (optionId !== undefined && optionId !== '') {
						params.option_id = optionId;
					}
				} catch {
					// Field not present, skip
				}

				// Handle option_value parameter
				try {
					const optionValue = this.getNodeParameter('option_value', i, undefined) as string;
					if (optionValue !== undefined && optionValue !== '' && optionValue !== '{}') {
						try {
							params.value = JSON.parse(optionValue);
						} catch {
							params.value = optionValue;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle schedule parameter
				try {
					const schedule = this.getNodeParameter('schedule', i, undefined) as string;
					if (schedule !== undefined && schedule !== '' && schedule !== '{}') {
						try {
							params.schedule = JSON.parse(schedule);
						} catch {
							params.schedule = schedule;
						}
					}
				} catch {
					// Field not present, skip
				}

				// Handle delivery_lead_time parameter
				try {
					const deliveryLeadTime = this.getNodeParameter('delivery_lead_time', i, undefined) as number;
					if (deliveryLeadTime !== undefined) {
						params.delivery_lead_time = deliveryLeadTime;
					}
				} catch {
					// Field not present, skip
				}

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

