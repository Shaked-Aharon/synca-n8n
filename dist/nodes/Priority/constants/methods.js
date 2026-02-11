"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriorityMethods = exports.operationToFormName = void 0;
const SyncaService_1 = require("../../shared/SyncaService");
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
            const service = new SyncaService_1.SyncaService(this);
            return await service.getProviderCredentials();
        },
        async getSubForms() {
            try {
                const operation = this.getNodeParameter('operation');
                let formName;
                try {
                    formName = this.getNodeParameter('formName');
                }
                catch (e) {
                    formName = exports.operationToFormName[operation];
                }
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_subforms', 'POST', { formName });
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
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_forms', 'POST');
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
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_form_fields', 'POST', { formName, subFormName });
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
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_procedures', 'POST');
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
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_procedure_columns', 'POST', { procedure_name: this.getNodeParameter('procedureName') });
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
                const service = new SyncaService_1.SyncaService(this);
                const response = await service.invokeMetadata('get_form_fields_for_add', 'POST', { operation, formName, subFormName, subSubFormName });
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
                return { fields: [], emptyFieldsNotice: 'אין שדות למסך זה' };
            }
        },
    }
};
//# sourceMappingURL=methods.js.map