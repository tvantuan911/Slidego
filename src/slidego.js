function Slidego(selector, options = {}) {
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(`Slidego: Container "${selector}" not found`);
        return;
    }

    this.opt = Object.assign(
        {
            items: 1,
            loop: false,
        },
        options
    );
    this.slides = Array.from(this.container.children);
    this.currentIndex = this.opt.loop ? this.opt.items : 0;

    this._init();
    this._updatePosition();
}

Slidego.prototype._init = function () {
    this.container.classList.add("slidego-wrapper");
    this._createTrack();
    this._createNavigation();
};

Slidego.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.className = "slidego-track";

    const cloneHead = this.slides.slice(-this.opt.items).map((node) => node.cloneNode(true));
    const cloneTail = this.slides.slice(0, this.opt.items).map((node) => node.cloneNode(true));

    this.slides = cloneHead.concat(this.slides.concat(cloneTail));

    this.slides.forEach((slide) => {
        slide.classList.add("slidego-slide");
        slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
        this.track.appendChild(slide);
    });

    this.container.appendChild(this.track);
};

Slidego.prototype._createNavigation = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.textContent = "<";
    this.nextBtn.textContent = ">";

    this.prevBtn.className = "slidego-prev";
    this.nextBtn.className = "slidego-next";

    this.container.append(this.prevBtn, this.nextBtn);

    this.prevBtn.onclick = () => this.moveSlide(-1);
    this.nextBtn.onclick = () => this.moveSlide(1);
};

Slidego.prototype.moveSlide = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;

    if (this.opt.loop) {
        this.currentIndex =
            (this.currentIndex + step + this.slides.length) %
            this.slides.length;

        this.track.ontransitionend = () =>  {
            const maxIndex = this.slides.length - this.opt.items;
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.items;
            } else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.items;
            }
            this._updatePosition(true);
            this._isAnimating = false;
        }
    } else {
        this.currentIndex = Math.min(
            Math.max(this.currentIndex + step, 0),
            this.slides.length - this.opt.items
        );
    }
    console.log(this.currentIndex);
    this._updatePosition();
};

Slidego.prototype._updatePosition = function (instant = false) {
    this.track.style.transition = instant ? 'none' : 'transform ease 0.3s';
    this.offset = -(this.currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;
}


//  4 5 6 1 2 3 4 5 6 1 2 3 