export const calculateEstimatedReadingTime = (longDescription: string) => {
    const textContent = longDescription.replace(/<[^>]+>/g, '').trim();
    const words = textContent.split(/\s+/);
    const wordCount = words.length;
    return Math.ceil(wordCount / 200);
};
