import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  // IHttpRequestOptions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
  NodeConnectionType,
} from 'n8n-workflow';
import { CashcowCreateOrder } from './constants/cashcow-create-order.constant';
import { CashcowCreateOrUpdateProduct } from './constants/cashcow-create-or-update-product.constant';
import { CashcowCheckOrderTracking } from './constants/cashcow-check-order-tracking.constant';
import { CashcowGetStoreMailbox } from './constants/cashcow-get-store-mailbox.constant';

import { SyncaService } from '../shared/SyncaService';

export class SyncaCashcow implements INodeType {
  description: INodeTypeDescription = {
    usableAsTool: true,
    displayName: 'Synca Cashcow',
    name: 'customSyncaCashcow',
    icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
    group: ['transform'],
    documentationUrl: 'https://n8n.synca.co.il/docs',
    version: 1,
    description: 'Invoke Cashcow actions via the Synca backend',
    defaults: { name: 'Synca Cashcow' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'customSyncaApiCredentials', required: true }],
    properties: [
      /* ------------------------------------------------------------ */
      /* Credential picker                                            */
      /* ------------------------------------------------------------ */
      {
        displayName: 'Credentials',
        name: 'credentials',
        type: 'options',
        typeOptions: { loadOptionsMethod: 'getCredentials' },
        default: '',
        required: true,
      },

      /* ------------------------------------------------------------ */
      /* Resource / operation                                         */
      /* ------------------------------------------------------------ */
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          { name: 'Account', value: 'account' },
          { name: 'Store', value: 'store' },
          { name: 'Product', value: 'product' },
        ],
        default: 'account',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['account'] } },
        options: [{ name: 'Get Info', value: 'get_account_info' }],
        default: 'get_account_info',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['store'] } },
        options: [
          { name: 'List Orders', value: 'list_orders' },
          { name: 'Create Order', value: 'create_order' },
          { name: 'Check Order Tracking', value: 'check_order_tracking' },
          { name: 'Get Store Mailbox', value: 'get_store_mailbox' },
        ],
        default: 'list_orders',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: { show: { resource: ['product'] } },
        options: [
          { name: 'Create / Update', value: 'create_or_update_product' },
          { name: 'Exists?', value: 'product_exists' },
          { name: 'Get Quantity', value: 'get_product_qty' },
        ],
        default: 'create_or_update_product',
      },

      /* ------------------------------------------------------------ */
      /* Common parameters                                            */
      /* ------------------------------------------------------------ */

      /* Store → Create Order */
      ...(CashcowCreateOrder.declare as any),

      /* Store → List Orders */
      {
        displayName: 'Order Status IDs',
        name: 'order_status',
        type: 'string',
        default: '',
        description: 'Comma-separated status IDs (see Cashcow docs)',
        displayOptions: { show: { resource: ['store'], operation: ['list_orders'] } },
      },
      {
        displayName: 'Order ID',
        name: 'OrderID',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['store'], operation: ['list_orders'] } },
      },
      {
        displayName: 'Days From Now',
        name: 'DaysFromNow',
        type: 'number',
        default: 30,
        typeOptions: {
          minValue: 0,
          maxValue: 60,
        },
        description: 'Number of days from now to search for orders, max 60 days',
        displayOptions: { show: { resource: ['store'], operation: ['list_orders'] } },
      },

      /* Product → Create/Update */
      ...(CashcowCreateOrUpdateProduct.decalre as any),

      /* Product → Exists? */
      {
        displayName: 'SKU',
        name: 'sku',
        type: 'string',
        default: '',
        displayOptions: { show: { resource: ['product'], operation: ['product_exists'] } },
      },
      /* Product → Get Qty */
      {
        displayName: 'Product IDs',
        name: 'product_ids',
        type: 'string',
        default: '',
        description: 'Comma-separated list',
        displayOptions: { show: { resource: ['product'], operation: ['get_product_qty'] } },
      },

      /* Store → Check Order Tracking */                                      // NEW
      ...(CashcowCheckOrderTracking.declare as any),                          // NEW

      /* Store → Get Store Mailbox */                                         // NEW
      ...(CashcowGetStoreMailbox.declare as any),                            // NEW
    ],
  };

  /* -------------------------------------------------------------- */
  /* Dynamic credential list (same pattern as demo node)            */
  /* -------------------------------------------------------------- */
  methods = {
    loadOptions: {
      async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const service = new SyncaService(this);
        return await service.getProviderCredentials();
      },
    },
  };

  /* -------------------------------------------------------------- */
  /* Main execution                                                 */
  /* -------------------------------------------------------------- */
  // V3
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const out: INodeExecutionData[] = [];

    const service = new SyncaService(this);

    for (let i = 0; i < items.length; i++) {
      try {
        const credentialId = this.getNodeParameter('credentials', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;

        /* Gather all user-supplied params (only those actually present) */
        let params: Record<string, any> = {};

        // Special handling for create_or_update_product operation
        if (operation === 'create_or_update_product') {
          params = CashcowCreateOrUpdateProduct.process(params, i, this.getNodeParameter as any);
        } else if (operation === 'create_order') {
          params = CashcowCreateOrder.process(params, i, this.getNodeParameter as any);
        } else if (operation === 'check_order_tracking') {                      // NEW
          params = CashcowCheckOrderTracking.process(params, i, this.getNodeParameter as any);  // NEW
        } else if (operation === 'get_store_mailbox') {                         // NEW
          params = CashcowGetStoreMailbox.process(params, i, this.getNodeParameter as any);     // NEW
        } else {
          // Generic handling for other operations (keep your existing logic)
          for (const p of [
            'store_id', 'cart', 'is_confirm_payment', 'order_status',
            'product', 'sku', 'product_ids',
            'order_id', 'email_address',                                        // NEW
            'page', 'page_size', 'message_type', 'date_from', 'date_to',       // NEW
            'read_status', 'customer_id', 'search_query', 'order_by',          // NEW
            'DaysFromNow', 'OrderID'
          ]) {
            try {
              const val = this.getNodeParameter(p as any, i, undefined);
              if (val !== undefined && val !== '') params[p] = val;
            } catch {
              // Field not present, skip
            }
          }
        }
        // if (operation === 'create_or_update_product') {
        //   params = CashcowCreateOrUpdateProduct.process(params, i, this.getNodeParameter as any);
        // } else if (operation === 'create_order') {
        //   params = CashcowCreateOrder.process(params, i, this.getNodeParameter as any);
        // } else {
        //   // Generic handling for other operations (keep your existing logic)
        //   for (const p of [
        //     'store_id', 'cart', 'is_confirm_payment', 'order_status',
        //     'product', 'sku', 'product_ids',
        //   ]) {
        //     try {
        //       const val = this.getNodeParameter(p as any, i, undefined);
        //       if (val !== undefined) params[p] = val;
        //     } catch {
        //       // Field not present, skip
        //     }
        //   }
        // }

        const response = await service.invoke(credentialId, operation, params);
        out.push({ json: response, pairedItem: { item: i } });
      } catch (err) {
        if (this.continueOnFail()) {
          out.push({ json: { error: (err as any).message }, pairedItem: { item: i } });
          continue;
        }
        throw err;
      }
    }
    return [out];
  }
}
