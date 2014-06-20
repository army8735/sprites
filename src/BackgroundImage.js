class BackgroundImage {
  constructor(params) {
    this.params = params;
  }

  get url() {
    return this.params.url;
  }
  get repeat() {
    return this.params.repeat;
  }
  get repeatx() {
    return this.repeat[0];
  }
  get repeaty() {
    return this.repeat[1];
  }
  get position() {
    return this.params.position;
  }
  get positionx() {
    return this.position[0];
  }
  get positiony() {
    return this.position[1];
  }
  get units() {
    return this.params.units;
  }
  get unitsx() {
    return this.units[0];
  }
  get unitsy() {
    return this.units[1];
  }
  get radio() {
    return this.params.radio;
  }
  get size() {
    return this.params.size;
  }
  get sizex() {
    return this.size[0];
  }
  get sizey() {
    return this.size[1];
  }
  get sunits() {
    return this.params.sunits;
  }
  get sunitsx() {
    return this.sunits[0];
  }
  get sunitsy() {
    return this.sunits[1];
  }
}

export default BackgroundImage;