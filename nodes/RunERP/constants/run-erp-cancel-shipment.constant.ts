import { INodeProperties } from 'n8n-workflow';

export const RunErpCancelShipment = {
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
            // @ts-ignore - notice type supports this
            typeOptions: {
                noticeType: 'info',
            },
        },
    ] as INodeProperties[],

    process: (
        params: Record<string, any>,
        i: number,
        getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => any
    ): Record<string, any> => {
        params.ship_num_rand = getNodeParameter('ship_num_rand', i) as string;
        return params;
    },
};