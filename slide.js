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
        let moveType;

        if (e.type === "mousedown") {
            e.preventDefault()
            this.dist.startX = e.clientX;
            moveType = "mousemove"
        } else {
            this.dist.startX = e.changedTouches[0].clientX;
            moveType = "touchmove"
        }
        this.wrapper.addEventListener(moveType, this.onMove);
    }

    onEnd(e) {
        const moveType = (e.type === 'mouseup' ? 'mousemove' : 'touchmove')
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
    }
    onMove(e) {
        const pointerPosition = (e.type === 'mousemove' ? e.clientX : e.changedTouches[0].clientX)
        const finalPosition = this.updatePosition(pointerPosition)
        this.wrapper.addEventListener("mouseup", this.onEnd);
        this.moveSlide(finalPosition)
    }


    addSlideEvents() {
        this.wrapper.addEventListener("touchstart", this.onStart);
        this.wrapper.addEventListener("mousedown", this.onStart);
        this.wrapper.addEventListener("moseup", this.onEnd);
        this.wrapper.addEventListener("touchend", this.onEnd);
    }



    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }


    //SLIDE CONFIG
    slidePosition(slide) {
        const margem = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margem);
    }

    slideCardsConfig() {
        this.slideArray = [...this.slide.children].map((el) => {
            const position = this.slidePosition(el)
            return {
                el,
                position
            }
        })
    }

    slidesIndexNav(index) {
        const lastCard = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === lastCard ? undefined : index + 1,
        }
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index].position;
        this.moveSlide(this.slideArray[index].position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideCardsConfig();
        return this;
    }
}
