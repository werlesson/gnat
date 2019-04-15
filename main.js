var canvas, ctx, ALTURA = 600, LARGURA = 800, frames = 0, velocidade = 3,  difficulty = 0.0175, estadoAtual,
record, img, img_mosquito, mosquito_entrou=5, score = 0, img_play,
estados = {
  jogar: 0,
  jogando: 1,
  perdeu: 2
},
mosquito = {
  _obs: [],
  tempoInsere: 0,
  insere() {
    this._obs.push({
      x: LARGURA,
      y: myRandom(50, 450),
      altura: imgMosquito.altura,
      largura: imgMosquito.largura
    });
    this.tempoInsere = myRandom(50, 80);
  },
  atualiza() {
    if(this.tempoInsere)
      this.tempoInsere--;
    else
      this.insere();

    for(var i = 0, tam = this._obs.length; i < tam; i++){
      var obs = this._obs[i];
      obs.x -= velocidade;

      if (mosquito_entrou == 5)
        estadoAtual = estados.perdeu;

      else if(obs.x <= 185) {
        this._obs.splice(i, 1);
        coracao[mosquito_entrou].vida = false;
        mosquito_entrou++;
        tam--;
        i--;
      }
    }
  },
  limpa() {
    this._obs=[];
  },
  desenha() {
    for(var i = 0, tam = this._obs.length; i < tam; i++){
      var obs = this._obs[i];
      imgMosquito.desenha(img_mosquito, obs.x,obs.y);
    }
  }
},
coracao = [
  {vida: true},
  {vida: true},
  {vida: true},
  {vida: true},
  {vida: true}
]

function clique(event) {
  if (estadoAtual == estados.jogando){
    var x = event.pageX - (window.innerWidth-LARGURA)/2,
        y = event.pageY - (window.innerHeight-ALTURA)/2;
    for(var i = 0; i < mosquito._obs.length; i++){
      var mosq = mosquito._obs[i];
      if(x >= mosq.x && x <= mosq.x + mosq.largura && y >= mosq.y && y <= mosq.y + mosq.largura){
          mosquito._obs.splice(i, 1);
          score++;
          break;
      }
    }
  }
  else if (estadoAtual == estados.jogar){
    estadoAtual = estados.jogando;
  }
  else if (estadoAtual == estados.perdeu){
    estadoAtual = estados.jogar;
    mosquito.limpa();
    if (score > record) {
      localStorage.setItem("record", score);
      record = score;
    }
  }
}

function main() {

  canvas = document.createElement("canvas");
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  // canvas.style.border = "1px solid black";

  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  document.addEventListener("mousedown", clique);

  estadoAtual = estados.jogar;
  record = localStorage.getItem("record");

  if (record == null)
    record = 0;

  img = new Image();
  img.src = "img/bg.jpg";
  img_mosquito = new Image();
  img_mosquito.src = "img/bloco.png";
  coracao_cheio = new Image();
  coracao_cheio.src = "img/coracao_cheio.png";
  coracao_vazio = new Image();
  coracao_vazio.src = "img/coracao_vazio.png";
  img_play = new Image();
  img_play.src = "img/play.png";

  roda();
}

function roda() {
  atualiza();
  desenha();
  window.requestAnimationFrame(roda);
}

function atualiza() {
  frames++;

  // INCREMENTO DA DIFICULDADE
  if(score%10==0 && score != 0)
    velocidade +=  difficulty;

  if (estadoAtual == estados.jogar)
    reset();

  if (estadoAtual == estados.jogando)
    mosquito.atualiza();
}

function desenha() {
  bg.desenha(img,0,0);

  ctx.fillStyle = "#fff";
  ctx.font = "50px Arial";
  ctx.fillText(score, 30, 68);

  for(var i = 0; i < coracao.length; i++){
    if (coracao[i].vida)
      ctx.drawImage(coracao_cheio, 0, 0, 30, 29, 35 * i, 550, 30, 29);
    else
      ctx.drawImage(coracao_vazio, 0, 0, 30, 29, 35 * i, 550, 30, 29);
  }

  if (estadoAtual == estados.jogar){
    play.desenha(img_play, LARGURA / 2 - 128, ALTURA / 2 - 128);
  }
  else if (estadoAtual == estados.perdeu){
    ctx.fillStyle = "red";
    ctx.fillRect(LARGURA / 2 - 50, ALTURA / 2 - 50, 100, 100);
    ctx.save();
    ctx.translate(LARGURA / 2, ALTURA / 2);
    ctx.fillStyle = "#fff";

    if (score > record)
      ctx.fillText("Novo Record!", -150, -65);
    else if (record < 10)
      ctx.fillText("Record " + record, -99, -65);
    else if(record >= 10 && record < 100)
      ctx.fillText("Record " + record, -115, -65);
    else if(record >= 100)
      ctx.fillText("Record " + record, -130, 19);

    if(score < 10)
      ctx.fillText(score, -13, 19);
    else if(score >= 10 && score < 100)
      ctx.fillText(score, -29, 19);
    else if(score >= 100)
      ctx.fillText(score, -43, 19);

    ctx.restore();

  }
  else if(estadoAtual == estados.jogando)
    mosquito.desenha();
}

function myRandom(min, max) {
  return min + Math.floor(Math.random() * (max-min));
}

function reset() {
  mosquito_entrou = 0;
  score = 0;
  for(var i = 0; i < coracao.length; i++)
    coracao[i].vida = true;
}

main();