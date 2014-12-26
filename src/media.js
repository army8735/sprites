module homunculus from 'homunculus';
var CssNode = homunculus.getClass('Node', 'css');
var Token = homunculus.getClass('Token', 'css');

import join from './join';

var DP_RADIO = {
  'min-device-pixel-ratio': true,
  'min--moz-device-pixel-ratio': true
};

export default function media(node) {
  var mql = node.leaf(1);
  var leaves = mql.leaves();
  for(var i = 0; i < leaves.length; i++) {
    var mq = leaves[i];
    var leaves2 = mq.leaves();
    for(var j = 0; j < leaves2.length; j++) {
      var expression = leaves2[j];
      if(expression.name() == CssNode.EXPR) {
        var key = expression.leaf(1);
        var value = expression.leaf(3);
        if(key && key.name() == CssNode.KEY
          && value && value.name() == CssNode.VALUE) {
          if(DP_RADIO.hasOwnProperty(key.last().token().content().toLowerCase())) {
            var val = join(value);
            try {
              val = parseInt(val);
              if(isNaN(val)) {
                val = 1;
              }
              return val;
            } catch(e) {
              return 1;
            }
          }
        }
      }
    }
  }
  return 1;
}