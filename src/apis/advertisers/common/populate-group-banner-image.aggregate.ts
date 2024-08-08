import { COLLECTION_NAMES } from 'src/constants';

export const populateGroupBannerImageAggregate = [
    {
        $unwind: {
            path: '$bannerImages',
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: COLLECTION_NAMES.FILE,
            localField: 'bannerImages.file',
            foreignField: '_id',
            as: 'fileDetails',
        },
    },
    {
        $unwind: {
            path: '$fileDetails',
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            slug: { $first: '$slug' },
            bannerImages: {
                $push: {
                    urlRedirect: '$bannerImages.urlRedirect',
                    file: '$fileDetails',
                },
            },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    },
];
