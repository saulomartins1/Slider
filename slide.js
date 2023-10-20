export default class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
    }

    onStart() {
        console.log("mouse down")
        //#2 - ao iniciado onStart: permite o onMove() ao evento de "mousemove"
        this.wrapper.addEventListener("mousemove", this.onMove);
    }

    onEnd() {
        console.log("mouse up")
        //#4 (fim) - ao eventListener captar o "mouseup" que veio do onMove(), então remove o "mousemove" e finaliza a funcionalidade básica do slide.
        this.wrapper.removeEventListener("mousemove", this.onMove);
    }
    onMove() {
        console.log("mouse move")
        //#3 - ao iniciado onMove: deixa preparado (trigger) o evento de "mouseup" para ativar a função onEnd() quando mouseup
        this.wrapper.addEventListener("mouseup", this.onEnd);
    }



    addSlideEvents() {
        //#1 - Inicia o onStart() ao evento de "mousedown" (no elemento wrapper)
        this.wrapper.addEventListener("mousedown", this.onStart);
    }




    //bind: Nos events (onStart) - "this" fazer referência sempre ao objeto em si (Class Slide);
    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}
