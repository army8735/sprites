var gConfig = {};
var single;

var fs=require('fs');

var BackgroundImage=require('BackgroundImage');
var parser=require('parser');


  function Sprites(csses ) {
    if(csses===void 0)csses = null;var self = this;
    self.csses = Array.isArray(csses) ? csses : (csses ? [csses] : []);
  }

  Sprites.prototype.parse = function(csses ) {
    if(csses===void 0)csses = null;if(csses) {
      this.csses = Array.isArray(csses) ? csses : [csses];
    }
    this.csses.forEach(function(css, i) {
      if(!css.hasOwnProperty('string')) {
        if(!css.hasOwnProperty('path')) {
          throw new Error('css file missing path: ' + JSON.stringify(css));
        }
        css.string = fs.readFileSync(css.path, { encoding: css.encoding || gConfig.encoding || 'utf-8' });
      }
      css.bgis = parser.bgis(css);
    });
    return this.css;
  }

  Sprites.config=function(data ) {
    if(data===void 0)data = { };Object.keys(data).forEach(function(k) {
      gConfig.k = data[k];
    });
  }

  Sprites.parse=function(csses) {
    if(!single) {
      single = new Sprites();
    }
    return single.parse(csses);
  }


module.exports=Sprites;