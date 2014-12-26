var path=require('path');
var fs=require('fs');
var Buffer=require('buffer');


  function Puzzle() {
    this.history = {};
  }

  Puzzle.prototype.parse = function(csses) {
    //先过滤掉无需处理的
    if(csses===void 0)csses=[];this.filter(csses);

    //预处理，排除异常情况，当只有1个背景图时忽略
    var count = 0;
    var hash = {};
    csses.forEach(function(css) {
      //结果记录在res属性上：string表示处理后的css code
      css.res = {
        string: css.string
      };
      css.bgis.forEach(function(bgi) {
        if(!bgi.ignore) {
          var uri = bgi.url.resource;
          if(!hash.hasOwnProperty(uri)) {
            count++;
            hash[uri] = true;
          }
        }
      });
    });

    //从头开始处理，记录在res对象上：hash存储图片数据，以key为位置，二进制为值
    if(count > 1) {
      count = 0;
      csses.forEach(function(css) {
        css.bgis.forEach(function(bgi) {
          //
        });
      });
    }

    return csses;
  }
  Puzzle.prototype.filter = function(csses) {
    csses.forEach(function(css) {
      css.bgis.forEach(function(bgi) {
        if(!css.path) {
          throw new Error('css file missing path when has background-image to be puzzled: ' + JSON.stringify(css));
        }
        //无视使用base64、线上路径、自己写了background-position
        if(bgi.url.string.indexOf('data:') == 0
          || /^(http|ftp)/.test(bgi.url.string)
          || bgi.position.length) {
          bgi.ignore = true;
          return;
        }
        //各种404
        var uri = path.join(css.path, bgi.url.string);
        if(!fs.existsSync(uri)) {
          throw new Error('uri is 404: ' + uri + ' in: ' + css.path);
        }
        if(!fs.statSync(uri).isFile()) {
          throw new Error('uri is not a file: ' + uri + ' in: ' + css.path);
        }
        //存储绝对资源路径位置
        bgi.url.resource = uri;
      });
    });
  }

  Puzzle.parse=function(csses) {
    return new Puzzle().parse(csses);
  }


exports.default=Puzzle;