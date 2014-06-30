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

exports.extend=extend;function extend(pre, selector, name, current, radio) {
  var key = [];
  var last;
  if(Array.isArray(selector)) {
    key = selector;
  }
  else {
    selector.leaves().forEach(function(node) {
      var token = node.token();
      var s = token.content();
      //不相邻的两个选择器以空格链接
      if(last && last.tid() < token.tid() - 1) {
        key.push(' ');
      }
      last = token;
      key.push(s);
    });
  }
  pre = pre[radio];
  //依次出栈选择器最后一个，全匹配父选择器
  while(key.length > 1) {
    key.pop();
    var s = key.join('');
    if(pre.hasOwnProperty(s)) {
      var block = pre[s];
      var value = normal(block, name);
      if(!value) {
        value = extend(pre, key, name, current, radio);
      }
      else if(value.units && value.units.string == '%') {
        value = extend(pre, key, name, value, radio);
      }
      //计算本身和父类乘积
      if(value && current && current.units) {
        value.property.string = parseInt(value.property.string) * parseInt(current.property.string);
        if(current.units.string == '%') {
          value.property.string /= 100;
        }
        value.property.string = String(Math.floor(value.property.string));
        value.units.string = 'px';
      }
      return value;
    }
  }
}