export const CashcowCheckOrderTracking = {
    declare: [
        {
            displayName: 'Order ID',
            name: 'order_id',
            type: 'number',
            required: true,
            default: 0,
            description: 'Order ID to track',
            displayOptions: { show: { resource: ['store'], operation: ['check_order_tracking'] } },
        },
        {
            displayName: 'Customer Email',
            name: 'email_address',
            type: 'string',
            required: true,
            default: '',
            description: 'Customer email address associated with the order',
            displayOptions: { show: { resource: ['store'], operation: ['check_order_tracking'] } },
        },
    ],
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => {
        // Required fields
        const orderId = getNodeParameter('order_id', i) as number;
        const emailAddress = getNodeParameter('email_address', i) as string;

        if (!orderId) throw new Error('Order ID is required');
        if (!emailAddress || emailAddress.trim() === '') throw new Error('Customer email is required');

        params.order_id = orderId;
        params.email_address = emailAddress.trim();

        return params;
    }
};