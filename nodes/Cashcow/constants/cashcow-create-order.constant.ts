export const CashcowCreateOrder = {
    declare: [
        /* Store → Create Order  */
        // Customer Information
        {
            displayName: 'Customer Name',
            name: 'customer_name',
            type: 'string',
            required: true,
            default: '',
            description: 'Customer full name',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Customer Email',
            name: 'customer_email',
            type: 'string',
            required: true,
            default: '',
            description: 'Customer email address',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Customer Phone',
            name: 'customer_phone',
            type: 'string',
            default: '',
            description: 'Customer phone number',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Customer ID',
            name: 'customer_id',
            type: 'string',
            default: '',
            description: 'Customer ID (if existing customer)',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },

        // Shipping Address
        {
            displayName: 'Shipping Address',
            name: 'shipping_address',
            type: 'string',
            default: '',
            description: 'Shipping street address',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Shipping City',
            name: 'shipping_city',
            type: 'string',
            default: '',
            description: 'Shipping city',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Shipping Postal Code',
            name: 'shipping_postal_code',
            type: 'string',
            default: '',
            description: 'Shipping postal/zip code',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Shipping Country',
            name: 'shipping_country',
            type: 'string',
            default: '',
            description: 'Shipping country',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },

        // Billing Address (if different)
        {
            displayName: 'Use Shipping for Billing',
            name: 'use_shipping_for_billing',
            type: 'boolean',
            default: true,
            description: 'Use shipping address for billing',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Billing Address',
            name: 'billing_address',
            type: 'string',
            default: '',
            description: 'Billing street address',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    use_shipping_for_billing: [false]
                }
            },
        },
        {
            displayName: 'Billing City',
            name: 'billing_city',
            type: 'string',
            default: '',
            description: 'Billing city',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    use_shipping_for_billing: [false]
                }
            },
        },
        {
            displayName: 'Billing Postal Code',
            name: 'billing_postal_code',
            type: 'string',
            default: '',
            description: 'Billing postal/zip code',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    use_shipping_for_billing: [false]
                }
            },
        },
        {
            displayName: 'Billing Country',
            name: 'billing_country',
            type: 'string',
            default: '',
            description: 'Billing country',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    use_shipping_for_billing: [false]
                }
            },
        },

        // Products (keep as JSON since products can have complex structures)
        {
            displayName: 'Products (JSON)',
            name: 'products',
            type: 'json',
            required: true,
            default: '[{"Title":"","Price":1.5,"Pid":0,"SKU":"TEST","Qty":1}]',
            description: 'Array of products in cart. Each product should have: sku, quantity, price, etc.',
            placeholder: '[{"sku": "PROD-001", "quantity": 2, "price": 29.99}]',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },

        // Order Details
        {
            displayName: 'Currency',
            name: 'currency',
            type: 'options',
            default: 'ILS',
            options: [
                { name: 'Israeli Shekel (ILS)', value: 'ILS' },
                { name: 'US Dollar (USD)', value: 'USD' },
                { name: 'Euro (EUR)', value: 'EUR' },
            ],
            description: 'Order currency',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Subtotal',
            name: 'subtotal',
            type: 'number',
            default: 0,
            description: 'Order subtotal (before taxes and shipping)',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Tax Amount',
            name: 'tax_amount',
            type: 'number',
            default: 0,
            description: 'Tax amount',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Shipping Cost',
            name: 'shipping_cost',
            type: 'number',
            default: 0,
            description: 'Shipping cost',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Discount Amount',
            name: 'discount_amount',
            type: 'number',
            default: 0,
            description: 'Discount amount',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Total Amount',
            name: 'total_amount',
            type: 'number',
            required: true,
            default: 0,
            description: 'Total order amount',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },

        // Additional Options
        {
            displayName: 'Order Notes',
            name: 'order_notes',
            type: 'string',
            typeOptions: {
                rows: 3,
            },
            default: '',
            description: 'Customer notes for the order',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Coupon Code',
            name: 'coupon_code',
            type: 'string',
            default: '',
            description: 'Applied coupon code',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Shipping Method',
            name: 'shipping_method',
            type: 'string',
            default: '',
            description: 'Selected shipping method',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },

        // Payment Options
        {
            displayName: 'Confirm Payment',
            name: 'is_confirm_payment',
            type: 'boolean',
            default: false,
            description: 'True to confirm the order without credit card input, false to get payment_url for user to enter credit card',
            displayOptions: { show: { resource: ['store'], operation: ['create_order'] } },
        },
        {
            displayName: 'Success URL',
            name: 'success_url',
            type: 'string',
            default: '',
            description: 'Success URL after payment completion (optional, only used when confirm payment is false)',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    is_confirm_payment: [false]
                }
            },
        },
        {
            displayName: 'Failed URL',
            name: 'failed_url',
            type: 'string',
            default: '',
            description: 'Failed URL after payment failure (optional, only used when confirm payment is false)',
            displayOptions: {
                show: {
                    resource: ['store'],
                    operation: ['create_order'],
                    is_confirm_payment: [false]
                }
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

        const is_use_shipping_for_billing =  getNodeParameter('use_shipping_for_billing', i, false) as boolean;
        if(is_use_shipping_for_billing){
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