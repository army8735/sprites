
  function BackgroundImage(params) {
    this.params = params;
  }

  Object.defineProperty(BackgroundImage.prototype, "url", {get :function() {
    return this.params.url;
  }});
  Object.defineProperty(BackgroundImage.prototype, "repeatx", {get :function() {
    return this.params.repeat[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "repeaty", {get :function() {
    return this.params.repeat[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "positionx", {get :function() {
    return this.params.pos[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "positiony", {get :function() {
    return this.params.pos[1];
  }});
  Object.defineProperty(BackgroundImage.prototype, "unitsx", {get :function() {
    return this.params.units[0];
  }});
  Object.defineProperty(BackgroundImage.prototype, "unitsy", {get :function() {
    return this.params.units[1];
  }});


module.exports=BackgroundImage;