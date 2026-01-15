"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunErpGetTracking = void 0;
exports.RunErpGetTracking = {
    declare: [
        {
            displayName: 'Lookup Method',
            name: 'lookup_method',
            type: 'options',
            required: true,
            default: 'shipment_id',
            options: [
                {
                    name: 'By Shipment ID',
                    value: 'shipment_id',
                    description: 'Look up using the shipment number from Run ERP',
                },
                {
                    name: 'By Reference Number',
                    value: 'reference',
                    description: 'Look up using your identification letters + reference number',
                },
            ],
            description: 'How to identify the shipment for tracking',
            displayOptions: { show: { resource: ['tracking'], operation: ['get_tracking'] } },
        },
        {
            displayName: 'Shipment ID',
            name: 'shipment_id',
            type: 'number',
            required: true,
            default: '',
            description: 'The shipment number (ship_create_num) returned from create shipment',
            displayOptions: {
                show: {
                    resource: ['tracking'],
                    operation: ['get_tracking'],
                    lookup_method: ['shipment_id'],
                }
            },
        },
        {
            displayName: 'Reference with Prefix',
            name: 'reference_with_prefix',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'AB987654321',
            description: 'Your identification letters at the shipping company + your reference number (e.g., AB987654321)',
            displayOptions: {
                show: {
                    resource: ['tracking'],
                    operation: ['get_tracking'],
                    lookup_method: ['reference'],
                }
            },
        },
        {
            displayName: 'Tracking Info',
            name: 'trackingNotice',
            type: 'notice',
            default: '',
            displayOptions: { show: { resource: ['tracking'], operation: ['get_tracking'] } },
            typeOptions: {
                noticeType: 'info',
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        const lookupMethod = getNodeParameter('lookup_method', i);
        if (lookupMethod === 'shipment_id') {
            params.shipment_id = getNodeParameter('shipment_id', i);
        }
        else {
            params.reference_with_prefix = getNodeParameter('reference_with_prefix', i);
        }
        return params;
    },
};
//# sourceMappingURL=run-erp-get-tracking.constant.js.map