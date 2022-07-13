import ImageRenderer from "./classes/ImageRenderer";
import RenderConfig from "./classes/RenderConfig";
import { userConfig, userPlugins } from "./config";

export const renderConfig = new RenderConfig(userConfig, userPlugins);
const imageRenderer = new ImageRenderer(renderConfig);

export default imageRenderer;