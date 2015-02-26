module path from 'path';
module fs from 'fs';
module Buffer from 'buffer';

module images from 'images';

class Puzzle {
  constructor(css列表, 根路径, 映射) {
    this.css列表 = css列表;
    this.根路径 = 根路径;
    this.映射 = 映射;
  }

  解析() {
    //数据中先按不同格式储存hash，再二级按是否重复储存hash
    var 数据1倍 = {};
    var 数据2倍 = {};
    var 自己 = this;

    //第1次遍历计算所需图像高宽度
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        var 文件 = path.join(path.dirname(css.路径), 背景.url);
        var 图片 = images(文件);
        背景.图片 = 图片;

        var 后缀 = path.extname(文件).toLowerCase();
        switch(后缀) {
          case '.gif':
          case '.jpg':
          case '.png':
            //倍率仅分普通1倍和高分辨2倍，大于1的都是高分
            var 数据 = 背景.倍率 > 1 ? 数据2倍 : 数据1倍;

            var 格式 = 后缀.slice(1);
            //区分png8和png24，以IHDR的ColorType是否为3确定
            if(格式 == 'png') {
              var 读取buf = fs.readFileSync(文件);
              格式 += 读取buf[25] == 3 ? 8 : 24;
            }
            数据[格式] = 数据[格式] || {};
            var 格式数据 = 数据[格式];
            格式数据[背景.重复] = 格式数据[背景.重复] || { 宽: 0, 高: 0 };

            背景.图高 = 背景.高;
            背景.图宽 = 背景.宽;
            //省略高宽则计算图片高宽
            if(背景.图高 == -1) {
              背景.图高 = 图片.height();
            }
            if(背景.图宽 == -1) {
              背景.图高 = 图片.width();
            }

            var 重复数据 = 格式数据[背景.重复];
            //不重复和repeat-x均纵向叠加，repeat-y横向叠加，间隔均为10
            switch(背景.重复) {
              case 'no-repeat':
              case 'repeat-x':
                重复数据.宽 = Math.max(重复数据.宽, 背景.图宽);
                重复数据.高 += 背景.图高 + 10;
                break;
              case 'repeat-y':
                重复数据.高 = Math.max(重复数据.高, 背景.图高);
                重复数据.宽 += 背景.图宽 + 10;
                break;
            }
            break;
          default:
            throw new Error('不支持的文件后缀名：' + 文件 + '\n' + css.路径);
        }
      });
    });

    //用计算出的高宽先创造个空白图像
    自己.初始化空白图像(数据1倍);
    自己.初始化空白图像(数据2倍);
    console.log(数据1倍, 数据2倍);

    //第2次遍历拼图
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {

      });
    });
  }

  初始化空白图像(数据) {
    Object.keys(数据).forEach(function(格式) {
      var 格式数据 = 数据[格式];
      Object.keys(格式数据).forEach(function(重复) {
        var 重复数据 = 格式数据[重复];
        重复数据.图像 = images(重复数据.宽, 重复数据.高);
      });
    });
  }
}

export default Puzzle;