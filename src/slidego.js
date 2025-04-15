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
            speed: 300,
            nav: true,
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

    this._createContent();

    this._createTrack();
    this._createControls();

    if (this.opt.nav) {
        this._createNav();
    }
};

Slidego.prototype._createContent = function () {
    this.content = document.createElement("div");
    this.content.className = "slidego-content";
    this.container.appendChild(this.content);
};

Slidego.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.className = "slidego-track";

    if (this.opt.loop) {
        const cloneHead = this.slides
            .slice(-this.opt.items)
            .map((node) => node.cloneNode(true));
        const cloneTail = this.slides
            .slice(0, this.opt.items)
            .map((node) => node.cloneNode(true));
        this.slides = cloneHead.concat(this.slides.concat(cloneTail));
    }

    this.slides.forEach((slide) => {
        slide.classList.add("slidego-slide");
        slide.style.flexBasis = `calc(100% / ${this.opt.items})`;
        this.track.appendChild(slide);
    });

    this.content.appendChild(this.track);
};

Slidego.prototype._createControls = function () {
    this.prevBtn = document.createElement("button");
    this.nextBtn = document.createElement("button");

    this.prevBtn.textContent = "<";
    this.nextBtn.textContent = ">";

    this.prevBtn.className = "slidego-prev";
    this.nextBtn.className = "slidego-next";

    this.content.append(this.prevBtn, this.nextBtn);

    this.prevBtn.onclick = () => this.moveSlide(-1);
    this.nextBtn.onclick = () => this.moveSlide(1);
};

Slidego.prototype._createNav = function () {
    this.navWrapper = document.createElement("div");
    this.navWrapper.className = "slidego-nav";

    const slideCount =
        this.slides.length - (this.opt.loop ? this.opt.items * 2 : 0);
    const pageCount = Math.ceil(slideCount / this.opt.items);

    for (let i = 0; i < pageCount; i++) {
        const dot = document.createElement("button");
        dot.className = "slidego-dot";

        if (i === 0) {
            dot.classList.add("active");
        }

        dot.onclick = () => {
            this.currentIndex = this.opt.loop
                ? i * this.opt.items + this.opt.items
                : i * this.opt.items;
            this._updatePosition();
        };

        this.navWrapper.appendChild(dot);
    }

    this.container.append(this.navWrapper);
};

Slidego.prototype.moveSlide = function (step) {
    if (this._isAnimating) return;
    this._isAnimating = true;

    this.currentIndex = Math.min(
        Math.max(this.currentIndex + step, 0),
        this.slides.length - this.opt.items
    );

    setTimeout(() => {
        if (this.opt.loop) {
            const maxIndex = this.slides.length - this.opt.items;
            if (this.currentIndex <= 0) {
                this.currentIndex = maxIndex - this.opt.items;
                this._updatePosition(true);
            } else if (this.currentIndex >= maxIndex) {
                this.currentIndex = this.opt.items;
                this._updatePosition(true);
            }
        }
        this._isAnimating = false;
    }, this.opt.speed);
    console.log(this.currentIndex);
    this._updatePosition();
};

Slidego.prototype._updateNav = function () {
    let realIndex = this.currentIndex;

    if (this.opt.loop) {
        const slideCount = this.slides.length - this.opt.items * 2;
        realIndex =
            (this.currentIndex - this.opt.items + slideCount) % slideCount;
    }

    const pageIndex = Math.floor(realIndex / this.opt.items);

    const dots = Array.from(this.navWrapper.children);

    dots.forEach((dot, index) => {
        dots.classList.toggle("active", index === pageIndex);
    });
};

Slidego.prototype._updatePosition = function (instant = false) {
    this.track.style.transition = instant
        ? "none"
        : `transform ease ${this.opt.speed}ms`;
    this.offset = -(this.currentIndex * (100 / this.opt.items));
    this.track.style.transform = `translateX(${this.offset}%)`;

    if (this.opt.nav && !instant) {
        this._updateNav();
    }
};

//  4 5 6 1 2 3 4 5 6 1 2 3
