"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunErpPrintLabel = void 0;
exports.RunErpPrintLabel = {
    declare: [
        {
            displayName: 'Shipment ID',
            name: 'shipment_id',
            type: 'number',
            required: true,
            default: '',
            description: 'The shipment number (ship_create_num) returned from the create shipment response',
            displayOptions: { show: { resource: ['label'], operation: ['print_label'] } },
        },
        {
            displayName: 'Reference Number',
            name: 'reference_number',
            type: 'string',
            required: false,
            default: '',
            description: 'Your reference number (from P26 in create shipment). Only required if you have identification letters at the shipping company.',
            displayOptions: { show: { resource: ['label'], operation: ['print_label'] } },
        },
        {
            displayName: 'Label Info',
            name: 'labelNotice',
            type: 'notice',
            default: '',
            displayOptions: { show: { resource: ['label'], operation: ['print_label'] } },
            typeOptions: {
                noticeType: 'info',
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        params.shipment_id = getNodeParameter('shipment_id', i);
        try {
            const referenceNumber = getNodeParameter('reference_number', i, '');
            if (referenceNumber && referenceNumber.trim() !== '') {
                params.reference_number = referenceNumber;
            }
        }
        catch {
        }
        return params;
    },
};
//# sourceMappingURL=run-erp-print-label.constant.js.map