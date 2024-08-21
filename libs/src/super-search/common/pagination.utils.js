"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (data, page, limit, total) => {
    const meta = {
        currentPage: Number(page),
        from: Number((page - 1) * limit + 1),
        perPage: Number(limit),
        lastPage: Number(Math.ceil(total / limit)),
        to: Number(page !== Math.ceil(total / limit)
            ? (page - 1) * limit + data.length
            : total - (page - 1) * limit),
        total,
    };
    return meta;
};
exports.pagination = pagination;
//# sourceMappingURL=pagination.utils.js.map