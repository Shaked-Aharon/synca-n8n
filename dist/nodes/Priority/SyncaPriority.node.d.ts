import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class SyncaPriority implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getCredentials(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
            getSubForms(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
            getForms(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
            getFormFields(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
            getProcedures(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").INodePropertyOptions[]>;
        };
        resourceMapping: {
            getMappingColumns(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").ResourceMapperFields>;
            getFormFields(this: import("n8n-workflow").ILoadOptionsFunctions): Promise<import("n8n-workflow").ResourceMapperFields>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
