[![Node.js CI](https://github.com/Angry-Penguins-Colony/server-penguins-renderer/actions/workflows/node.js.yml/badge.svg)](https://github.com/Angry-Penguins-Colony/server-penguins-renderer/actions/workflows/node.js.yml)

## ⚙ Package Renderer

This is a package installed in both servers that render images. This is the one that has the configuration of the rendering.

### How to configure it?

The configuration file is in `src/config.ts`.
Here's a default :

```typescript
import BadgePlugin from "./classes/plugins/badgePlugin/BadgePlugin";
import Resize2DImage from "./classes/plugins/Resize2DImage/Resize2DImage";
import ImageMIMEType from "./enums/ImageMIMEType";
import IPlugin from "./interfaces/IPlugin";
import IRenderConfigOptions from "./interfaces/IRenderConfigOptions";

export const userConfig: IRenderConfigOptions = {
    // this is the IPFS HTTP endpoint used to download the render images
    ipfsGateway: "https://ipfs.io/ipfs/", 
    
    // this is the output type; either PNG or JPEG
    renderMIMEType: ImageMIMEType.JPEG, 
    
    /* below is a key-value map of slots associated to Items ID there CID.
     *
     * e.g. if you request a Render with only background-10, 
     *      the package will get the image associated to CID QmVi2YhcCUn5F9TSRg57ebvo2BFGnRBqBtdrLz42L58bcZ from the IPFS
     */
    itemsCID: {
        "background": {
            "background-1": "QmasaaTYGqaLhuhqMTxr2FzbgTY2cr9azafhQiJHrQ6usy",
            "background-10": "QmVi2YhcCUn5F9TSRg57ebvo2BFGnRBqBtdrLz42L58bcZ",
            "background-2": "QmZyZ6LmiN5hm6HNDZbwBkCDibMZBoAmw5c84y2he5tSTU",
        },
        "beak": {
            "beak-bandana": "QmTpQx5Si16w7ePCZ2tqa7o3bxPsbJvWssWRGdPNHWxnbV",
            "beak-bitcoin": "QmbdGdr3TfPEpr5FycAzVe6tHf18nx4wo1xmmAudxRRMqS",
            "beak-blue-meth": "Qmb8d9ENAaMbvhXnnEo8yPoCUY55kKmV29rnakcp5MTKpt",
        },
        "eyes": {
            "eyes-bitcoin": "QmSCwDU723r6DQirKPE8KhAScvh9vVe3PABbaoSZUbuxzR",
            "eyes-black": "QmdXLCj5sviHAoHRysDEQmSGPTPJws3KkXnL4mZRJimi4C",
            "eyes-blue": "QmPUEmC6QnBehS1d5H4ovXiBNBdyCW8gMCVE71JYtj4c35",
        },
    },
    
    // The layers orders.
    // The last ones will be the most in front
    layersOrder: [
        "background",
        "beak",
        "eyes",
    ],
    
    // If no Item ID is specified for a slot, the default Item ID is used.
    // (this is optional) 
    defaultLayers: {
        "beak": "beak-classic",
        "eyes": "eyes-classic",
        "background": "background-1",
    },

};

// Each of these plugins can be removed
export const userPlugins: IPlugin[] = [
    /* The badge plugins create a new slot "badge"
     * The item ID associated to the badge is a number.
     *
     * If no skin is equipped (except defautLayers), the image of the badge is shown.
     */
    new BadgePlugin(
        {
            badgesFolderCID: "QmQyu1jfTbqnQ5MCdZ7iYUWx6h2KP4a922WZnboBuveqAa",
            badgePrefix: "badges-",
            badgeSuffix: "-render.png",
            deleteBadgeIfSlotsEquipped: [
                "skin"
            ]
        }
    ),
    
    // Force to resize the output to 1024px x 1024px
    new Resize2DImage(
        1024,
        1024
    ),
];
```

### How to extend rendering with plugins?

1. Create a class that extends `IPlugin`.

2. Implements the callback you need

   ```typescript
   export default interface IPlugin {
   
       /**
        * A plugin can create a layer that is not in the config, 
        * but needed to be in layers orders (like badge slot of BadgePlugin).
        */
       ownLayers?: string[];
       /**
        * Throw error if a badly configured.
        */
       checkConfig?(config: IRenderConfigOptions): void;
   
       /**
        * Override the CID for an item.
        */
       getCID?(slot: string, itemName: string): string | undefined;
   
       /**
        * Modify the attributes before the render
        * @param renderAttributes modified attributes
        */
       beforeRender?(renderAttributes: RenderAttributes, services: IServices): Promise<RenderAttributes>;
   
       /**
        * Called after the render is complete
        */
       modifyRender?(renderBuffer: Buffer, renderAttributes: RenderAttributes): Promise<Buffer>;
   
       /**
        * Called after the render is complete, and after the lateModifyRender
        */
       onRenderComplete?(renderBuffer: Buffer, renderAttributes: RenderAttributes): void;
   
       /**
        * Called after the render is complete, and after the onRenderComplete.
        * @param renderBuffer 
        * @param renderAttributes 
        */
       lateModifyRender?(renderBuffer: Buffer, renderAttributes: RenderAttributes): Promise<Buffer>;
   }
   ```

   

3. Instantiate your new plugin in `userPlugins` array.
