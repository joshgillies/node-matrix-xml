var Action = require('node-matrix-import-actions');
var assets = require('node-matrix-assets');
var xml2js = require('xml2js');
var extend = require('xtend');

function Importer(opts) {
  if (!(this instanceof Importer))
    return new Importer(opts);

  this._actions = [];
  this._ids = [];
}

Importer.prototype.addAction = function addAction(type, opts) {
  var action = new Action(type, opts);
  this._actions.push(action);
  return action;
};

Importer.prototype.addPath = Importer.prototype.addWebPath = function addPath(opts) {
  return this.addAction('add_path', opts);
};

Importer.prototype.createAsset = function createAsset(type, opts) {
  if (!opts)
    opts = {};

  if (typeof type === 'string')
    opts.type = type;

  if (typeof type === 'object') {
    opts = type;
    type = undefined;
  }

  if (!opts.id)
    opts.id = assets(opts.type) ?
      assets(opts.type).name.replace(' ', '_') + '_' + (this._ids.length + 1) : undefined;

  var pointer = this._ids.push(this._actions.length);

  return extend(this.addAction('create_asset', opts), { id: pointer });
};

Importer.prototype.createLink = function createLink(opts) {
  return this.addAction('create_link', opts);
};

Importer.prototype.setAttribute = Importer.prototype.setAttributeValue = function setAttribute(opts) {
  return this.addAction('set_attribute', opts);
};

Importer.prototype.setPermission = function setPermission(opts) {
  return this.addAction('set_permission', opts);
};

Importer.prototype.getActionById = function getActionById(id) {
  return this._actions[this._ids[--id]];
};

Importer.prototype.toString = function importerToString(renderOpts) {
  var opts = {
    rootName: 'actions'
  };

  if (renderOpts && typeof renderOpts === 'object')
    opts.renderOpts = renderOpts;

  return new xml2js.Builder(opts).buildObject({
    action: this._actions
  });
};

module.exports = Importer;
