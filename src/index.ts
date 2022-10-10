import RenderConfig from "./classes/RenderConfig";
import { userConfig, userPlugins } from "./config";

export const renderConfig = new RenderConfig(userConfig, userPlugins);
export * from "./classes/ImageRenderer";