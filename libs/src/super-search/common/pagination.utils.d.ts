export declare const pagination: (data: Array<Record<string, any>>, page: number, limit: number, total: number) => {
    currentPage: number;
    from: number;
    perPage: number;
    lastPage: number;
    to: number;
    total: number;
};
