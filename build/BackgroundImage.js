
  function BackgroundImage(params) {
    this.params = params;
  }

  Object.defineProperty(BackgroundImage.prototype, "url", {get :function() {
    return this.params.url;
  }});
  Object.defineProperty(BackgroundImage.prototype, "repeat", {get :function() {
    return this.params.repeat;
  }});
  Object.defineProperty(BackgroundImage.prototype, "repeatx", {get :function() {
    return this.repeat[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "repeaty", {get :function() {
    return this.repeat[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "position", {get :function() {
    return this.params.position;
  }});
  Object.defineProperty(BackgroundImage.prototype, "positionx", {get :function() {
    return this.position[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "positiony", {get :function() {
    return this.position[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "units", {get :function() {
    return this.params.units;
  }});
  Object.defineProperty(BackgroundImage.prototype, "unitsx", {get :function() {
    return this.units[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "unitsy", {get :function() {
    return this.units[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "radio", {get :function() {
    return this.params.radio;
  }});
  Object.defineProperty(BackgroundImage.prototype, "size", {get :function() {
    return this.params.size;
  }});
  Object.defineProperty(BackgroundImage.prototype, "sizex", {get :function() {
    return this.size[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "sizey", {get :function() {
    return this.size[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "sunits", {get :function() {
    return this.params.sunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "sunitsx", {get :function() {
    return this.sunits[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "sunitsy", {get :function() {
    return this.sunits[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "width", {get :function() {
    return this.params.width;
  }});
  Object.defineProperty(BackgroundImage.prototype, "wunits", {get :function() {
    return this.params.wunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "height", {get :function() {
    return this.params.height;
  }});
  Object.defineProperty(BackgroundImage.prototype, "hunits", {get :function() {
    return this.params.hunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "padding", {get :function() {
    return this.params.padding;
  }});
  Object.defineProperty(BackgroundImage.prototype, "punits", {get :function() {
    return this.params.punits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "paddingleft", {get :function() {
    return this.params.paddingleft;
  }});
  Object.defineProperty(BackgroundImage.prototype, "plunits", {get :function() {
    return this.params.plunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "paddingtop", {get :function() {
    return this.params.paddingtop;
  }});
  Object.defineProperty(BackgroundImage.prototype, "ptunits", {get :function() {
    return this.params.ptunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "paddingright", {get :function() {
    return this.params.paddingright;
  }});
  Object.defineProperty(BackgroundImage.prototype, "prunits", {get :function() {
    return this.params.prunits;
  }});
  Object.defineProperty(BackgroundImage.prototype, "paddingbottom", {get :function() {
    return this.params.paddingbottom;
  }});
  Object.defineProperty(BackgroundImage.prototype, "pbunits", {get :function() {
    return this.params.pbunits;
  }});


exports.default=BackgroundImage;