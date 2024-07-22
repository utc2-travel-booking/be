export const generateKey = (serialized: object) => {
    const encoded = Buffer.from(JSON.stringify(serialized), 'base64');
    return encoded.toString('hex');
};
