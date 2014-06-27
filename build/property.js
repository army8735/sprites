var homunculus=require('homunculus');
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token');

exports.normal=normal;function normal(node, name) {
  var leaves;
  if(Array.isArray(node)) {
    leaves = node;
  }
  else {
    leaves = node.leaves();
  }
  //后面的width会覆盖掉前面的
  for(var i = leaves.length - 1; i > -1; i--) {
    var style = leaves[i];
    if(style.name() == CssNode.STYLE) {
      var key = style.first();
      if(key.first().token().content().toLowerCase() == name.toLowerCase()) {
        var value = style.leaf(2);
        var node = value.first();
        var token = node.token();
        var property = {
          'string': token.content(),
          'index': token.sIndex()
        };
        var units = null;
        node = node.next();
        if(node && node.token().type() == Token.UNITS) {
          units = {
            'string': node.token().content(),
            'index': node.token().sIndex()
          }
        }
        return {
          property: property,
          units: units,
          i: i
        };
      }
    }
  }
}

exports.padding=padding;function padding(node, name) {
  var leaves;
  if(Array.isArray(node)) {
    leaves = node;
  }
  else {
    leaves = node.leaves();
  }
  //后面的padding会覆盖掉前面的
  for(var i = leaves.length - 1; i > -1; i--) {
    var style = leaves[i];
    if(style.name() == CssNode.STYLE) {
      var key = style.first();
      if(key.first().token().content().toLowerCase() == 'padding') {
        var value = style.leaf(2);
        var leaves2 = value.leaves();
        var padding = [];
        var units = [];
        leaves2.forEach(function(leaf) {
          if(leaf && leaf.token().type() == Token.NUMBER) {
            var token = leaf.token();
            padding.push({
              'string': token.content(),
              'index': token.sIndex()
            });
          }
          leaf = leaf.next();
          if(leaf && leaf.token().type() == Token.UNITS) {
            units.push({
              'string': leaf.token().content(),
              'index': leaf.token().sIndex()
            });
          }
          else {
            units.push(null);
          }
        });
        return {
          property: padding,
          units: units,
          i: i
        };
      }
    }
  }
}