"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityMethods = exports.operationToFormName = void 0;
exports.operationToFormName = {
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
};
function mapType(t) {
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
exports.PriorityMethods = {
    loadOptions: {
        async getCredentials() {
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const options = {
                    method: 'GET',
                    url: `${credentials.baseUrl}/v1/invoke/get-credentials`,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                };
                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response)) {
                    return response.map((cred) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }
                return [];
            }
            catch (error) {
                return [];
            }
        },
        async getSubForms() {
            var _a;
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const operation = this.getNodeParameter('operation');
                let formName;
                try {
                    formName = this.getNodeParameter('formName');
                }
                catch (e) {
                    formName = exports.operationToFormName[operation];
                }
                console.log({ credentials, credentialsId, operation, formName });
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_subforms`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                    body: { formName: (_a = exports.operationToFormName[operation]) !== null && _a !== void 0 ? _a : formName }
                };
                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }
                return [];
            }
            catch (error) {
                return [];
            }
        },
        async getForms() {
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_forms`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    }
                };
                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }
                return [];
            }
            catch (error) {
                return [];
            }
        },
        async getFormFields() {
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const operation = this.getNodeParameter('operation');
                let formName;
                try {
                    formName = this.getNodeParameter('formName');
                }
                catch (e) {
                    formName = exports.operationToFormName[operation];
                }
                let subFormName;
                try {
                    subFormName = this.getNodeParameter('subFormName');
                }
                catch (e) { }
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_form_fields`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                    body: { formName, subFormName }
                };
                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }
                return [];
            }
            catch (error) {
                return [];
            }
        },
        async getProcedures() {
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_procedures`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                };
                const response = await this.helpers.httpRequest(options);
                if (Array.isArray(response.data)) {
                    return response.data.map((cred) => ({
                        name: cred.name || cred.id,
                        value: cred.id,
                    }));
                }
                return [];
            }
            catch (error) {
                return [];
            }
        },
    },
    resourceMapping: {
        async getMappingColumns() {
            var _a, _b, _c;
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_procedure_columns`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                    body: { procedure_name: this.getNodeParameter('procedureName') }
                };
                const response = await this.helpers.httpRequest(options);
                let results = [];
                if (Array.isArray((_a = response.data) === null || _a === void 0 ? void 0 : _a.EditFields)) {
                    results = response.data.EditFields.map((f, i) => ({
                        id: `${f.field}`,
                        required: f.mandatory === 1,
                        displayName: f.title,
                        type: 'string',
                        display: true,
                    }));
                }
                if (Array.isArray((_b = response.data) === null || _b === void 0 ? void 0 : _b.fields)) {
                    results = response.data.fields.map((f, i) => ({
                        id: `${f.field}`,
                        required: f.mandatory === 1,
                        displayName: f.title,
                        options: f.options,
                        type: f.options ? 'options' : mapType(f.type),
                        display: true,
                    }));
                }
                return { fields: results, emptyFieldsNotice: 'לא נמצאו שדות לפרוצדורה.' };
            }
            catch (error) {
                return { fields: [], emptyFieldsNotice: (_c = error.message) !== null && _c !== void 0 ? _c : 'היראה שגיאה בטעינת השדות לפרוצדורה, נסה שנית מאוחר יותר.' };
            }
        },
        async getFormFields() {
            try {
                const credentials = await this.getCredentials('customSyncaApiCredentials');
                const credentialsId = this.getNodeParameter('credentials');
                const operation = this.getNodeParameter('operation');
                let formName;
                try {
                    formName = this.getNodeParameter('formName');
                }
                catch (e) {
                    formName = exports.operationToFormName[operation];
                }
                let subFormName;
                try {
                    subFormName = this.getNodeParameter('subFormName');
                }
                catch (e) { }
                let subSubFormName;
                try {
                    subSubFormName = this.getNodeParameter('subSubFormName');
                }
                catch (e) { }
                const url = `${credentials.baseUrl}/v1/invoke/${credentialsId}/get_form_fields_for_add`;
                const options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'x-api-token': credentials === null || credentials === void 0 ? void 0 : credentials.apiToken,
                    },
                    body: { operation, formName, subFormName, subSubFormName }
                };
                const response = await this.helpers.httpRequest(options);
                if (response.success === false) {
                    return { fields: [], emptyFieldsNotice: response.error.message };
                }
                if (Array.isArray(response.data)) {
                    const result = {
                        fields: response.data.map((f) => {
                            const temp = {
                                id: f.id,
                                displayName: f.name || f.key,
                                type: f.choices ? 'options' : mapType(f.type),
                                required: !!f.required,
                                display: true,
                                options: f.choices,
                                canBeUsedToMatch: false,
                                defaultMatch: false,
                            };
                            return temp;
                        })
                    };
                    return result;
                }
                return { fields: [], emptyFieldsNotice: 'אין שדות למסך זה' };
            }
            catch (error) {
                console.log({ error });
                return { fields: [], emptyFieldsNotice: 'אין שדות למסך זה' };
            }
        },
    }
};
//# sourceMappingURL=methods.js.map