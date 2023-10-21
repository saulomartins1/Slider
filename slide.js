export default class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }

    }

    moveSlide(distX) {
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
        this.dist.movePosition = distX;
    }

    updatePosition(clientX) {
        this.dist.movement = (this.dist.startX - clientX) * 1.3;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(e) {
        e.preventDefault()
        this.dist.startX = e.clientX;
        this.wrapper.addEventListener("mousemove", this.onMove);
    }

    onEnd() {
        this.wrapper.removeEventListener("mousemove", this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }
    onMove(e) {
        this.wrapper.addEventListener("mouseup", this.onEnd);
        const finalPosition = this.updatePosition(e.clientX)
        this.moveSlide(finalPosition)
    }


    addSlideEvents() {
        this.wrapper.addEventListener("mousedown", this.onStart);
    }



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
