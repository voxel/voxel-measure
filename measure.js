'use strict';

var glm = require('gl-matrix');
var vec3 = glm.vec3;
var asarray = require('asarray');

module.exports = function(game, opts) {
  return new MeasurePlugin(game, opts);
};
module.exports.pluginInfo = {
  loadAfter: ['voxel-registry', 'voxel-recipes', 'voxel-console']
};

function MeasurePlugin(game, opts) {
  this.registry = game.plugins.get('voxel-registry');
  if (!this.registry) throw new Error('voxel-measure requires voxel-registry plugin');

  this.console = game.plugins.get('voxel-console');
  if (!this.console) throw new Error('voxel-measure requires voxel-console plugin');

  this.recipes = game.plugins.get('voxel-recipes'); // optional
  this.registerRecipes = opts.registerRecipe !== undefined ? opts.registerRecipe : true;

  this.startPos = undefined;
  this.endPos = undefined;

  this.enable();
}

MeasurePlugin.prototype.enable = function() {
  this.registry.registerItem('tapeMeasure', {
    itemTexture: 'i/paper', // TODO
    onUse: this.use.bind(this),
    displayName: 'Tape Measure'
  });
  if (this.recipes && this.registerRecipes) {
    this.recipes.registerAmorphous(['stick', 'stick'], ['tapeMeasure']); // TODO: better recipe, with string
  }
};

MeasurePlugin.prototype.disable = function() {
  // TODO: unregister item
};

// represent a vec3 for a coordinate as a string (x,y,z)
var strCoords = function(pos) {
  return '(' + asarray(pos).join(', ') + ')';
}

MeasurePlugin.prototype.use = function(held, target) {
  if (!target.voxel) {
    this.console.log('Right-click a voxel to start measuring'); // TODO: use player position if not clicking a voxel?
    return;
  }

  if (!this.startPos) {
    this.startPos = vec3.fromValues.apply(null, target.voxel);
    this.console.log('Starting position '+strCoords(this.startPos));
  } else {
    var endPos = vec3.fromValues.apply(null, target.voxel);
    var distance = vec3.distance(this.startPos, endPos);

    this.console.log(distance.toFixed(1) + ' from '+strCoords(this.startPos)+' - '+strCoords(endPos));

    this.startPos = undefined;
  }
};
