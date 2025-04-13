function Slidego(selector, options = {}) {
    this.container = document.querySelector(selector);

    if (!this.container) {
        console.error(`Slidego: Container "${selector}" not found`);
        return;
    }

    this.opt = Object.assign({}, options);
    this.slides = Array.from(this.container.children);

    this._init();
}

Slidego.prototype._init = function () {
    this.container.classList.add("slidego-wrapper");
    this._createTrack();
    this._createNavigation();
};

Slidego.prototype._createTrack = function () {
    this.track = document.createElement("div");
    this.track.className = "slidego-track";

    this.slides.forEach((slide) => {
        slide.classList.add("slidego-slide");
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

Slidego.prototype.moveSlide() = function(step) {

}
