const { Edge } = require("edge.js");
const { join } = require("path");
const { Transformer } = require("@parcel/plugin");

const edge = new Edge({ cache: false });
let mounted = false;

module.exports = new Transformer({
  async loadConfig({ config }) {
    const { contents, filePath } = (await config.getConfig([".edgerc.js", "edge.config.js"])) || {};

    config.invalidateOnStartup();

    if (contents) {
      config.invalidateOnFileChange(filePath);
    } else {
      config.invalidateOnFileCreate({
        fileName: ".edgerc.js" || "edge.config.js",
        aboveFilePath: config.searchPath
      });
    }

    return contents;
  },
  async transform({ asset, config }) {
    if (!config) {
      return [asset];
    }

    const edgeConfig = config || {};

    // register views directory
    if (!mounted) {
      const root = process.cwd();
      const viewsDir = edgeConfig.views || "views";
      edge.mount(join(root, viewsDir));
      mounted = true;
    }

    // register templates
    const templates = edgeConfig.templates || {};
    if (templates) {
      Object.keys(templates).forEach((key) => {
        edge.registerTemplate(key, templates[key]);
      });
    }

    const state = edgeConfig.state || {};
    const source = await asset.getCode();
    const compiled = await edge.renderRaw(source, state);

    asset.type = "html";
    asset.setCode(compiled);

    return [asset];
  }
});
