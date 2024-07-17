export const pagination = (
    data: Array<Record<string, any>>,
    page: number,
    limit: number,
    total: number,
) => {
    const meta = {
        currentPage: Number(page),
        from: Number((page - 1) * limit + 1),
        perPage: Number(limit),
        lastPage: Number(Math.ceil(total / limit)),
        to: Number(
            page !== Math.ceil(total / limit)
                ? (page - 1) * limit + data.length
                : total - (page - 1) * limit,
        ),
        total,
    };

    return meta;
};
