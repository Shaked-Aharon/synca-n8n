import { ILoadOptionsFunctions, INodePropertyOptions, IHttpRequestOptions, ResourceMapperFields, ResourceMapperField } from "n8n-workflow";

export const operationToFormName: Record<string, string> = {
    'list_products': 'LOGPART',
    'create_product': 'LOGPART',
    'update_product': 'LOGPART',
    'get_product': 'LOGPART',
    'list_orders': 'ORDERS',
    'create_order': 'ORDERS',
    'update_order': 'ORDERS',
    'get_order': 'ORDERS',
    'list_customers': 'CUSTOMERS',
    'create_customer': 'CUSTOMERS',
    'update_customer': 'CUSTOMERS',
    'get_customer': 'CUSTOMERS',
    'list_invoices': 'TINVOICES',
    'create_invoice': 'TINVOICES',
    'update_invoice': 'TINVOICES',
    'get_invoice': 'TINVOICES',
    'list_purchase_orders': 'PORDERS',
    'create_purchase_order': 'PORDERS',
    'update_purchase_order': 'PORDERS',
    'get_purchase_order': 'PORDERS',
}

/* Helper that translates your form engine types to n8n types */
function mapType(t: string): 'string' | 'number' | 'dateTime' | 'time' | 'boolean' {
    switch (t) {
        case 'duration':
        case 'int':
        case 'number':
            return 'number';
        case 'date':
        case 'datetime':
            return 'dateTime';
        case 'time':
            return 'time';
        case 'checkbox':
        case 'bool':
            return 'boolean';
        default:
            return 'string';
    }
}

export const PriorityMethods = {
    loadOptions: {
        async getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const options: IHttpRequestOptions = {
                    method: 'GET',
                    url: `${credentials.baseUrl}/v1/invoke/get-credentials`,
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
                return [];
            }
        },

        async getSubForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;
                const operation = this.getNodeParameter('operation') as string;
                // const formName = this.getNodeParameter('formName') as string;
                let formName;
                try {
                    formName = this.getNodeParameter('formName') as string;
                } catch (e) {
                    formName = operationToFormName[operation];
                }
                console.log({ credentials, credentialsId, operation, formName })
                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_subforms`;
                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    },
                    body: { formName: operationToFormName[operation] ?? formName }
                };

                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred: any) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }

                return [];
            } catch (error) {
                return [];
            }
        },

        async getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;

                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_forms`;
                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    }
                };

                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred: any) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }

                return [];
            } catch (error) {
                return [];
            }

        },
        async getFormFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;
                // const formName = this.getNodeParameter('formName') as string;
                // const subFormName = this.getNodeParameter('subFormName', '') as string;
                 const operation = this.getNodeParameter('operation') as string;
                let formName;
                try {
                    formName = this.getNodeParameter('formName') as string;
                } catch (e) {
                    formName = operationToFormName[operation];
                }

                let subFormName;
                try {
                    subFormName = this.getNodeParameter('subFormName') as string;
                } catch (e) { }

                // let subSubFormName;
                // try {
                //     subSubFormName = this.getNodeParameter('subSubFormName') as string;
                // } catch (e) { }
                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_form_fields`;

                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    },
                    body: { formName, subFormName }
                };

                const response = await this.helpers.httpRequest(options);

                if (Array.isArray(response.data)) {
                    return response.data.map((cred: any) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }

                return [];
            } catch (error) {
                return [];
            }
        },

        async getProcedures(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;

                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_procedures`;
                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    },
                };

                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred: any) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }

                return [];
            } catch (error) {
                return [];
            }
        },
    },
    resourceMapping: {
        async getMappingColumns(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;

                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_procedure_columns`;
                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    },
                    body: { procedure_name: this.getNodeParameter('procedureName') }
                };

                const response = await this.helpers.httpRequest(options);
                let results: ResourceMapperField[] = [];
                if (Array.isArray(response.data?.EditFields)) {
                    results = response.data.EditFields.map((f: any, i: number) => ({
                        id: `${f.field}`,
                        required: f.mandatory === 1,
                        displayName: f.title,
                        type: 'string',
                        display: true,
                    }) as ResourceMapperField);
                }
                if (Array.isArray(response.data?.fields)) {
                    results = response.data.fields.map((f: any, i: number) => ({
                        id: `${f.field}`,
                        required: f.mandatory === 1,
                        displayName: f.title,
                        options: f.options,
                        type: f.options ? 'options' : mapType(f.type),
                        display: true,
                    }) as ResourceMapperField);
                }
                return { fields: results, emptyFieldsNotice: 'לא נמצאו שדות לפרוצדורה.' };
            } catch (error) {
                return { fields: [], emptyFieldsNotice: error.message ?? 'היראה שגיאה בטעינת השדות לפרוצדורה, נסה שנית מאוחר יותר.' };
            }
        },

        async getFormFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields> {
            try {
                const credentials = await this.getCredentials<{ apiToken: string; baseUrl: string; }>('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials') as string;
                const operation = this.getNodeParameter('operation') as string;
                let formName;
                try {
                    formName = this.getNodeParameter('formName') as string;
                } catch (e) {
                    formName = operationToFormName[operation];
                }

                let subFormName;
                try {
                    subFormName = this.getNodeParameter('subFormName') as string;
                } catch (e) { }

                let subSubFormName;
                try {
                    subSubFormName = this.getNodeParameter('subSubFormName') as string;
                } catch (e) { }

                // const subFormName = this.getNodeParameter('subFormName', '') as string;
                const url = `${credentials.baseUrl}/v1/invoke/metadata/${credentialsId}/get_form_fields_for_add`;
                const options: IHttpRequestOptions = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials?.apiToken as string,
                    },
                    body: { operation, formName, subFormName, subSubFormName }
                };
                const response = await this.helpers.httpRequest(options);
                if (response.success === false) {
                    return { fields: [], emptyFieldsNotice: response.error.message }
                }
                if (Array.isArray(response.data)) {
                    const result: ResourceMapperFields = {
                        fields: response.data.map((f: any) => {
                            const temp: ResourceMapperField = {
                                id: f.id,                   // database column
                                displayName: f.name || f.key,
                                type: f.choices ? 'options' : mapType(f.type),        // 'string' | 'number' | 'dateTime' | …
                                required: !!f.required,
                                display: true,                   // hide false if you never want it mapped
                                // readOnly: f.readOnly,
                                // enum columns
                                options: f.choices,
                                // You normally set both flags false in add-mode
                                canBeUsedToMatch: false,
                                defaultMatch: false,
                            }
                            return temp;
                        })
                    };
                    return result;
                }


                return { fields: [], emptyFieldsNotice: 'אין שדות למסך זה' };
            } catch (error) {
                console.log({ error })
                return { fields: [], emptyFieldsNotice: 'אין שדות למסך זה' };
            }
        },

    }
};