sprites
====

> css auto sprites

[![NPM version](https://badge.fury.io/js/sprites.png)](https://npmjs.org/package/sprites)
[![Build Status](https://travis-ci.org/army8735/sprites.svg?branch=master)](https://travis-ci.org/army8735/sprites)
[![Coverage Status](https://coveralls.io/repos/army8735/sprites/badge.png)](https://coveralls.io/r/army8735/sprites)
[![Dependency Status](https://david-dm.org/army8735/sprites.png)](https://david-dm.org/army8735/sprites)

## INSTALL
```
npm install sprites
```

## 使用说明
* sprites自动分析传入css文件列表中的background部分，根据一定规则匹配出所有的背景图将之合并，即自动雪碧图
* 解析语法树进行识别，保证准确性
* 区分不同的图片格式，包括png8和png24
* 区分高清图，即1倍和2倍
* 提供底层接口，返回合并后的图片二进制数据，存储由应用层自己控制
* 中文编码，ES6书写，转换为ES5

## API

### Sprites
* constructor(css列表:Array\<Object>, 根路径:String = '', 间距:int = 10) 传入需要解析的css列表，可选根路径和图片拼接间距
```
[{
  "路径": String,
  "内容": String = null
}]
```
* 解析():Array\<Object> 解析css列表，提取background部分，返回拼好的图片列表数据
 * 仅识别background缩写，分开的background-image将忽略
 * 前缀hack（如：-background）将忽略
 * background的url值为base64、线上地址时将忽略
 * background设置了position时将忽略
 * 此选择器的width/height为0时将忽略
 * 未设置width/height或不为px时将读取图片高宽
 * 图片如果是相对根路径，必须提供根路径配置
```
[{
  "图像": Buffer,
  "后缀": String
}]
```
* 替换(url列表:Array\<String>):Array\<String> 在解析的基础上，将存好的图片的url数组传回，替换掉原css中的引用，索引按`解析()`方法中的返回顺序
* 读根路径():String 返回根路径
* 写根路径(根路径:String):void 设置根路径
* 读间距():String 返回间距
* 写间距(间距:int):void 设置间距