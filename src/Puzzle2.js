module path from 'path';
module fs from 'fs';
module Buffer from 'buffer';

//module images from 'images';

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

    //第一次遍历计算所需图像高宽度
    自己.css列表.forEach(function(css) {
      css.背景列表.forEach(function(背景) {
        console.log(背景)
        //var 图像 = images();
        var 文件 = path.join(css.路径, 背景.url);
        var 后缀 = path.extname(文件).toLowerCase();
        switch(后缀) {
          case '.gif':
          case '.jpg':
          case '.png':
            //倍率仅分普通1倍和高分辨2倍，大于1的都是高分
            var 数据 = 背景.倍率 > 1 ? 数据2倍 : 数据1倍;

            var 格式 = 后缀.slice(1);
            //TODO: 尚缺png8和png24的区分
            数据[格式] = 数据[格式] || {};
            var 格式数据 = 数据[格式];
            格式数据[背景.重复] = 格式数据[背景.重复] || { 宽: 0, 高: 0 };
            var 重复数据 = 格式数据[背景.重复];

            //省略高宽则计算图片高宽
            var 高 = 背景.高;
            var 宽 = 背景.宽;
            if(高 == -1) {
              //TODO
            }
            if(宽 == -1) {
              //TODO
            }

            //不重复和repeat-x均纵向叠加，repeat-y横向叠加，间隔均为10
            switch(背景.重复) {
              case 'no-repeat':
              case 'repeat-x':
                重复数据.宽 = Math.max(重复数据.宽, 宽);
                重复数据.高 += 高 + 10;
                break;
              case 'repeat-y':
                重复数据.高 = Math.max(重复数据.高, 高);
                重复数据.宽 += 宽 + 10;
                break;
            }
            break;
          default:
            throw new Error('不支持的文件后缀名：' + 文件 + '\n' + css.路径);
        }
      });
    });
  }
}

export default Puzzle;