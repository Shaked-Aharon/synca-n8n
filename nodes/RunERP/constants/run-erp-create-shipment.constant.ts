import { INodeProperties } from 'n8n-workflow';

export const RunErpCreateShipment = {
    declare: [
        /* ------------------------------------------------------------ */
        /* Required Fields                                              */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Shipment Type',
            name: 'type',
            type: 'options',
            required: true,
            default: 'delivery',
            options: [
                { name: 'Delivery (מסירה)', value: 'delivery' },
                { name: 'Return (החזרה)', value: 'return' },
            ],
            description: 'Type of shipment - delivery or return',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'Shipment Destination Type',
            name: 'destination_type',
            type: 'options',
            required: true,
            default: 'customer_address',
            options: [
                { name: 'Customer Address (כתובת לקוח)', value: 'customer_address' },
                { name: 'Pickup Point (נקודת איסוף)', value: 'pickup_point' },
            ],
            description: 'Type of shipment destination - customer address or pickup point',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'Consignee Name',
            name: 'consignee_name',
            type: 'string',
            required: true,
            default: '',
            description: 'Name of the person receiving the shipment (P11)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'City',
            name: 'city',
            type: 'string',
            required: true,
            default: '',
            description: 'City/settlement name (P13)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'Street',
            name: 'street',
            type: 'string',
            required: true,
            default: '',
            description: 'Street name - can include building number (P15)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'Phone',
            name: 'phone',
            type: 'string',
            required: true,
            default: '',
            description: 'Primary phone number - cellular (P20)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
        },
        {
            displayName: 'Building Number',
            name: 'building_no',
            type: 'string',
            default: '',
            description: 'Building number (P16)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['customer_address'] } },
        },
        {
            displayName: 'Entrance',
            name: 'entrance',
            type: 'string',
            default: '',
            description: 'Entrance number (P17)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['customer_address'] } },
        },
        {
            displayName: 'Floor',
            name: 'floor',
            type: 'string',
            default: '',
            description: 'Floor number (P18)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['customer_address'] } },
        },
        {
            displayName: 'Apartment',
            name: 'apartment',
            type: 'string',
            default: '',
            description: 'Apartment number (P19)',
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['customer_address'] } },
        },

        /* ------------------------------------------------------------ */
        /* Address Details (Optional)                                   */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Address Details',
            name: 'addressDetails',
            type: 'collection',
            placeholder: 'Add Address Detail',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['customer_address'] } },
            options: [
                {
                    displayName: 'City Code',
                    name: 'city_code',
                    type: 'string',
                    default: '',
                    description: 'City code from gov.il database (P12)',
                },
                {
                    displayName: 'Street Code',
                    name: 'street_code',
                    type: 'string',
                    default: '',
                    description: 'Street code from gov.il database (P14)',
                },
                {
                    displayName: 'Address Remarks',
                    name: 'address_remarks',
                    type: 'string',
                    default: '',
                    description: 'Additional address remarks (P24)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Contact & Reference                                          */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Contact & Reference',
            name: 'contactReference',
            type: 'collection',
            placeholder: 'Add Contact/Reference',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
            options: [
                {
                    displayName: 'Additional Phone',
                    name: 'additional_phone',
                    type: 'string',
                    default: '',
                    description: 'Additional phone number (P21)',
                },
                {
                    displayName: 'Email',
                    name: 'email',
                    type: 'string',
                    default: '',
                    description: 'Consignee email address (P40)',
                },
                {
                    displayName: 'Ordered By',
                    name: 'ordered_by',
                    type: 'string',
                    default: '',
                    description: 'Name of person who ordered (P5)',
                },
                {
                    displayName: 'Reference Number',
                    name: 'reference_number',
                    type: 'string',
                    default: '',
                    description: 'Your reference number for the shipment (P22). Can include multiple references separated by ":"',
                },
                {
                    displayName: 'Reference Number 2',
                    name: 'reference_number_2',
                    type: 'string',
                    default: '',
                    description: 'Second reference number (P26)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Package Details                                              */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Package Details',
            name: 'packageDetails',
            type: 'collection',
            placeholder: 'Add Package Detail',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
            options: [
                {
                    displayName: 'Number of Packages',
                    name: 'package_count',
                    type: 'number',
                    default: 1,
                    typeOptions: { minValue: 1 },
                    description: 'Number of packages to be delivered (P23). Mandatory if more than 1 package.',
                },
                {
                    displayName: 'Shipment Remarks',
                    name: 'shipment_remarks',
                    type: 'string',
                    default: '',
                    description: 'Additional shipment remarks (P25)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Pickup/Scheduling                                            */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Scheduling',
            name: 'scheduling',
            type: 'collection',
            placeholder: 'Add Scheduling Option',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
            options: [
                {
                    displayName: 'Pickup Date',
                    name: 'pickup_date',
                    type: 'string',
                    default: '',
                    description: 'Specific pickup date in DD/MM/YYYY format (P27)',
                },
                {
                    displayName: 'Pickup Time',
                    name: 'pickup_time',
                    type: 'string',
                    default: '',
                    description: 'Specific pickup time in HH:MM format (P28)',
                },
                {
                    displayName: 'Preparation Date',
                    name: 'preparation_date',
                    type: 'string',
                    default: '',
                    description: 'Parcel preparation date DD/MM/YYYY - for warehouse assembly (P41)',
                },
                {
                    displayName: 'Preparation Time',
                    name: 'preparation_time',
                    type: 'string',
                    default: '',
                    description: 'Parcel preparation time HH:MM - for warehouse assembly (P42)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Pickup Points                                                */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Pickup Points',
            name: 'pickupPoints',
            type: 'collection',
            placeholder: 'Add Pickup Point Option',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'], destination_type: ['pickup_point'] } },
            options: [
                {
                    displayName: 'Destination Pickup Point',
                    name: 'destination_pickup_point',
                    type: 'number',
                    default: '',
                    description: 'Destination pickup point code (P35). If set, leave auto-assign as N.',
                },
                {
                    displayName: 'Source Pickup Point',
                    name: 'source_pickup_point',
                    type: 'number',
                    default: '',
                    description: 'Source pickup point - for returns only (P34)',
                },
                {
                    displayName: 'Auto-Assign Pickup Point',
                    name: 'auto_assign_pickup',
                    type: 'options',
                    default: 'N',
                    options: [
                        { name: 'Do Not Assign', value: 'N' },
                        { name: 'Any Type (Store or Locker)', value: 'Y' },
                        { name: 'Locker Only', value: 'L' },
                        { name: 'Store Only', value: 'S' },
                    ],
                    description: 'Auto-assign closest pickup point based on address (P37)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Payment Collection (COD)                                     */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Payment Collection (COD)',
            name: 'paymentCollection',
            type: 'collection',
            placeholder: 'Add Payment Option',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
            options: [
                {
                    displayName: 'Payment Type Code',
                    name: 'payment_type',
                    type: 'number',
                    default: '',
                    description: 'Payment type code - get from shipping company (P30)',
                },
                {
                    displayName: 'Payment Amount',
                    name: 'payment_amount',
                    type: 'number',
                    default: '',
                    typeOptions: { numberPrecision: 2 },
                    description: 'Amount to collect from consignee (P31)',
                },
                {
                    displayName: 'Payment Date',
                    name: 'payment_date',
                    type: 'string',
                    default: '',
                    description: 'Date of payment collection DD/MM/YYYY (P32)',
                },
                {
                    displayName: 'Payment Notes',
                    name: 'payment_notes',
                    type: 'string',
                    default: '',
                    description: 'Notes for payment collection (P33)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Return-Specific Options                                      */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Return Options',
            name: 'returnOptions',
            type: 'collection',
            placeholder: 'Add Return Option',
            default: {},
            displayOptions: {
                show: {
                    resource: ['shipment'],
                    operation: ['create_shipment'],
                    type: ['return'],
                }
            },
            description: 'Options specific to return shipments (איסוף)',
            options: [
                {
                    displayName: 'Returned Cargo Type',
                    name: 'returned_cargo_type',
                    type: 'number',
                    default: '',
                    description: 'Cargo type for returns - get from shipping company (P8)',
                },
                {
                    displayName: 'Number of Returned Packages',
                    name: 'returned_package_count',
                    type: 'number',
                    default: '',
                    typeOptions: { minValue: 1 },
                    description: 'Number of packages in return shipment (P9)',
                },
            ],
        },

        /* ------------------------------------------------------------ */
        /* Advanced Options                                             */
        /* ------------------------------------------------------------ */
        {
            displayName: 'Advanced Options',
            name: 'advancedOptions',
            type: 'collection',
            placeholder: 'Add Advanced Option',
            default: {},
            displayOptions: { show: { resource: ['shipment'], operation: ['create_shipment'] } },
            options: [
                {
                    displayName: 'Response Type',
                    name: 'response_type',
                    type: 'options',
                    default: 'XML',
                    options: [
                        { name: 'XML (Recommended)', value: 'XML' },
                        { name: 'TXT', value: 'TXT' },
                    ],
                    description: 'Response format from Run ERP (P36)',
                },
                {
                    displayName: 'Shipment Stage',
                    name: 'shipment_stage',
                    type: 'number',
                    default: '',
                    description: 'Shipment stage code - consult shipping company (P4)',
                },
            ],
        },
    ] as INodeProperties[],

    process: (
        params: Record<string, any>,
        i: number,
        getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => any
    ): Record<string, any> => {
        // Required fields
        params.type = getNodeParameter('type', i) as string;
        params.consignee_name = getNodeParameter('consignee_name', i) as string;
        params.city = getNodeParameter('city', i) as string;
        params.street = getNodeParameter('street', i) as string;
        params.phone = getNodeParameter('phone', i) as string;
        params.destination_type = getNodeParameter('destination_type', i) as string;

        // Address Details collection
        const addressDetails = getNodeParameter('addressDetails', i, {}) as Record<string, any>;
        if (addressDetails) {
            Object.keys(addressDetails).forEach(key => {
                if (addressDetails[key] !== '' && addressDetails[key] !== undefined) {
                    params[key] = addressDetails[key];
                }
            });
        }

        // Contact & Reference collection
        const contactReference = getNodeParameter('contactReference', i, {}) as Record<string, any>;
        if (contactReference) {
            Object.keys(contactReference).forEach(key => {
                if (contactReference[key] !== '' && contactReference[key] !== undefined) {
                    params[key] = contactReference[key];
                }
            });
        }

        // Package Details collection
        const packageDetails = getNodeParameter('packageDetails', i, {}) as Record<string, any>;
        if (packageDetails) {
            Object.keys(packageDetails).forEach(key => {
                if (packageDetails[key] !== '' && packageDetails[key] !== undefined) {
                    params[key] = packageDetails[key];
                }
            });
        }

        // Scheduling collection
        const scheduling = getNodeParameter('scheduling', i, {}) as Record<string, any>;
        if (scheduling) {
            Object.keys(scheduling).forEach(key => {
                if (scheduling[key] !== '' && scheduling[key] !== undefined) {
                    params[key] = scheduling[key];
                }
            });
        }

        // Pickup Points collection
        const pickupPoints = getNodeParameter('pickupPoints', i, {}) as Record<string, any>;
        if (pickupPoints) {
            Object.keys(pickupPoints).forEach(key => {
                if (pickupPoints[key] !== '' && pickupPoints[key] !== undefined) {
                    params[key] = pickupPoints[key];
                }
            });
        }

        // Payment Collection collection
        const paymentCollection = getNodeParameter('paymentCollection', i, {}) as Record<string, any>;
        if (paymentCollection) {
            Object.keys(paymentCollection).forEach(key => {
                if (paymentCollection[key] !== '' && paymentCollection[key] !== undefined) {
                    params[key] = paymentCollection[key];
                }
            });
        }

        // Return Options collection
        const returnOptions = getNodeParameter('returnOptions', i, {}) as Record<string, any>;
        if (returnOptions) {
            Object.keys(returnOptions).forEach(key => {
                if (returnOptions[key] !== '' && returnOptions[key] !== undefined) {
                    params[key] = returnOptions[key];
                }
            });
        }

        // Advanced Options collection
        const advancedOptions = getNodeParameter('advancedOptions', i, {}) as Record<string, any>;
        if (advancedOptions) {
            Object.keys(advancedOptions).forEach(key => {
                if (advancedOptions[key] !== '' && advancedOptions[key] !== undefined) {
                    params[key] = advancedOptions[key];
                }
            });
        }

        return params;
    },
};