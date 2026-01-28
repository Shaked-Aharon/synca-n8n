import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	NodeConnectionType,
	ResourceMapperField,
	ResourceMapperValue,
	NodeOperationError,
} from 'n8n-workflow';
import { operationToFormName, PriorityMethods } from './constants/methods';
import { PriorityProducts } from './constants/priority-products.constant';
import { PrioritySales } from './constants/priority-sales.constant';
import { PriorityPurchaseOrders } from './constants/priority-purchase-orders.constant';
// import { PriorityAgents } from './constants/priority-agents.constant';
import { PriorityProcedures } from './constants/priority-procedure.constant';
import { PriorityGeneric } from './constants/priority-generic.constant';


const opDict: Record<string, string> = {
	'eq': "=",
	'in': "=",
	'startWith': "=",
	'endWith': "=",
	'neq': "<>",
	'gt': ">",
	'gte': ">=",
	'lt': "<",
	'lte': "<=",
}
function getFinalFilter(f: { fromval: string; field: string; op: string; }) {
	const op = opDict[f.op];
	let fromval = f.fromval;
	if (f.op === 'in') { fromval = `*${fromval}*` }
	if (f.op === 'startWith') { fromval = `${fromval}*` }
	if (f.op === 'endWith') { fromval = `*${fromval}` }
	return {
		fromval,
		op: op,
		field: f.field
	}
}

function processFieldsToSend(value: Record<string, any> | null, schemas: ResourceMapperField[]) {
	const result: Record<string, any> = {};
	if (value === null) return result;
	for (const key in value) {
		const isRemoved = schemas.find(s => s.id === key)?.removed;
		if (!isRemoved) { result[key] = value[key] }
	}
	return result;
}
export class SyncaPriority implements INodeType {
	description: INodeTypeDescription = {
		usableAsTool: true,
		displayName: 'Synca Priority ERP',
		name: 'customNewSyncaPriority',
		icon: { light: 'file:icon.svg', dark: 'file:icon.svg' },
		group: ['transform'],
		documentationUrl: 'https://n8n.synca.co.il/docs',
		version: 1,
		description: 'Interact with Priority ERP for Products, Sales, Purchase Orders, Agents, and Procedures',
		defaults: {
			name: 'Synca Priority ERP',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'customSyncaApiCredentials',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Credentials',
				name: 'credentials',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getCredentials',
				},
				default: '',
				required: true,
				description: 'Select the credentials to use',
			},
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Products',
						value: 'products',
					},
					{
						name: 'Sales',
						value: 'sales',
					},
					{
						name: 'Purchase Orders',
						value: 'purchaseOrders',
					},
					// {
					// 	name: 'Agents',
					// 	value: 'agents',
					// },
					{
						name: 'Procedures',
						value: 'procedures',
					},
					{
						name: 'Generic',
						value: 'generic',
					},
				],
				default: 'products',
				description: 'The resource to operate on',
			},


			...(PriorityProducts.declare as any),
			...(PrioritySales.declare as any),
			...(PriorityPurchaseOrders.declare as any),
			// ...(PriorityAgents.declare as any),
			...(PriorityProcedures.declare as any),
			...(PriorityGeneric.declare as any),

			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				displayOptions: {
					show: {
						operation: ['search_form', 'search_sub_form', 'list_products', 'list_customers', 'list_orders', 'list_invoices', 'list_purchase_orders', 'list_agents', 'list_price_lists'],
					},
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				displayOptions: {
					show: {
						operation: ['search_form', 'search_sub_form', 'list_products', 'list_customers', 'list_orders', 'list_invoices', 'list_purchase_orders', 'list_agents', 'list_price_lists'],
					},
				},
				default: '',
				description: 'number of items to skip',
			},
		],
	};

	methods = PriorityMethods;
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentialsId = this.getNodeParameter('credentials', i) as string;
				const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
				const apiToken = credentials.apiToken;
				const baseURL = credentials.baseUrl;

				// const resource = this.getNodeParameter('resource', i) as string;
				let operation = this.getNodeParameter('operation', i) as string;

				// Build request parameters based on operation
				let requestParams: any = {};
				let tempFields: ResourceMapperValue;
				switch (operation) {
					case 'get_product':
					case 'get_customer':
					case 'get_order':
					case 'get_invoice':
					case 'get_purchase_order':
						const param = `${operation.split('_')[1]}Id`
						requestParams = {
							id: this.getNodeParameter(param, i),
							include_subforms: this.getNodeParameter('includeSubforms', i, []),
							formName: operationToFormName[operation]
						};
						operation = 'get_row_in_form'
						break;
					case 'create_product':
					case 'update_product':
					case 'create_customer':
					case 'update_customer':
					case 'create_order':
					case 'update_order':
					case 'create_invoice':
					case 'update_invoice':
					case 'create_purchase_order':
					case 'update_purchase_order':
					case 'add_to_form':
					case 'update_row_in_form':
						const formFilters = this.getNodeParameter('filters.filter', 0, []) as Array<{
							field: string;
							op: string;
							fromval: string;
						}>;
						tempFields = this.getNodeParameter('rowData', 0, {}) as any;
						requestParams = {
							formName: operation.includes('form') ? this.getNodeParameter('formName', i) : operationToFormName[operation],
							fields: processFieldsToSend(tempFields.value, tempFields.schema),
							formFilters: formFilters.map(f => getFinalFilter(f))
						};
						if (operation.startsWith('update_')) operation = 'update_row_in_form';
						else operation = 'add_to_form';

						if (operation.startsWith('update_') && (!requestParams.formFilters || requestParams.formFilters.length === 0)) {
							throw new NodeOperationError(
								this.getNode(),
								`At least one filter is required for operation "${operation}"`,
								{ itemIndex: i }
							);
						}
						break;
					case 'get_agent':
						requestParams = {
							id: this.getNodeParameter('agentId', i),
						};
						break;
					case 'run_procedures':
						const parameters = (this.getNodeParameter('fields', 0, {}) as any);
						requestParams = {
							procedure_name: this.getNodeParameter('procedureName', i),
							parameters: parameters.value//: Object.keys(parameters).length > 0 ? parameters : undefined,
						};
						break;
					case 'list_products':
					case 'list_customers':
					case 'list_orders':
					case 'list_invoices':
					case 'list_purchase_orders':
					case 'search_form':
						const filters = this.getNodeParameter('filters.filter', 0, []) as Array<{
							field: string;
							op: string;
							fromval: string;
						}>;
						const finalFormName = operation.startsWith('list_') ? operationToFormName[operation] : this.getNodeParameter('formName', i)
						const isSearchForm = operation == "search_form";
						if (operation.startsWith('list_')) { operation = 'search_form' }
						const fields = this.getNodeParameter('fields', 0, []) as string[];
						requestParams = {
							formName: finalFormName,
							limit: this.getNodeParameter('limit', i, 50),
							skip: this.getNodeParameter('skip', i, 0),
							include_subforms: isSearchForm ? undefined : this.getNodeParameter('includeSubforms', i, []),
							fields,
							filters: filters.map(f => getFinalFilter(f))
						};
						break;
					case 'search_sub_form':
						const searchSubFormFilters = this.getNodeParameter('filters.filter', 0, []) as Array<{
							field: string;
							op: string;
							fromval: string;
						}>;

						const searchSubFormFields = this.getNodeParameter('fields', 0, []) as string[];
						requestParams = {
							formName: this.getNodeParameter('formName', i),
							subFormName: this.getNodeParameter('subFormName', i),
							mainEntityId: this.getNodeParameter('mainEntityId', i),
							limit: this.getNodeParameter('limit', i, 50),
							skip: this.getNodeParameter('skip', i, 0),
							fields: searchSubFormFields,
							filters: searchSubFormFilters.map(f => getFinalFilter(f))
						};
						break;
					case 'add_to_sub_form':
						tempFields = this.getNodeParameter('rowData', 0, {}) as any;
						requestParams = {
							formName: this.getNodeParameter('formName', i),
							subFormName: this.getNodeParameter('subFormName', i),
							mainEntityId: this.getNodeParameter('mainEntityId', i),
							fields: processFieldsToSend(tempFields.value, tempFields.schema),
						};
						break;
					case 'update_row_in_sub_form':
						const subFormFilters = this.getNodeParameter('filters.filter', 0, []) as Array<{
							field: string;
							op: string;
							fromval: string;
						}>;
						tempFields = this.getNodeParameter('rowData', 0, {}) as any;
						requestParams = {
							formName: this.getNodeParameter('formName', i),
							subFormName: this.getNodeParameter('subFormName', i),
							mainEntityId: this.getNodeParameter('mainEntityId', i),
							fields: processFieldsToSend(tempFields.value, tempFields.schema),
							subFormFilters: subFormFilters.map(f => getFinalFilter(f))
						};
						break;
					default:
						// For list operations, add pagination parameters
						if (operation.startsWith('list_')) {
							requestParams = {
								limit: this.getNodeParameter('limit', i, 50),
								skip: this.getNodeParameter('skip', i, 0),
							};
						}
				}

				// Build URL
				const url = `${baseURL}/v1/invoke/${credentialsId}/${operation}`;

				// Make HTTP request
				const options: IHttpRequestOptions = {
					method: 'POST',
					url,
					headers: {
						'x-api-token': apiToken,
						'Content-Type': 'application/json',
					},
					body: requestParams,
				};

				const responseData = await this.helpers.httpRequest(options);

				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});

			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error?.message ?? error,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}