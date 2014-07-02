var path=require('path');
var fs=require('fs');
var Buffer=require('buffer');


  function Puzzle() {
    this.history = {};
  }

  Puzzle.prototype.parse = function(csses ) {
    if(csses===void 0)csses = [ ];csses.forEach(function(css) {
      css.res = css.string;
      //从尾部开始不影响字符串拼接
      css.bgis.reverse().forEach(function(bgi) {
        if(!css.path) {
          throw new Error('css file missing path when has background-image to be puzzled: ' + JSON.stringify(css));
        }
        var uri = path.join(css.path, bgi.url);
        if(!fs.existsSync(uri)) {
          throw new Error('uri is 404: ' + uri + ' in: ' + css.path);
        }
        if(!fs.statSync(uri).isFile()) {
          throw new Error('uri is not a file: ' + uri + ' in: ' + css.path);
        }
        var buf = fs.readFileSync(uri);
        for(var i = 0; i < buf.length && i < 100; i++) {
          //console.log(buf[i])
        }
        fs.writeFileSync(uri + '.txt', buf.toString());
      });
    });
    return csses;
  }

  Puzzle.parse=function(csses) {
    return new Puzzle().parse(csses);
  }


module.exports=Puzzle;