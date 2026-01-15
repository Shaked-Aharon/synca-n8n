import { INodeProperties } from 'n8n-workflow';

export const RunErpGetPickupPoints = {
    declare: [
        {
            displayName: 'Lookup Method',
            name: 'pickup_lookup_method',
            type: 'options',
            required: true,
            default: 'all',
            options: [
                {
                    name: 'All Pickup Points',
                    value: 'all',
                    description: 'Get all available pickup points',
                },
                {
                    name: 'By City Name',
                    value: 'city_name',
                    description: 'Filter by city name (Hebrew)',
                },
                {
                    name: 'By City Code',
                    value: 'city_code',
                    description: 'Filter by city code from gov.il database',
                },
            ],
            description: 'How to filter pickup points',
            displayOptions: { show: { resource: ['pickup_points'], operation: ['get_pickup_points'] } },
        },
        {
            displayName: 'City Name',
            name: 'city_name',
            type: 'string',
            required: true,
            default: '',
            placeholder: 'תל אביב',
            description: 'City name in Hebrew',
            displayOptions: {
                show: {
                    resource: ['pickup_points'],
                    operation: ['get_pickup_points'],
                    pickup_lookup_method: ['city_name'],
                }
            },
        },
        {
            displayName: 'City Code',
            name: 'city_code',
            type: 'number',
            required: true,
            default: '',
            placeholder: '5000',
            description: 'City code from the gov.il database (e.g., 5000 for Tel Aviv, 3000 for Jerusalem)',
            displayOptions: {
                show: {
                    resource: ['pickup_points'],
                    operation: ['get_pickup_points'],
                    pickup_lookup_method: ['city_code'],
                }
            },
        },
        {
            displayName: 'Pickup Points Info',
            name: 'pickupPointsNotice',
            type: 'notice',
            default: '',
            displayOptions: { show: { resource: ['pickup_points'], operation: ['get_pickup_points'] } },
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
        const lookupMethod = getNodeParameter('pickup_lookup_method', i) as string;

        if (lookupMethod === 'all') {
            params.city_name = 'all';
        } else if (lookupMethod === 'city_name') {
            params.city_name = getNodeParameter('city_name', i) as string;
        } else if (lookupMethod === 'city_code') {
            params.city_code = getNodeParameter('city_code', i) as number;
        }

        return params;
    },
};