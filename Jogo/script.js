const fs = require('fs')

let configuracoes = fs.readFileSync('./config.json')
configuracoes = JSON.parse(configuracoes)

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 590;
const CANVAS_HEIGHT = canvas.height = 590;


const {
    CRITERIO_VAR,
    CRITERIO_REP,
    corComponenteVAR,
    corComponenteREP,
    reforcosPorComponente,
    ITI
} = configuracoes

let listaSequenciasVAR = []
let listaSequenciasREP = []
let sequencia = []
let valorLinha = 0
let valorColuna = 0
let reforcosNoComponente = 0
let componenteAtual = 'REP'



function registroResposta(e) {
    if (e.key == 'l') {
        if(sequencia.filter(x=>x=='D').length <= 3) {
            sequencia.push('D')
            valorColuna++
            ctx.fillRect(valorColuna * 115 + 15, valorLinha * 115 + 15, 100, 100)
        }
    }
    if (e.key == 's') {
        if(sequencia.filter(x=>x=='E').length <= 3) {
            sequencia.push('E')
            valorLinha++
            ctx.fillRect(valorColuna * 115 + 15, valorLinha * 115 + 15, 100, 100)
        }
    }
    if (sequencia.length == 8) {
        registroSequencia()
    }
}

function registroSequencia() {
    let seqString = ''
    for (let seq = 0; seq < sequencia.length; seq++) {
        seqString += sequencia[seq]
    }
    confereCriterio(seqString)
}

function confereCriterio(seqAtual) {
    
    if (componenteAtual == 'VAR') {
        let repetiu = false
        for (let seq = 1; seq <= CRITERIO_VAR; seq++) {
            if (listaSequenciasVAR[listaSequenciasVAR.length - seq] == seqAtual) {
                repetiu = true
            }
        }
    
        listaSequenciasVAR.push(seqAtual)
        if (repetiu == true) {
            blackout()
        } else {
            reforcosNoComponente++
            controlaComponente()
            reforco()

        }
    } else if (componenteAtual == 'REP') {
        let repetiu = false
        for (let seq = 1; seq <= CRITERIO_REP; seq++) {
            if (listaSequenciasREP[listaSequenciasREP.length - seq] == seqAtual) {
                repetiu = true
            }
        }
        listaSequenciasREP.push(seqAtual)
        if (repetiu == false) {
            blackout()
        } else {
            reforcosNoComponente++
            controlaComponente()
            reforco()
        }
    }
}


function controlaComponente() {
    if (reforcosNoComponente == reforcosPorComponente) {
        if (componenteAtual == 'VAR') {
            componenteAtual = 'REP'
        } else if (componenteAtual == 'REP') {
            componenteAtual = 'VAR'
        }
        reforcosNoComponente = 0
    }
}

async function blackout() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let image = new Image()
    image.src = '../assets/BO.png'
    image.onload = function () {ctx.drawImage(image, 0, 0, 590, 590)}
    await new Promise(done => setTimeout(()=> done(), ITI*1000));
    renovaTela()
}

async function reforco() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    let image = new Image()
    image.src = '../assets/RF.png'
    image.onload = function () {ctx.drawImage(image, 0, 0, 590, 590)}
    await new Promise(done => setTimeout(()=> done(), ITI * 1000));
    renovaTela()
}

function renovaTela() {
    let corComponente
    if(componenteAtual == 'VAR') {
        corComponente = corComponenteVAR
    } else {
        corComponente = corComponenteREP
    }
    sequencia = []
    valorLinha = 0
    valorColuna = 0

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    for (let linha = 0; linha < 5; linha++) {
        for (let coluna = 0; coluna < 5; coluna++) {
            ctx.strokeStyle = corComponente
            ctx.strokeRect(coluna*115 + 15, linha*115 + 15, 100, 100)
        }
    }
    
    ctx.fillStyle = corComponente
    ctx.fillRect(15, 15, 100, 100)
}


renovaTela()

document.addEventListener('keypress', (e) => {registroResposta(e)})
