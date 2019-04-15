function Sprite(x, y, largura, altura) {
  this.x = x;
  this.y = y;
  this.largura = largura;
  this.altura = altura;
  this.desenha = function (imagem, xCanvas, yCanvas) {
    ctx.drawImage(imagem, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
  }
}

var bg = new Sprite(0, 0, 800, 600),
imgMosquito = new Sprite(0, 0, 50, 50),
play = new Sprite(0, 0, 256, 256);