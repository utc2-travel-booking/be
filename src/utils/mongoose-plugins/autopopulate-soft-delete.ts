import { Schema } from 'mongoose';

const autopopulateSoftDelete = (schema: Schema) => {
    schema.pre('find', function (next) {
        this.where({ deletedAt: null });
        next();
    });

    schema.pre('findOne', function (next) {
        this.where({ deletedAt: null });
        next();
    });

    schema.pre('findOneAndUpdate', function (next) {
        this.where({ deletedAt: null });
        next();
    });

    schema.pre('countDocuments', function (next) {
        this.where({ deletedAt: null });
        next();
    });
};

export default autopopulateSoftDelete;
