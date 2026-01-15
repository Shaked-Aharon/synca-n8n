import { INodeProperties } from 'n8n-workflow';

export const RunErpPrintLabel = {
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
        params.shipment_id = getNodeParameter('shipment_id', i) as number;

        try {
            const referenceNumber = getNodeParameter('reference_number', i, '') as string;
            if (referenceNumber && referenceNumber.trim() !== '') {
                params.reference_number = referenceNumber;
            }
        } catch {
            // Field not present, skip
        }

        return params;
    },
};