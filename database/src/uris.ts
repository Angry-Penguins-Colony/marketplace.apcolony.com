export const getItemWebThumbnail = (id: string): string => {
    return `https://apc-items.s3.eu-west-3.amazonaws.com/thumbnail_web/${id}-thumbnail-web.jpg`
};

export const getRenderWebThumbnail = (id: string): string => {
    return `https://apc-items.s3.eu-west-3.amazonaws.com/render_web/${id}-render-web-1024x1024.png`;
}

export const getPenguinWebThumbnail = (cid: string): string => {
    return `https://apc-penguins.s3.eu-west-3.amazonaws.com/${cid}-web.jpg`;
}

export const ipfsGateway = "https://ipfs.io/ipfs/";