var homunculus=require('homunculus');
var CssNode = homunculus.getClass('node', 'css');
var Token = homunculus.getClass('token', 'css');

exports.cal=cal;function cal(node, name) {
  var leaves;
  if(Array.isArray(node)) {
    leaves = node;
  }
  else {
    leaves = node.leaves();
  }
  name = name.toLowerCase();
  if(name == 'padding') {
    return calPadding(leaves);
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

function calPadding(leaves) {
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
  name = name.toLowerCase();
  if(name == 'padding') {
    return extendPadding(pre, key, name, current, radio);
  }
  var hash = pre[radio];
  //依次出栈选择器最后一个，全匹配父选择器
  while(key.length > 1) {
    key.pop();
    var s = key.join('');
    if(hash.hasOwnProperty(s)) {
      var block = hash[s];
      var value = cal(block, name);
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

function extendPadding(pre, key, name, current, radio) {
  var hash = pre[radio];
  //依次出栈选择器最后一个，全匹配父选择器
  while(key.length > 1) {
    key.pop();
    var s = key.join('');
    if(hash.hasOwnProperty(s)) {
      var block = hash[s];
      var value = calPadding(block.leaves(), name);
      if(!value) {
        return;
      }
      else if(value.units && value.units.some(function(o){ return o && o.string == '%' })) {
        value = extendPadding(pre, key, name, value, radio);
      }
      //计算本身和父类乘积
      current.property.forEach(function(v, i) {
        if(current.units[i]
          && current.units[i].string == '%') {
          var t = value.property[i];
          //省略写法
          if(!t) {
            t = i == 3 ? value.property[1] : value.property[0];
            t = t || value.property[0];
          }
          v.string = parseInt(v.string) * parseInt(t.string);
          v.string /= 100;
          v.string = String(Math.floor(v.string));
          current.units[i].string = 'px';
        }
      });
      //仍有%未处理返回空
      if(current.units.some(function(o){ return o && o.string == '%' })) {
        return;
      }
      return current;
    }
  }
}