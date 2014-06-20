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
}

export default BackgroundImage;