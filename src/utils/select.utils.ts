export const configSelect = (search: string | object) => {
    if (!search) return null;
    const keys = search.toString().split(',');
    const select = keys.reduce((acc, key) => {
        acc[key] = 1;
        return acc;
    }, {});

    return select;
};
