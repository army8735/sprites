class BackgroundImage {
  constructor(params) {
    this.params = params;
  }

  get url() {
    return this.params.url;
  }
  get repeatx() {
    return this.params.repeat[0];
  }
  get repeaty() {
    return this.params.repeat[1];
  }
  get positionx() {
    return this.params.pos[0];
  }
  get positiony() {
    return this.params.pos[1];
  }
  get unitsx() {
    return this.params.units[0];
  }
  get unitsy() {
    return this.params.units[1];
  }
}

export default BackgroundImage;