const { Edge } = require("edge.js");
const edge = new Edge({ cache: false });
const { join } = require("path");
const { Transformer } = require("@parcel/plugin");

module.exports = new Transformer({
  async loadConfig({ config }) {
    const { contents, filePath } = (await config.getConfig([".edgerc.js", "edge.config.js"])) || {};

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
    const edgeConfig = config || {
      views: "views",
      state: {},
      templates: {}
    };
    // register views directory
    const root = process.cwd();
    edge.mount(join(root, edgeConfig.views));

    // register templates
    const templates = edgeConfig.templates;
    if (templates) {
      Object.keys(templates).forEach((key) => {
        edge.registerTemplate(key, templates[key]);
      });
    }

    const state = edgeConfig.state;
    const source = await asset.getCode();
    const compiled = edge.renderRaw(source, state);

    asset.type = "html";
    asset.setCode(compiled);

    return [asset];
  }
});
