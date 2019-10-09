export interface Entity {
}

export class ForeignKey {
    id: number;
    targetEntity: string;
    url: string;
}

export type EntityConfiguration = {
    path: string;
}

export type EntitiesConfiguration = {
    [key: string]: EntityConfiguration;
}

export class KrintHeaders {
    logga: boolean;
}


export class BatchOperation {
    operation: BatchOperationTypes;
    id: any;
    entityPath: string;
    entityBody: Entity;
    additionalData: any;
}

export enum BatchOperationTypes {
    INSERT = "INSERT",
    UPDATE = "UPDATE",
    DELETE = "DELETE"
}




