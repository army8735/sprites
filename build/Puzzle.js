var path=require('path');
var fs=require('fs');

var images=require('images');


  function Puzzle(css列表) {
    this.css列表 = css列表;
  }

  Puzzle.prototype.解析 = function(根路径, 间距) {
    //数据中先按不同格式储存hash，再二级按是否重复储存hash
    var 数据1倍 = {};
    var 数据2倍 = {};
    var 自己 = this;

    //第1次遍历计算所需图像高宽度
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        var 路径 = null;
        //根路径
        if(背景.url.charAt(0) == '/') {
          路径 = path.join(根路径, 背景.url);
        }
        else {
          路径 = path.join(path.dirname(css.路径), 背景.url);
        }

        var 后缀 = path.extname(路径).toLowerCase();
        switch(后缀) {
          case '.gif':
          case '.jpg':
          case '.png':
            //倍率仅分普通1倍和高分辨2倍，大于1的都是高分
            var 数据 = 背景.倍率 > 1 ? 数据2倍 : 数据1倍;

            var 格式 = 后缀.slice(1);
            //区分png8和png24，以IHDR的ColorType是否为3确定
            if(格式 == 'png') {
              var 读取buf = fs.readFileSync(路径);
              格式 += 读取buf[25] == 3 ? 8 : 24;
            }
            数据[格式] = 数据[格式] || {};
            var 格式数据 = 数据[格式];
            格式数据[背景.重复] = 格式数据[背景.重复] || { 宽: 0, 高: 0, 索引: 0, 后缀: 后缀 };

            //存放引用
            背景.引用 = 格式数据[背景.重复];
            背景.路径 = 路径;

            背景.图高 = 背景.高;
            背景.图宽 = 背景.宽;
            var 图片 = null;
            //省略高宽则计算图片高宽
            if(背景.图高 == -1) {
              图片 = 图片 || images(路径);
              背景.图高 = 图片.height();
            }
            if(背景.图宽 == -1) {
              图片 = 图片 || images(路径);
              背景.图宽 = 图片.width();
            }

            var 重复数据 = 格式数据[背景.重复];
            //不重复和repeat-x均纵向叠加，repeat-y横向叠加，间隔均为10
            switch(背景.重复) {
              case 'no-repeat':
              case 'repeat-x':
                重复数据.宽 = Math.max(重复数据.宽, 背景.图宽);
                重复数据.高 += 背景.图高 + 间距;
                break;
              case 'repeat-y':
                重复数据.高 = Math.max(重复数据.高, 背景.图高);
                重复数据.宽 += 背景.图宽 + 间距;
                break;
            }
            break;
          default:
            throw new Error('不支持的文件后缀名：' + 路径 + '\n' + css.路径);
        }
      });
    });

    //用计算出的高宽先创造个空白图像
    自己.初始化图像(数据1倍);
    自己.初始化图像(数据2倍);

    //第2次遍历拼图
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        var 背景图 = images(背景.路径);
        var 引用 = 背景.引用;
        背景.位置索引 = 引用.索引;
        switch(背景.重复) {
          case 'no-repeat':
          case 'repeat-x':
            引用.图像.draw(背景图, 0, 引用.索引);
            引用.索引 += 背景.图高;
            break;
          case 'repeat-y':
            引用.图像.draw(背景图, 引用.索引, 0);
            引用.索引 += 背景.图宽;
            break;
        }
        引用.索引 += 间距;
      });
    });

    //所有数据存入array
    var 列表 = [];
    自己.存入结果(列表, 数据1倍);
    自己.存入结果(列表, 数据2倍);

    //转为Buffer
    var 二进制列表 = 列表.map(function(数据) {
      return {
        '图像':数据.图像.encode(数据.后缀),
        '后缀': 数据.后缀
      };
    });

    //背景列表添加索引指向二进制列表的项
    var len = 列表.length;
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        for(var i = 0; i < len; i++) {
          if(列表[i].图像 == 背景.引用.图像) {
            背景.二进制索引 = i;
            delete 背景.引用;
            return;
          }
        }
      });
    });

    return 二进制列表;
  }
  Puzzle.prototype.初始化图像 = function(数据) {
    Object.keys(数据).forEach(function(格式) {
      var 格式数据 = 数据[格式];
      Object.keys(格式数据).forEach(function(重复) {
        var 重复数据 = 格式数据[重复];
        重复数据.图像 = images(重复数据.宽, 重复数据.高);
      });
    });
  }
  Puzzle.prototype.存入结果 = function(返回, 数据) {
    Object.keys(数据).forEach(function(格式) {
      var 格式数据 = 数据[格式];
      Object.keys(格式数据).forEach(function(重复) {
        var 重复数据 = 格式数据[重复];
        返回.push({
          '图像':重复数据.图像,
          '后缀': 重复数据.后缀
        });
      });
    });
  }


exports.default=Puzzle;