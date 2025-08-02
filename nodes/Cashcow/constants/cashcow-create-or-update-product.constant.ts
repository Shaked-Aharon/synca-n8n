export const CashcowCreateOrUpdateProduct = {
    decalre: [
        {
            displayName: 'Product SKU',
            name: 'sku',
            type: 'string',
            required: true,
            default: '',
            description: 'Product SKU (required)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Override Existing Product',
            name: 'is_override_existing_product',
            type: 'options',
            required: true,
            default: 'true',
            options: [
                { name: 'Yes', value: 'true' },
                { name: 'No', value: 'false' },
            ],
            description: 'If SKU exists, override it?',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Restore Deleted Items',
            name: 'is_restore_deleted_items',
            type: 'options',
            required: true,
            default: 'true',
            options: [
                { name: 'Yes', value: 'true' },
                { name: 'No', value: 'false' },
            ],
            description: 'Restore deleted product?',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Product Visible',
            name: 'is_visible',
            type: 'boolean',
            default: true,
            description: 'Product visible on store?',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Product Title',
            name: 'title',
            type: 'string',
            default: '',
            description: 'Product title (required when creating new product)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Main Category Name',
            name: 'main_category_name',
            type: 'string',
            default: '',
            description: 'Product main category name (required when creating new product)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Main Category ID',
            name: 'main_category_id',
            type: 'string',
            default: '',
            description: 'Product main category ID (alternative to category name)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Short Description',
            name: 'short_description',
            type: 'string',
            default: '',
            description: 'Product short description',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Long Description',
            name: 'long_description',
            type: 'string',
            typeOptions: {
                rows: 4,
            },
            default: '',
            description: 'Product long description',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Quantity',
            name: 'qty',
            type: 'number',
            default: 0,
            description: 'Product quantity (set to null for unlimited)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Quantity Type',
            name: 'qty_type',
            type: 'options',
            default: 0,
            options: [
                { name: 'Units', value: 0 },
                { name: 'Kg', value: 1 },
                { name: 'Grams', value: 2 },
                { name: 'Liter', value: 3 },
                { name: 'Meter', value: 4 },
                { name: 'Cm', value: 5 },
            ],
            description: 'Unit type for quantity',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Quantity Jumping Number',
            name: 'qty_jumping_number',
            type: 'number',
            default: 1,
            description: 'Stepping number for non-unit qty types (recommended: 0.5 for Kg, 1 for Units)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Weight',
            name: 'weight',
            type: 'number',
            default: 0,
            description: 'Product weight',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'No VAT',
            name: 'is_no_vat',
            type: 'boolean',
            default: false,
            description: 'Is this product without VAT?',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Images (JSON)',
            name: 'images',
            type: 'json',
            required: false,
            default: `
        {
          "main_image_url": "https://some-domain.dot/path-to-some-image"
        }
                `,
            description: 'Product images object (see API docs for structure)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Prices (JSON)',
            name: 'prices',
            type: 'json',
            default: `
        {
          "sell_price": 10.00,
          "cost_price": 2.65
        }
        `,
            description: 'Product prices object (see API docs for structure)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Force Delete Existing Attributes',
            name: 'is_force_delete_existing_attributes',
            type: 'boolean',
            default: false,
            description: 'Delete existing attributes before adding new ones',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Attributes (JSON)',
            name: 'attributes',
            type: 'json',
            required: false,
            default: `
        [
          {
            "name": "",
            "friendly_name": "",
            "internal_identifier": "",
            "attribute_type": 0,
            "is_required": false,
            "options": [
                {
                  "name": "",
                  "sku": "",
                  "qty": 0.00,
                  "external_price": 0.00,
                  "cost_price": 0.00
                }
            ],
          }
        ]
        `,
            description: 'Product attributes array (see API docs for structure)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Attributes Matrix (JSON)',
            name: 'attributes_matrix',
            type: 'json',
            required: false,
            default: `
        {
          "attribute_a_internal_identifier": "",
          "attribute_b_internal_identifier": "",
          "matrix_options": [
                {
                  "to_option_a_text": "",
                  "to_option_b_text": "",
                  "qty": 0,
                  "sku_for_matrix": ""
                }
          ]
        }`,
            description: 'Attach 2 attributes to matrix (see API docs for structure)',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
        },
        {
            displayName: 'Hide Buy Buttons',
            name: 'is_hide_buy_buttons',
            type: 'boolean',
            default: false,
            description: 'Hide buy buttons for this product',
            displayOptions: { show: { resource: ['product'], operation: ['create_or_update_product'] } },
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