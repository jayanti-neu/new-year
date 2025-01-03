class PageTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="style.css">
             <div class="bg">
                <hamburger-menu></hamburger-menu>
                <h2 class="title"><slot name="title">We're Engaged!!!</slot></h2>
                <div class="content">
                    <div class="left">
                        <slot name="left-content">
                        <h3>Save the date</h3>
                      <h3>To Be Announced</h3>
                      <h3>TBD</h3></slot>
                    </div>
                    <div class="center">
                        <slot name="center-content"></slot>
                    </div>
                    <div class="right">
                        <slot name="right-content"><h3>Time TBD</h3>
              <h3>Location TBD</h3></slot>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('page-template', PageTemplate);