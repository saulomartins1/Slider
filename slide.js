import debounce from "./debounce.js";

export class Slide {
    constructor(wrapper, slide) {
        this.wrapper = document.querySelector(wrapper);
        this.slide = document.querySelector(slide);
        this.dist = { finalPosition: 0, startX: 0, movement: 0 }
        this.activeClass = "active"

    }

    transition(active) {
        this.slide.style.transition = active ? ".3s ease" : '';
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
        this.transition(false);
    }

    onEnd(e) {
        const moveType = (e.type === 'mouseup' ? 'mousemove' : 'touchmove')
        this.wrapper.removeEventListener(moveType, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.changeSlideOnEnd();
        this.transition(true);
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNextSlide();
        } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePrevSlide();
        } else {
            this.changeSlide(this.index.active)
        }
        console.log(this.dist.movement)
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
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slidesIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
        this.changeActiveClass();
    }

    changeActiveClass() {
        this.slideArray.forEach((card) => card.el.classList.remove(this.activeClass))
        this.slideArray[this.index.active].el.classList.add(this.activeClass)

    }

    activePrevSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev)
        }
    }
    activeNextSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next)
        }
    }

    onResize() {
        setTimeout(() => {
            this.slideCardsConfig();
            this.changeSlide(this.index.active);
        }, 300)
    }

    addResizeEvent() {
        window.addEventListener('resize', this.onResize)
    }


    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onResize = debounce(this.onResize.bind(this), 200);

        this.activePrevSlide = this.activePrevSlide.bind(this);
        this.activeNextSlide = this.activeNextSlide.bind(this);
    }

    init() {
        this.bindEvents();
        this.addSlideEvents();
        this.slideCardsConfig();
        this.addResizeEvent();
        this.changeSlide(0);
        return this;
    }
}

export class SlideNav extends Slide {
    addArrow(prev, next) {
        this.prevElement = document.querySelector(prev);
        this.nextElement = document.querySelector(next);
        this.addArrowEvent();
    }

    addArrowEvent() {
        this.prevElement.addEventListener("click", this.activePrevSlide);
        this.nextElement.addEventListener("click", this.activeNextSlide);
    }
}