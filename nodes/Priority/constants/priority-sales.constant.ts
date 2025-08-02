export const PrioritySales = {
    declare: [
        // Sales Operations
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
                // {
                //     name: 'Create Purchase Offer',
                //     value: 'create_purchase_offer',
                //     description: 'Create a new purchase offer',
                //     action: 'Create a purchase offer',
                // },
                // {
                //     name: 'Get Purchase Offer',
                //     value: 'get_purchase_offer',
                //     description: 'Get a specific purchase offer',
                //     action: 'Get a purchase offer',
                // },
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

        // Actions
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
                /* Re-fetch the schema whenever the form changes */
                loadOptionsDependsOn: ['operation', 'credentials'],
                refreshOn: ['operation', 'credentials'],

                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',  // see next section
                    mode: 'add',          // ← insert mode
                    addAllFields: false,   // show everything up front
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        // {
        //     displayName: 'Customer Name',
        //     name: 'customerName',
        //     type: 'string',
        //     required: true,
        //     displayOptions: {
        //         show: {
        //             resource: ['sales'],
        //             operation: ['create_customer'],
        //         },
        //     },
        //     default: '',
        //     description: 'The customer name (CUSTNAME)',
        // },
        // {
        //     displayName: 'Customer Email',
        //     name: 'customerEmail',
        //     type: 'string',
        //     displayOptions: {
        //         show: {
        //             resource: ['sales'],
        //             operation: ['create_customer'],
        //         },
        //     },
        //     default: '',
        //     description: 'The customer email',
        // },
        // {
        //     displayName: 'Customer Phone',
        //     name: 'customerPhone',
        //     type: 'string',
        //     displayOptions: {
        //         show: {
        //             resource: ['sales'],
        //             operation: ['create_customer'],
        //         },
        //     },
        //     default: '',
        //     description: 'The customer phone number',
        // },
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
        // {
        //     displayName: 'Order Name',
        //     name: 'orderName',
        //     type: 'string',
        //     displayOptions: {
        //         show: {
        //             resource: ['sales'],
        //             operation: ['create_order'],
        //         },
        //     },
        //     default: '',
        //     description: 'The order name (ORDNAME)',
        // },
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
                multipleValues: true,               // let the user add N rows
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],       // clear filters when procedure changes (n8n ≥ 1.90)
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
                        /* 1-A  Field ----------------------------------------- */
                        {
                            displayName: 'Field',
                            name: 'field',
                            type: 'options',
                            typeOptions: {
                                loadOptionsMethod: 'getFormFields',  // see §2
                                loadOptionsDependsOn: ['credentials', 'operation'],
                                refreshOn: ['credentials', 'operation']
                            },
                            default: '',
                        },

                        /* 1-B  Operator -------------------------------------- */
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

                        /* 1-C  Value ----------------------------------------- */
                        {
                            displayName: 'Value',
                            name: 'fromval',
                            type: 'string',          // you can switch to ‘number’/‘boolean’ dynamically later
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
            description:
                'Leave empty to return all columns, or pick the ones you need.',
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
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => {

        // Create the cart object with proper API structure
        const cart: any = {
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
            // TrafficSource: "utmcsr=(direct)|utmcmd=(none)|utmccn=(not set)",
            LanguageType: "2"
        };

        // Required fields validation
        const customerName = getNodeParameter('customer_name', i) as string;
        const customerEmail = getNodeParameter('customer_email', i) as string;
        const totalAmount = getNodeParameter('total_amount', i) as number;

        if (!customerName) throw new Error('Customer name is required');
        if (!customerEmail) throw new Error('Customer email is required');
        if (!totalAmount) throw new Error('Total amount is required');

        // Parse customer name into FirstName and LastName
        const nameParts = customerName.trim().split(' ');
        cart.CustomerFields.FirstName = nameParts[0] || '';
        cart.CustomerFields.LastName = nameParts.slice(1).join(' ') || '';
        cart.CustomerFields.Email = customerEmail;

        const is_use_shipping_for_billing = getNodeParameter('use_shipping_for_billing', i, false) as boolean;
        if (is_use_shipping_for_billing) {
            cart.CustomerFields.PaymentFirstName = cart.CustomerFields.FirstName;
            cart.CustomerFields.PaymentLastName = cart.CustomerFields.LastName;
        }
        // Optional customer fields
        try {
            const customerPhone = getNodeParameter('customer_phone', i, undefined) as string;
            if (customerPhone && customerPhone.trim() !== '') {
                cart.CustomerFields.Phone = customerPhone;
            }
        } catch { }

        try {
            const customerId = getNodeParameter('customer_id', i, undefined) as string;
            if (customerId && customerId.trim() !== '') {
                cart.CustomerID = customerId;
            }
        } catch { }

        // Shipping address - combine into single address field
        const addressParts = [];
        try {
            const shippingAddress = getNodeParameter('shipping_address', i, undefined) as string;
            if (shippingAddress && shippingAddress.trim() !== '') addressParts.push(shippingAddress);
        } catch { }

        try {
            const shippingCity = getNodeParameter('shipping_city', i, undefined) as string;
            if (shippingCity && shippingCity.trim() !== '') addressParts.push(shippingCity);
        } catch { }

        try {
            const shippingPostalCode = getNodeParameter('shipping_postal_code', i, undefined) as string;
            if (shippingPostalCode && shippingPostalCode.trim() !== '') addressParts.push(shippingPostalCode);
        } catch { }

        if (addressParts.length > 0) {
            cart.CustomerFields.Address = addressParts.join(', ');
            cart.CustomerFields.City = cart.CustomerFields.Address;
        }

        // Country handling
        try {
            const shippingCountry = getNodeParameter('shipping_country', i, undefined) as string;
            if (shippingCountry && shippingCountry.trim() !== '') {
                // You might want to map country names to CountryId numbers
                // For now, defaulting to Israel (103) as shown in API docs
                cart.CustomerFields.CountryId = 103;
            }
        } catch { }

        // Products (required JSON array) - convert to API format
        try {
            const productsValue = getNodeParameter('products', i) as string;
            if (productsValue && productsValue.trim() !== '' && productsValue !== '[]') {
                try {
                    const inputProducts = JSON.parse(productsValue);
                    if (!Array.isArray(inputProducts)) {
                        throw new Error('Products must be an array');
                    }

                    // Convert products to API format
                    cart.Products = inputProducts.map((product: any) => ({
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
                } catch (parseError) {
                    throw new Error(`Invalid JSON in products: ${(parseError as any).message}`);
                }
            } else {
                throw new Error('Products array is required for create_order operation');
            }
        } catch (error) {
            throw error;
        }

        // Store ID
        try {
            const storeId = getNodeParameter('store_id', i, undefined) as string;
            if (storeId !== undefined) {
                cart.StoreId = storeId;
            }
        } catch { }

        // Coupon code
        try {
            const couponCode = getNodeParameter('coupon_code', i, undefined) as string;
            if (couponCode && couponCode.trim() !== '') {
                cart.CuponCode = couponCode; // Note: API uses "CuponCode" (typo in their API)
            }
        } catch { }

        // Order notes - add to customer instructions
        try {
            const orderNotes = getNodeParameter('order_notes', i, undefined) as string;
            if (orderNotes && orderNotes.trim() !== '') {
                cart.CustomerFields.Instroductions = orderNotes; // Note: API uses "Instroductions" (typo in their API)
            }
        } catch { }

        // Set the constructed cart object
        params.cart = cart;

        // Payment confirmation
        try {
            const isConfirmPayment = getNodeParameter('is_confirm_payment', i, undefined);
            if (isConfirmPayment !== undefined) {
                params.is_confirm_payment = isConfirmPayment;
            }
        } catch { }

        // Success/Failed URLs
        try {
            const successUrl = getNodeParameter('success_url', i, undefined) as string;
            if (successUrl && successUrl.trim() !== '') {
                params.success_url = successUrl;
            }
        } catch { }

        try {
            const failedUrl = getNodeParameter('failed_url', i, undefined) as string;
            if (failedUrl && failedUrl.trim() !== '') {
                params.failed_url = failedUrl;
            }
        } catch { }

        return params;
    }
}