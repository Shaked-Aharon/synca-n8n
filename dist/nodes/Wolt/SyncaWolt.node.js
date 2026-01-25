"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncaWolt = void 0;
class SyncaWolt {
    constructor() {
        this.description = {
            usableAsTool: true,
            displayName: 'Synca Wolt',
            name: 'customSyncaWolt',
            documentationUrl: 'https://n8n.synca.co.il/docs',
            icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
            group: ['transform'],
            version: 1,
            description: 'Invoke Wolt actions via the Synca backend - Orders, Venue, Menu, and Timeslots management',
            subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
            defaults: { name: 'Synca Wolt' },
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
                    description: 'Select the Wolt credentials to use',
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
                            description: 'Manage orders, refunds, tracking, and cancellations',
                        },
                        {
                            name: 'Menu',
                            value: 'menu',
                            description: 'Manage menu items, inventory, and options',
                        },
                    ],
                    default: 'orders',
                },
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
                    ],
                    default: 'get_order',
                },
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    noDataExpression: true,
                    displayOptions: { show: { resource: ['menu'] } },
                    options: [
                        {
                            name: 'Update Item',
                            value: 'update_item',
                            description: 'Update item details (price, name, etc.)',
                        },
                    ],
                    default: 'get_menu',
                },
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
                            operation: ['update_option_value'],
                        },
                    },
                    description: 'The unique identifier of the menu item',
                },
                {
                    displayName: 'Item Identifier Type',
                    name: 'item_identifier_type',
                    type: 'options',
                    required: true,
                    default: 'external_id',
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                        },
                    },
                    options: [
                        { name: 'External ID', value: 'external_id' },
                        { name: 'GTIN', value: 'gtin' },
                        { name: 'SKU', value: 'sku' },
                    ],
                    description: 'Type of identifier to use for the item',
                },
                {
                    displayName: 'Identifier Value',
                    name: 'item_identifier_value',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                        },
                    },
                    description: 'Value of the chosen identifier',
                },
                {
                    displayName: 'Price',
                    name: 'price',
                    type: 'number',
                    required: false,
                    default: null,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item', 'update_option_value'],
                        },
                    },
                    description: 'New price for the item or option value',
                },
                {
                    displayName: 'Discounted Price',
                    name: 'discounted_price',
                    type: 'number',
                    required: false,
                    default: null,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                        },
                    },
                    description: 'New discounted price for the item',
                },
                {
                    displayName: 'Enabled',
                    name: 'enabled',
                    type: 'boolean',
                    required: false,
                    default: null,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item', 'update_option_value'],
                        },
                    },
                    description: 'Whether the item/option is enabled',
                },
                {
                    displayName: 'Disabled Until',
                    name: 'disabled_until',
                    type: 'dateTime',
                    required: false,
                    default: null,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                        },
                    },
                    description: 'Automatically re-enable item at this time',
                },
                {
                    displayName: 'Item Stock Type',
                    name: 'item_stock_type',
                    type: 'options',
                    required: true,
                    default: 'numeric',
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                        },
                    },
                    options: [
                        { name: 'Numeric', value: 'numeric' },
                        { name: 'Boolean', value: 'boolean' },
                    ],
                    description: 'Type of identifier to use for the item',
                },
                {
                    displayName: 'In Stock',
                    name: 'in_stock',
                    type: 'boolean',
                    required: false,
                    default: null,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item'],
                            item_stock_type: ['boolean'],
                        },
                    },
                    description: 'Whether the item is in stock',
                },
                {
                    displayName: 'Item SKU',
                    name: 'item_sku',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item_inventory'],
                        },
                    },
                    description: 'The SKU of the menu item',
                },
                {
                    displayName: 'Item Quantity',
                    name: 'inventory',
                    type: 'number',
                    required: true,
                    default: 0,
                    displayOptions: {
                        show: {
                            resource: ['menu'],
                            operation: ['update_item_inventory', 'update_item'],
                            item_stock_type: ['numeric'],
                        },
                    },
                    description: 'The quantity of the menu item',
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
                try {
                    const orderId = this.getNodeParameter('order_id', i, undefined);
                    if (orderId !== undefined && orderId !== '') {
                        params.order_id = orderId;
                    }
                }
                catch {
                }
                try {
                    const orderRefId = this.getNodeParameter('order_reference_id', i, undefined);
                    if (orderRefId !== undefined && orderRefId !== '') {
                        params.order_reference_id = orderRefId;
                    }
                }
                catch {
                }
                try {
                    const success = this.getNodeParameter('success', i, undefined);
                    if (success !== undefined) {
                        params.success = success;
                    }
                }
                catch {
                }
                try {
                    const timeSentToPos = this.getNodeParameter('time_sent_to_pos', i, undefined);
                    if (timeSentToPos !== undefined && timeSentToPos !== '') {
                        params.time_sent_to_pos = timeSentToPos;
                    }
                }
                catch {
                }
                try {
                    const itemChanges = this.getNodeParameter('item_changes', i, undefined);
                    if (itemChanges !== undefined && itemChanges !== '' && itemChanges !== '[]') {
                        try {
                            params.item_changes = JSON.parse(itemChanges);
                        }
                        catch {
                            params.item_changes = itemChanges;
                        }
                    }
                }
                catch {
                }
                try {
                    const reason = this.getNodeParameter('reason', i, undefined);
                    if (reason !== undefined && reason !== '') {
                        params.reason = reason;
                    }
                }
                catch {
                }
                try {
                    const itemRefunds = this.getNodeParameter('item_refunds', i, undefined);
                    if (itemRefunds !== undefined && itemRefunds !== '' && itemRefunds !== '[]') {
                        try {
                            params.item_refunds = JSON.parse(itemRefunds);
                        }
                        catch {
                            params.item_refunds = itemRefunds;
                        }
                    }
                }
                catch {
                }
                try {
                    const basketRefunds = this.getNodeParameter('basket_refunds', i, undefined);
                    if (basketRefunds !== undefined && basketRefunds !== '' && basketRefunds !== '[]') {
                        try {
                            params.basket_refunds = JSON.parse(basketRefunds);
                        }
                        catch {
                            params.basket_refunds = basketRefunds;
                        }
                    }
                }
                catch {
                }
                try {
                    const locationLon = this.getNodeParameter('location_lon', i, undefined);
                    const locationLat = this.getNodeParameter('location_lat', i, undefined);
                    if (locationLon !== undefined && locationLat !== undefined) {
                        params.location = {
                            lon: locationLon,
                            lat: locationLat,
                        };
                    }
                }
                catch {
                }
                try {
                    const heading = this.getNodeParameter('heading', i, undefined);
                    if (heading !== undefined) {
                        params.heading = heading;
                    }
                }
                catch {
                }
                try {
                    const isDelivering = this.getNodeParameter('is_delivering_this_order', i, undefined);
                    if (isDelivering !== undefined) {
                        params.is_delivering_this_order = isDelivering;
                    }
                }
                catch {
                }
                try {
                    const etaMinutes = this.getNodeParameter('eta_minutes', i, undefined);
                    if (etaMinutes !== undefined) {
                        params.eta_minutes = etaMinutes;
                    }
                }
                catch {
                }
                try {
                    const documentType = this.getNodeParameter('document_type', i, undefined);
                    if (documentType !== undefined && documentType !== '') {
                        params.document_type = documentType;
                    }
                }
                catch {
                }
                try {
                    const cancelReason = this.getNodeParameter('cancel_reason', i, undefined);
                    if (cancelReason !== undefined && cancelReason !== '') {
                        params.reason = cancelReason;
                    }
                }
                catch {
                }
                try {
                    const deliveryProvider = this.getNodeParameter('delivery_provider', i, undefined);
                    if (deliveryProvider !== undefined && deliveryProvider !== '' && deliveryProvider !== '{}') {
                        try {
                            params.delivery_provider = JSON.parse(deliveryProvider);
                        }
                        catch {
                            params.delivery_provider = deliveryProvider;
                        }
                    }
                }
                catch {
                }
                try {
                    const online = this.getNodeParameter('online', i, undefined);
                    if (online !== undefined) {
                        params.online = online;
                    }
                }
                catch {
                }
                try {
                    const openingTime = this.getNodeParameter('opening_time', i, undefined);
                    if (openingTime !== undefined && openingTime !== '' && openingTime !== '{}') {
                        try {
                            params.opening_time = JSON.parse(openingTime);
                        }
                        catch {
                            params.opening_time = openingTime;
                        }
                    }
                }
                catch {
                }
                try {
                    const specialOpeningTime = this.getNodeParameter('special_opening_time', i, undefined);
                    if (specialOpeningTime !== undefined && specialOpeningTime !== '' && specialOpeningTime !== '{}') {
                        try {
                            params.special_opening_time = JSON.parse(specialOpeningTime);
                        }
                        catch {
                            params.special_opening_time = specialOpeningTime;
                        }
                    }
                }
                catch {
                }
                try {
                    const menu = this.getNodeParameter('menu', i, undefined);
                    if (menu !== undefined && menu !== '' && menu !== '{}') {
                        try {
                            params.menu = JSON.parse(menu);
                        }
                        catch {
                            params.menu = menu;
                        }
                    }
                }
                catch {
                }
                if (operation === 'update_item') {
                    const itemUpdate = {};
                    const idType = this.getNodeParameter('item_identifier_type', i);
                    const idValue = this.getNodeParameter('item_identifier_value', i);
                    if (idType === 'external_id')
                        itemUpdate.external_id = idValue;
                    else if (idType === 'gtin')
                        itemUpdate.gtin = idValue;
                    else if (idType === 'sku')
                        itemUpdate.sku = idValue;
                    try {
                        const price = this.getNodeParameter('price', i, undefined);
                        if (price !== undefined && price !== '')
                            itemUpdate.price = price;
                    }
                    catch { }
                    try {
                        const discountedPrice = this.getNodeParameter('discounted_price', i, undefined);
                        if (discountedPrice !== undefined && discountedPrice !== '')
                            itemUpdate.discounted_price = discountedPrice;
                    }
                    catch { }
                    try {
                        const enabled = this.getNodeParameter('enabled', i, undefined);
                        if (enabled !== undefined)
                            itemUpdate.enabled = enabled;
                    }
                    catch { }
                    try {
                        const disabledUntil = this.getNodeParameter('disabled_until', i, undefined);
                        if (disabledUntil !== undefined && disabledUntil !== '')
                            itemUpdate.disabled_until = disabledUntil;
                    }
                    catch { }
                    try {
                        const inStock = this.getNodeParameter('in_stock', i, undefined);
                        if (inStock !== undefined)
                            itemUpdate.in_stock = inStock;
                    }
                    catch { }
                    try {
                        const inventory = this.getNodeParameter('inventory', i, undefined);
                        if (inventory !== undefined)
                            itemUpdate.inventory = inventory;
                    }
                    catch { }
                    params.data = [itemUpdate];
                }
                if (operation === 'update_option_value') {
                    const optionUpdate = {};
                    const optionId = this.getNodeParameter('option_id', i);
                    optionUpdate.external_id = optionId;
                    try {
                        const price = this.getNodeParameter('price', i, undefined);
                        if (price !== undefined && price !== '')
                            optionUpdate.price = price;
                    }
                    catch { }
                    try {
                        const enabled = this.getNodeParameter('enabled', i, undefined);
                        if (enabled !== undefined)
                            optionUpdate.enabled = enabled;
                    }
                    catch { }
                    params.data = [optionUpdate];
                }
                try {
                    const schedule = this.getNodeParameter('schedule', i, undefined);
                    if (schedule !== undefined && schedule !== '' && schedule !== '{}') {
                        try {
                            params.schedule = JSON.parse(schedule);
                        }
                        catch {
                            params.schedule = schedule;
                        }
                    }
                }
                catch {
                }
                try {
                    const deliveryLeadTime = this.getNodeParameter('delivery_lead_time', i, undefined);
                    if (deliveryLeadTime !== undefined) {
                        params.delivery_lead_time = deliveryLeadTime;
                    }
                }
                catch {
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
exports.SyncaWolt = SyncaWolt;
//# sourceMappingURL=SyncaWolt.node.js.map