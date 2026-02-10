import {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SyncaApi implements ICredentialType {
	name = 'customSyncaApiCredentials';
	displayName = 'Synca API Credentials';
	icon = <Icon>{ dark: 'file:icon.svg', light: 'file:icon.svg' };
	documentationUrl = 'https://n8n.synca.co.il/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The API token for authentication',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'The Secret Key for authentication',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://n8n-api.synca.co.il',
			description: 'Base URL of your Synca instance',
		},
	];

	// Optional: Add authentication method
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Token': '={{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			skipSslCertificateValidation: true,
			headers: {
				'X-API-Token': '={{$credentials.apiToken}}',
			},
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/invoke/health-check',
			method: 'GET',
		},
	};
}