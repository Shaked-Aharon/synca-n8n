"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashcowCheckOrderTracking = void 0;
exports.CashcowCheckOrderTracking = {
    declare: [
        {
            displayName: 'Order ID',
            name: 'order_id',
            type: 'string',
            required: true,
            default: '',
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
    process: (params, i, getNodeParameter) => {
        const orderId = getNodeParameter('order_id', i);
        const emailAddress = getNodeParameter('email_address', i);
        if (!orderId)
            throw new Error('Order ID is required');
        if (!emailAddress || emailAddress.trim() === '')
            throw new Error('Customer email is required');
        params.order_id = orderId;
        params.email_address = emailAddress.trim();
        return params;
    }
};
//# sourceMappingURL=cashcow-check-order-tracking.constant.js.map