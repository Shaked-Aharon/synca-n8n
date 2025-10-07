export const PriorityProducts = {
    declare: [
        {
            displayName: 'Operation',
            name: 'operation',
            type: 'options',
            noDataExpression: true,
            displayOptions: {
                show: {
                    resource: ['products'],
                },
            },
            options: [
                {
                    name: 'Create Product',
                    value: 'create_product',
                    description: 'Create a new product',
                    action: 'Create a product',
                },
                {
                    name: 'Update Product',
                    value: 'update_product',
                    description: 'Update a product',
                    action: 'Update a product',
                },
                {
                    name: 'Search Products',
                    value: 'list_products',
                    description: 'Search all products',
                    action: 'Search products',
                },
                {
                    name: 'Get Product',
                    value: 'get_product',
                    description: 'Get a specific product',
                    action: 'Get a product',
                }
            ],
            default: 'list_products',
        },

        // Actions
        {
            displayName: 'Row Data',
            name: 'rowData',
            type: 'resourceMapper',
            default: { mappingMode: 'defineBelow', value: null },
            required: true,

            displayOptions: {
                show: { resource: ['products'], operation: ['create_product', 'update_product'] },
            },

            typeOptions: {
                /* Re-fetch the schema whenever the form changes */
                loadOptionsDependsOn: ['operation', 'credentials'],
                refreshOn: ['operation', 'credentials'],

                resourceMapper: {
                    resourceMapperMethod: 'getFormFields',  // see next section
                    mode: 'add',          // ← insert mode
                    addAllFields: false,   // show everything up front
                    fieldWords: { singular: 'field', plural: 'fields' },
                },
            },
        },
        {
            displayName: 'Product ID',
            name: 'productId',
            type: 'string',
            required: true,
            displayOptions: {
                show: {
                    resource: ['products'],
                    operation: ['get_product', 'get_product_with_prices'],
                },
            },
            default: '',
            description: 'The product ID to retrieve',
        },

        // {
        //     displayName: 'Filters',
        //     name: 'filters',
        //     type: 'fixedCollection',
        //     placeholder: 'Add Filter',
        //     typeOptions: {
        //         multipleValues: true,               // let the user add N rows
        //         loadOptionsDependsOn: ['credentials', 'operation'],
        //         refreshOn: ['credentials', 'operation'],       // clear filters when procedure changes (n8n ≥ 1.90)
        //     },
        //     default: {},
        //     displayOptions: {
        //         show: { resource: ['products'], operation: ['list_products'] },
        //     },

        //     options: [
        //         {
        //             name: 'filter',
        //             displayName: 'Filter',
        //             values: [
        //                 /* 1-A  Field ----------------------------------------- */
        //                 {
        //                     displayName: 'Field',
        //                     name: 'field',
        //                     type: 'options',
        //                     typeOptions: {
        //                         loadOptionsMethod: 'getFormFields',  // see §2
        //                         loadOptionsDependsOn: ['credentials', 'operation'],
        //                         refreshOn: ['credentials', 'operation']
        //                     },
        //                     default: '',
        //                 },

        //                 /* 1-B  Operator -------------------------------------- */
        //                 {
        //                     displayName: 'Operator',
        //                     name: 'op',
        //                     type: 'options',
        //                     options: [
        //                         { name: 'Equals', value: 'eq' },
        //                         { name: 'Not Equals', value: 'neq' },
        //                         { name: 'Starts With', value: 'startWith' },
        //                         { name: 'Ends With', value: 'endWith' },
        //                         { name: 'Contain', value: 'in' },
        //                         { name: 'Greater Than', value: 'gt' },
        //                         { name: 'Greater or Equal', value: 'gte' },
        //                         { name: 'Less Than', value: 'lt' },
        //                         { name: 'Less or Equal', value: 'lte' },
        //                     ],
        //                     default: 'eq',
        //                 },

        //                 /* 1-C  Value ----------------------------------------- */
        //                 {
        //                     displayName: 'Value',
        //                     name: 'fromval',
        //                     type: 'string',          // you can switch to ‘number’/‘boolean’ dynamically later
        //                     default: '',
        //                 },
        //             ],
        //         },
        //     ],
        // },
        {
            displayName: 'Return Fields',
            name: 'fields',
            type: 'multiOptions',
            default: [],
            description:
                'Leave empty to return all columns, or pick the ones you need.',
            typeOptions: {
                loadOptionsMethod: 'getFormFields',
                loadOptionsDependsOn: ['credentials', 'operation'],
                refreshOn: ['credentials', 'operation'],
            },
            displayOptions: {
                show: { resource: ['products'], operation: ['list_products'] },
            },
        },

    ],
    process: (params: any, i: number, getNodeParameter: (parameterName: string, itemIndex: number, fallbackValue?: any) => string | number | boolean | object) => {
        const sku = getNodeParameter('sku', i) as string;
        const isOverrideExisting = getNodeParameter('is_override_existing_product', i) as string;
        const isRestoreDeleted = getNodeParameter('is_restore_deleted_items', i) as string;

        params.sku = sku;
        params.is_override_existing_product = isOverrideExisting;
        params.is_restore_deleted_items = isRestoreDeleted;

        // Optional simple fields
        const optionalFields = [
            'is_visible',
            'title',
            'main_category_name',
            'main_category_id',
            'short_description',
            'long_description',
            'qty',
            'qty_type',
            'qty_jumping_number',
            'weight',
            'is_no_vat',
            'is_force_delete_existing_attributes',
            'is_hide_buy_buttons'
        ];

        optionalFields.forEach(field => {
            try {
                const value = getNodeParameter(field as any, i, undefined);
                if (value !== '' && value !== null && value !== undefined) {
                    params[field] = value;
                }
            } catch {
                // Field not present, skip
            }
        });

        // Handle JSON fields (images, prices, attributes, attributes_matrix)
        const jsonFields = ['images', 'prices', 'attributes', 'attributes_matrix'];

        jsonFields.forEach(field => {
            try {
                const jsonValue = getNodeParameter(field as any, i, undefined) as string;
                if (jsonValue && jsonValue.trim() !== '' && jsonValue !== '{}' && jsonValue !== '[]') {
                    try {
                        params[field] = JSON.parse(jsonValue);
                    } catch (parseError) {
                        throw new Error(`Invalid JSON in ${field}: ${(parseError as any).message}`);
                    }
                }
            } catch {
                // Field not present, skip
            }
        });

        // Include store_id if present
        try {
            const storeId = getNodeParameter('store_id', i, undefined);
            if (storeId !== undefined) params.store_id = storeId;
        } catch {
            // store_id not present, skip
        }
        return params;
    }
}