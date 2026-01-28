import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	NodeConnectionType,
} from 'n8n-workflow';

export class SyncaPriorityAPI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Synca Priority ERP API',
		name: 'customSyncaPriorityAPI',
		icon: 'fa:api',
		group: ['transform'],
		version: 1,
		description: 'Interact with Custom API for Orders, Items, Customers, and Purchase Orders',
		defaults: {
			name: 'Synca Priority ERP API',
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
						name: 'Order',
						value: 'order',
					},
					{
						name: 'Item',
						value: 'item',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Purchase Order',
						value: 'purchaseOrder',
					},
				],
				default: 'order',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['order'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						action: 'Get many orders',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get an order',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create an order',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update an order',
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['item'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						action: 'Get many items',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a item',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a item',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a item',
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						action: 'Get many customers',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a customer',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a customer',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a customer',
					},
				],
				default: 'getMany',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['purchaseOrder'],
					},
				},
				options: [
					{
						name: 'Get Many',
						value: 'getMany',
						action: 'Get many purchase orders',
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get a purchase order',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a purchase order',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update a purchase order',
					},
				],
				default: 'getMany',
			},
			// Filter parameters
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Top',
						name: 'top',
						type: 'number',
						default: 100,
						description: 'Number of records to return',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						default: 50,
						description: 'The amount of record to skip',
					},
					{
						displayName: 'Filter',
						name: 'filter',
						type: 'string',
						default: '',
						description: 'Filter expression to apply to the results',
					},
					{
						displayName: 'Select',
						name: 'select',
						type: 'string',
						default: '',
						description: 'Comma-separated list of fields to select',
					},
				],
			},
			// ID field for get and update operations
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update'],
					},
				},
				description: 'ID of the record to get or update',
			},
			// Data field for create and update operations
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
				description: 'JSON data for creating or updating the record',
			},
		],
	};

	methods = {
		loadOptions: {
			async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				// This method should load available credentials from your API
				// For now, returning a placeholder - you'll need to implement the actual API call
				try {
					const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `${credentials.baseUrl}/v1/invoke/get-credentials`, // Adjust this endpoint as needed
						headers: {
							'x-api-token': credentials?.apiToken as string,
						},
					};
					const response = await this.helpers.httpRequest(options);

					if (Array.isArray(response)) {
						return response.map((cred: any) => ({
							name: cred.name || cred.id,
							value: cred.id,
						}));
					}

					return [];
				} catch (error) {
					// Return empty array if credentials endpoint is not available
					return [
						{
							name: 'Default Credentials',
							value: 'default',
						},
					];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const credentialsId = this.getNodeParameter('credentials', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i) as any;

				// Get credentials
				const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
				const apiToken = credentials.apiToken;
				const baseURL = credentials.baseUrl;
				// Build action name
				let actionName = '';
				switch (operation) {
					case 'getMany':
						actionName = `get_${resource}s`;
						break;
					case 'get':
						actionName = `get_${resource}`;
						break;
					case 'create':
						actionName = `create_${resource}`;
						break;
					case 'update':
						actionName = `update_${resource}`;
						break;
				}

				// Build query parameters
				const queryParams: { [key: string]: string } = {};

				if (additionalFields.top !== undefined) {
					queryParams.top = additionalFields.top.toString();
				}
				if (additionalFields.skip !== undefined) {
					queryParams.skip = additionalFields.skip.toString();
				}
				if (additionalFields.filter) {
					queryParams.filter = additionalFields.filter;
				}
				if (additionalFields.select) {
					queryParams.select = additionalFields.select;
				}

				// Add ID to query params for get and update operations
				if (operation === 'get' || operation === 'update') {
					const id = this.getNodeParameter('id', i) as string;
					queryParams.id = id;
				}

				// Add data to query params for create and update operations
				if (operation === 'create' || operation === 'update') {
					let data = this.getNodeParameter('data', i) as string;
					if (data) { data = JSON.parse(data); }
					queryParams.data = data;
				}

				// Build URL
				const baseUrl = `${baseURL}/v1/invoke/${credentialsId}/${actionName}`;
				// const queryString = new URLSearchParams(queryParams).toString();
				// const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

				// Make HTTP request
				const options: IHttpRequestOptions = {
					method: 'POST',
					url: baseUrl,
					headers: {
						'x-api-token': apiToken,
						'Content-Type': 'application/json',
					},
					body: queryParams
				};

				const responseData = await this.helpers.httpRequest(options);

				if (Array.isArray(responseData)) {
					responseData.forEach((item) => {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					});
				} else {
					returnData.push({
						json: responseData,
						pairedItem: { item: i },
					});
				}
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