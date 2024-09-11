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
            localField: 'bannerImages.featuredImage',
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
        $lookup: {
            from: COLLECTION_NAMES.FILE,
            localField: 'bannerImages.iconImage',
            foreignField: '_id',
            as: 'iconImage',
        },
    },
    {
        $unwind: {
            path: '$iconImage',
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
                    featuredImage: '$fileDetails',
                    iconImage: '$iconImage',
                    title: '$bannerImages.title',
                    shortDescription: '$bannerImages.shortDescription',
                    labelButton: '$bannerImages.labelButton',
                },
            },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
        },
    },
];
