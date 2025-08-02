import { ILoadOptionsFunctions, INodePropertyOptions, ResourceMapperFields } from "n8n-workflow";
export declare const operationToFormName: Record<string, string>;
export declare const PriorityMethods: {
    loadOptions: {
        getCredentials(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        getSubForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        getFormFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        getProcedures(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
    };
    resourceMapping: {
        getMappingColumns(this: ILoadOptionsFunctions): Promise<ResourceMapperFields>;
        getFormFields(this: ILoadOptionsFunctions): Promise<ResourceMapperFields>;
    };
};
