export interface Schema {
    key: string;
    type:
        | 'Relation'
        | 'Index'
        | 'File'
        | 'Boolean'
        | 'String'
        | 'Number'
        | 'Date'
        | 'Enum';
    label: string;
    required: boolean;
    isTableShow: boolean;
    columnPosition?: number;
    default?: any;
    ref?: string;
    enum?: string[];
    entity?: Entity;
    index?: boolean;
}

export interface Entity {
    name: string;
    schema: {
        [key: string]: Schema;
    };
}
