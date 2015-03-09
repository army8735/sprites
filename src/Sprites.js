module fs from 'fs';

module homunculus from 'homunculus';

import Parser from './Parser';
import Puzzle from './Puzzle';

class Sprites {
  constructor(css列表, 根路径 = '', 间距 = 10) {
    this.css列表 = Array.isArray(css列表) ? css列表 : [css列表];
    this.根路径 = 根路径;
    this.间距 = 间距;
  }

  //一个项目所有需要处理的css数据通过列表传入
  解析() {
    var 解析器 = new Parser();

    //遍历处理每个，解析全部后进行合并图片步骤
    this.css列表.forEach(function(css) {
      if(!css.hasOwnProperty('内容')) {
        if(!css.hasOwnProperty('路径')) {
          throw new Error('css没有内容也没有可读取路径：' + JSON.stringify(css));
        }
        css.内容 = fs.readFileSync(css.路径, { encoding: 'utf-8' });
      }
      css.背景列表 = 解析器.解析(css);
    });

    var 拼图 = new Puzzle(this.css列表);
    return 拼图.解析(this.读根路径(), this.读间距());
  }
  //将url回填css的内容，倒序进行不干扰索引
  替换(url列表) {
    var 结果 = this.css列表.reverse().map(function(css) {
      var 内容 = css.内容;
      css.背景列表.reverse().forEach(function(背景) {
        //替换掉url和pos
        switch(背景.重复) {
          case 'repeat-x':
            内容 = 内容.slice(0, 背景.开始) + '"' + url列表[背景.二进制索引].replace(/"/g, '\\"') + '"'
              + 内容.slice(背景.结束, 背景.插入位置) + ' 0 ' + (背景.位置索引 ? -背景.位置索引 + 'px' : 0) + 内容.slice(背景.插入位置);
            break;
          case 'no-repeat':
          case 'repeat-y':
            内容 = 内容.slice(0, 背景.开始) + '"' + url列表[背景.二进制索引].replace(/"/g, '\\"') + '"'
              + 内容.slice(背景.结束, 背景.插入位置) + ' ' + (背景.位置索引 ? -背景.位置索引 + 'px 0' : '0 0') + 内容.slice(背景.插入位置);
            break;
        }
      });
      return 内容;
    });
    return 结果.reverse();
  }

  读根路径() {
    return this.根路径;
  }
  写根路径(根路径) {
    this.根路径 = 根路径;
    return this.根路径;
  }

  读间距() {
    return this.间距;
  }
  写间距(间距) {
    this.间距 = 间距;
    return this.间距;
  }

  static 添加关键字(关键字) {
    homunculus.getClass('rule', 'css').addKeyWord(关键字);
  }
}

export default Sprites;