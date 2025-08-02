"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrioritySales = void 0;
exports.PrioritySales = {
    declare: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['sales'],
                },
            },
            options: [
                {
                    name: 'Create Order',
                    value: 'create_order',
                    description: 'Create a new sales order',
                    action: 'Create an order',
                },
                {
                    name: 'Update Order',
                    value: 'update_order',
                    description: 'Update a sales order',
                    action: 'Update an order',
                },
                {
                    name: 'Search Orders',
                    value: 'list_orders',
                    description: 'Search in all orders',
                    action: 'Search orders',
                },
                {
                    name: 'Get Order',
                    value: 'get_order',
                    description: 'Get a specific order',
                    action: 'Get an order',
                },
                {
                    name: 'Create Invoice',
                    value: 'create_invoice',
                    description: 'Create a new invoice',
                    action: 'Create an invoice',
                },
                {
                    name: 'Update Invoice',
                    value: 'update_invoice',
                    description: 'Update a invoice',
                    action: 'Update an invoice',
                },
                {
                    name: 'Search Invoices',
                    value: 'list_invoices',
                    description: 'Search all invoices',
                    action: 'Search invoices',
                },
                {
                    name: 'Get Invoice',
                    value: 'get_invoice',
                    description: 'Get a specific invoice',
                    action: 'Get an invoice',
                },
                {
                    name: 'Create Customer',
                    value: 'create_customer',
                    description: 'Create a new customer',
                    action: 'Create a customer',
                },
                {
                    name: 'Update Customer',
                    value: 'update_customer',
                    description: 'Update a customer',
                    action: 'Update a customer',
                },
                {
                    name: 'Search Customers',
                    value: 'list_customers',
                    description: 'Search all customers',
                    action: 'Search customers',
                },
                {
                    name: 'Get Customer',
                    value: 'get_customer',
                    description: 'Get a specific customer',
                    action: 'Get a customer',
                },
            ],
            default: 'list_customers',
        },
        {
            displayName: 'Row Data',
            name: 'rowData',
            type: 'resourceMapper',
            default: { mappingMode: 'defineBelow', value: null },
            required: true,
            displayOptions: {
                show: { resource: ['sales'], operation: ['create_customer', 'create_order', 'create_invoice', 'update_customer', 'update_order', 'update_invoice'] },
            },
            typeOptions: {
                loadOptionsDependsOn: ['operation', 'credentials'],
                refreshOn: ['operation', 'credentials'],
                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',
                    mode: 'add',
                    addAllFields: false,
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        {
            displayName: 'Customer ID',
            name: 'customerId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['sales'],
                    operation: ['get_customer'],
                },
            },
            default: '',
            description: 'The customer ID',
        },
        {
            displayName: 'Order ID',
            name: 'orderId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['sales'],
                    operation: ['get_order'],
                },
            },
            default: '',
            description: 'The order ID to retrieve',
        },
        {
            displayName: 'Invoice ID',
            name: 'invoiceId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['sales'],
                    operation: ['get_invoice'],
                },
            },
            default: '',
            description: 'The invoice ID to retrieve',
        },
        {
            displayName: 'Filters',
            name: 'filters',
            type: 'fixedCollection',
            placeholder: 'Add Filter',
            typeOptions: {
                multipleValues: true,
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            default: {},
            displayOptions: {
                show: { resource: ['sales'], operation: ['list_orders', 'list_customers', 'list_invoices'] },
            },
            options: [
                {
                    name: 'filter',
                    displayName: 'Filter',
                    values: [
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getFormFields',
                                loadOptionsDependsOn: ['credentials', 'operation'],
                                refreshOn: ['credentials', 'operation']
                            },
                            default: '',
                        },
                        {
                            displayName: 'Operator',
                            name: 'op',
                            type: 'options',
                            options: [
                                { name: 'Equals', value: 'eq' },
                                { name: 'Not Equals', value: 'neq' },
                                { name: 'Starts With', value: 'startWith' },
                                { name: 'Ends With', value: 'endWith' },
                                { name: 'Contain', value: 'in' },
                                { name: 'Greater Than', value: 'gt' },
                                { name: 'Greater or Equal', value: 'gte' },
                                { name: 'Less Than', value: 'lt' },
                                { name: 'Less or Equal', value: 'lte' },
                            ],
                            default: 'eq',
                        },
                        {
                            displayName: 'Value',
                            name: 'fromval',
                            type: 'string',
                            default: '',
                        },
                    ],
                },
            ],
        },
        {
            displayName: 'Return Fields',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            description: 'Leave empty to return all columns, or pick the ones you need.',
            typeOptions: {
                loadOptionsMethod: 'getFormFields',
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            displayOptions: {
                show: { resource: ['sales'], operation: ['list_orders', 'list_customers', 'list_invoices'] },
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        const cart = {
            Products: [],
            CustomerFields: {},
            DestinationId: 0,
            CustomShipingId: 0,
            IsSelfDelivery: false,
            StoreId: "",
            OrderId: "",
            CuponCode: "",
            ShipingOption: 0,
            ShipingArgs: [],
            CustomerID: "",
            PaymentExternals: [],
            PaymentType: 0,
            LanguageType: "2"
        };
        const customerName = getNodeParameter('customer_name', i);
        const customerEmail = getNodeParameter('customer_email', i);
        const totalAmount = getNodeParameter('total_amount', i);
        if (!customerName)
            throw new Error('Customer name is required');
        if (!customerEmail)
            throw new Error('Customer email is required');
        if (!totalAmount)
            throw new Error('Total amount is required');
        const nameParts = customerName.trim().split(' ');
        cart.CustomerFields.FirstName = nameParts[0] || '';
        cart.CustomerFields.LastName = nameParts.slice(1).join(' ') || '';
        cart.CustomerFields.Email = customerEmail;
        const is_use_shipping_for_billing = getNodeParameter('use_shipping_for_billing', i, false);
        if (is_use_shipping_for_billing) {
            cart.CustomerFields.PaymentFirstName = cart.CustomerFields.FirstName;
            cart.CustomerFields.PaymentLastName = cart.CustomerFields.LastName;
        }
        try {
            const customerPhone = getNodeParameter('customer_phone', i, undefined);
            if (customerPhone && customerPhone.trim() !== '') {
                cart.CustomerFields.Phone = customerPhone;
            }
        }
        catch { }
        try {
            const customerId = getNodeParameter('customer_id', i, undefined);
            if (customerId && customerId.trim() !== '') {
                cart.CustomerID = customerId;
            }
        }
        catch { }
        const addressParts = [];
        try {
            const shippingAddress = getNodeParameter('shipping_address', i, undefined);
            if (shippingAddress && shippingAddress.trim() !== '')
                addressParts.push(shippingAddress);
        }
        catch { }
        try {
            const shippingCity = getNodeParameter('shipping_city', i, undefined);
            if (shippingCity && shippingCity.trim() !== '')
                addressParts.push(shippingCity);
        }
        catch { }
        try {
            const shippingPostalCode = getNodeParameter('shipping_postal_code', i, undefined);
            if (shippingPostalCode && shippingPostalCode.trim() !== '')
                addressParts.push(shippingPostalCode);
        }
        catch { }
        if (addressParts.length > 0) {
            cart.CustomerFields.Address = addressParts.join(', ');
            cart.CustomerFields.City = cart.CustomerFields.Address;
        }
        try {
            const shippingCountry = getNodeParameter('shipping_country', i, undefined);
            if (shippingCountry && shippingCountry.trim() !== '') {
                cart.CustomerFields.CountryId = 103;
            }
        }
        catch { }
        try {
            const productsValue = getNodeParameter('products', i);
            if (productsValue && productsValue.trim() !== '' && productsValue !== '[]') {
                try {
                    const inputProducts = JSON.parse(productsValue);
                    if (!Array.isArray(inputProducts)) {
                        throw new Error('Products must be an array');
                    }
                    cart.Products = inputProducts.map((product) => ({
                        Title: product.Title || product.title || '',
                        Price: product.Price || product.price || 0,
                        Pid: product.Pid || product.pid || 0,
                        SKU: product.SKU || product.sku || '',
                        Attrs: product.Attrs || product.attrs || [],
                        Qty: product.Qty || product.qty || product.quantity || 1,
                        QtyType: product.QtyType || product.qtyType || 0,
                        QtyByWeight: product.QtyByWeight || product.qtyByWeight || 0,
                        SecondQtyType: product.SecondQtyType || product.secondQtyType || 0
                    }));
                }
                catch (parseError) {
                    throw new Error(`Invalid JSON in products: ${parseError.message}`);
                }
            }
            else {
                throw new Error('Products array is required for create_order operation');
            }
        }
        catch (error) {
            throw error;
        }
        try {
            const storeId = getNodeParameter('store_id', i, undefined);
            if (storeId !== undefined) {
                cart.StoreId = storeId;
            }
        }
        catch { }
        try {
            const couponCode = getNodeParameter('coupon_code', i, undefined);
            if (couponCode && couponCode.trim() !== '') {
                cart.CuponCode = couponCode;
            }
        }
        catch { }
        try {
            const orderNotes = getNodeParameter('order_notes', i, undefined);
            if (orderNotes && orderNotes.trim() !== '') {
                cart.CustomerFields.Instroductions = orderNotes;
            }
        }
        catch { }
        params.cart = cart;
        try {
            const isConfirmPayment = getNodeParameter('is_confirm_payment', i, undefined);
            if (isConfirmPayment !== undefined) {
                params.is_confirm_payment = isConfirmPayment;
            }
        }
        catch { }
        try {
            const successUrl = getNodeParameter('success_url', i, undefined);
            if (successUrl && successUrl.trim() !== '') {
                params.success_url = successUrl;
            }
        }
        catch { }
        try {
            const failedUrl = getNodeParameter('failed_url', i, undefined);
            if (failedUrl && failedUrl.trim() !== '') {
                params.failed_url = failedUrl;
            }
        }
        catch { }
        return params;
    }
};
//# sourceMappingURL=priority-sales.constant.js.map