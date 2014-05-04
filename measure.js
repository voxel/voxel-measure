'use strict';

var glm = require('gl-matrix');
var vec3 = glm.vec3;
var asarray = require('asarray');

module.exports = function(game, opts) {
  return new MeasurePlugin(game, opts);
};
module.exports.pluginInfo = {
  loadAfter: ['voxel-registry', 'voxel-recipes', 'voxel-console', 'voxel-player']
};

function MeasurePlugin(game, opts) {
  this.registry = game.plugins.get('voxel-registry');
  if (!this.registry) throw new Error('voxel-measure requires voxel-registry plugin');

  this.console = game.plugins.get('voxel-console');
  if (!this.console) throw new Error('voxel-measure requires voxel-console plugin');

  this.player = game.plugins.get('voxel-player');
  if (!this.player) throw new Error('voxel-measure requires voxel-player plugin');

  this.startPos = undefined;
  this.endPos = undefined;

  this.enable();
}

MeasurePlugin.prototype.enable = function() {
  this.registry.registerItem('tapeMeasure', {
    itemTexture: 'i/paper', // TODO
    onUse: this.use.bind(this)
  });
  // TODO: recipe
};

MeasurePlugin.prototype.disable = function() {
  // TODO: unregister item
};

MeasurePlugin.prototype.use = function(held, target) {
  if (!this.startPos) {
    this.startPos = vec3.fromValues(this.player.position.x, this.player.position.y, this.player.position.z);
    this.console.log('Starting position ('+asarray(this.startPos).join(',')+')');
  } else {
    var endPos = vec3.fromValues(this.player.position.x, this.player.position.y, this.player.position.z);
    var distance = vec3.distance(this.startPos, endPos);

    this.console.log(distance + ' from ('+asarray(this.startPos).join(',')+') - ('+asarray(endPos).join(',')+')');

    this.startPos = undefined;
  }
};