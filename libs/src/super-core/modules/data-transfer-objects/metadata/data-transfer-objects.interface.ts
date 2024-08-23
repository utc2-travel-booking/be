export interface DTOMetadataForm {
    [field: string]: {
        title: string;
        type: string;
        isArray: boolean;
        ref: string | null;
        required: boolean;
    };
}

export interface DTOMetadata {
    name: string;
    form: DTOMetadataForm;
}
