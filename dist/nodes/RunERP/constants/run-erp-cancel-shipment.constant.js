"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunErpCancelShipment = void 0;
exports.RunErpCancelShipment = {
    declare: [
        {
            displayName: 'Shipment Random ID',
            name: 'ship_num_rand',
            type: 'string',
            required: true,
            default: '',
            description: 'The random shipment ID (ship_num_rand) returned from the create shipment response. This is different from ship_create_num.',
            displayOptions: { show: { resource: ['shipment'], operation: ['cancel_shipment'] } },
        },
        {
            displayName: 'Notice',
            name: 'cancelNotice',
            type: 'notice',
            default: '',
            displayOptions: { show: { resource: ['shipment'], operation: ['cancel_shipment'] } },
            typeOptions: {
                noticeType: 'info',
            },
        },
    ],
    process: (params, i, getNodeParameter) => {
        params.ship_num_rand = getNodeParameter('ship_num_rand', i);
        return params;
    },
};
//# sourceMappingURL=run-erp-cancel-shipment.constant.js.map