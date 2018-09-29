class SlideshowCard extends Polymer.Element {

  constructor() {
    super();
    this.slideIndex = 1;
    this.attachShadow({ mode: 'open' });
  }

  ready() {
    super.ready();
    this._setInnerCardStyle();
    this._createNavigation();
    this.shadowRoot.firstChild.querySelector('.card').querySelector('.prev').addEventListener('click', this._prevSlide.bind(this));
    this.shadowRoot.firstChild.querySelector('.card').querySelector('.next').addEventListener('click',this._nextSlide.bind(this));
    this._styleCard();
    if (this.config.autoplay) {
      this.interval = setInterval(this._autoPlay.bind(this), (this.config.autodelay * 1000) || 5000);
      this.addEventListener('mouseover', this._stopSlide.bind(this));
      this.addEventListener('mouseout', this._startSlide.bind(this));
    }
    this._showSlides(this.slideIndex);
  }

  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.className = 'card';
      card.appendChild(this.content);
      this._cards.forEach(item => {
        item.hass = hass;
        item.className = 'slides fade';
      });
      this.card = card;
      this.shadowRoot.appendChild(card);
    }
    else {
      this._cards.forEach(item => {
        item.hass = hass;
      });
    }
  }

  setConfig(config) {
    this.config = config;

    if (!config || !config.cards || !Array.isArray(config.cards) || config.cards.length < 2) {
      throw new Error('Card Configuration is not set up properly!');
    }

    this._cards = config.cards.map((item) => {
        let element;

        if (item.type.startsWith("custom:")){
          element = document.createElement(`${item.type.substr("custom:".length)}`);
        }
        else {
          element = document.createElement(`hui-${item.type}-card`);
        }
        element.setConfig(item);
        if(this.hass)
          element.hass = this.hass;

        return element;
      });
    }

  _styleCard() {
    for(var k in this.config.style) {
      this.card.style.setProperty(k, this.config.style[k]);
    }

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      .card {
        position: relative;
        padding: ${this.config.flush ? '0' : '2'}em;
      }

      .slides {
          display: none;
      }

      /* Next & previous buttons */
      .prev, .next {
        cursor: pointer;
        position: absolute;
        top: 50%;
        width: auto;
        margin-top: -22px;
        opacity:  ${this.config.arrowopacity || '1'};
        color: ${this.config.arrowcolor || 'white'};
        font-weight: bold;
        font-size: 18px;
        transition: 0.6s ease;
        border-radius: 0 3px 3px 0;
        padding: 16px 10px
      }

      .next {
        right: 0;
        border-radius: 3px 0 0 3px;
      }

      .prev {
        left: 0;
      }

      .fade {
        -webkit-animation-name: fade;
        -webkit-animation-duration: 1s;
        animation-name: fade;
        animation-duration: 1s;
      }

      @-webkit-keyframes fade {
        from {opacity: .4}
        to {opacity: 1}
      }

      @keyframes fade {
        from {opacity: .4}
        to {opacity: 1}
      }
    `
    this.card.appendChild(style);
  }

  _setInnerCardStyle() {
    this._cards.forEach(item => {
      this.content.appendChild(item);

      let target = item;
      if(item.shadowRoot && item.shadowRoot.querySelector("ha-card")) {
        target = item.shadowRoot.querySelector("ha-card");
      } else if(item.querySelector("ha-card")) {
        target = item.querySelector("ha-card");
      } else if(item.firstChild && item.firstChild.shadowRoot && item.firstChild.shadowRoot.querySelector("ha-card")) {
        target = item.firstChild.shadowRoot.querySelector("ha-card");
      }

      if(item.config){
        for(var k in item.config.style) {
          target.style.setProperty(k, item.config.style[k]);
        }
      }
      else if(item._config) {
        for(var k in item._config.style) {
          target.style.setProperty(k, item._config.style[k]);
        }
      }

      target.style.setProperty('box-shadow', 'none');
    });

  }

  _createNavigation() {
    this.content.insertAdjacentHTML('beforeend',`<a class="prev">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="${this.config.arrowcolor || 'black'}" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
      </svg>
    </a>
    <a class="next">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="${this.config.arrowcolor || 'black'}" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
      </svg>
    </a>`);
  }

  _prevSlide() {
    clearInterval(this.interval);
    this._showSlides(this.slideIndex -= 1);
    if (this.config.autoplay)
      this.interval = setInterval(this._autoPlay.bind(this), (this.config.autodelay * 1000) || 5000);
  }

  _nextSlide() {
    clearInterval(this.interval);
    this._showSlides(this.slideIndex += 1);
    if (this.config.autoplay)
      this.interval = setInterval(this._autoPlay.bind(this), (this.config.autodelay * 1000) || 5000);
  }

  _showSlides(n) {
    var i;
    var slides = this.shadowRoot.firstChild.getElementsByClassName("slides");
    if (n > slides.length) {this.slideIndex = 1}
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[this.slideIndex-1].style.display = "block";
  }

  _autoPlay() {
    var i;
    var slides = this.shadowRoot.firstChild.getElementsByClassName("slides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    this.slideIndex++;
    if (this.slideIndex > slides.length) {this.slideIndex = 1}
    slides[this.slideIndex-1].style.display = "block";
    // setTimeout(this._autoPlay.bind(this), (this.config.autodelay * 1000) || 5000);
  }

  _stopSlide(){
    clearInterval(this.interval);
  }

  _startSlide() {
    clearInterval(this.interval);
    this.interval = setInterval(this._autoPlay.bind(this), (this.config.autodelay * 1000) || 5000);
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('slideshow-card', SlideshowCard);
