class PageTemplate extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.bgClass = 'default';
    }

    static get observedAttributes() {
        return ['bg-class'];
    }
    async connectedCallback() {
        try {
            const response = await fetch('/api/details');
            const details = await response.json();
            const formatDate = (dateString) => {
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return new Date(dateString).toLocaleDateString('en-US', options).replace(/\//g, '.');
            };
            const formatTime = (dateString) => {
                const options = { hour: '2-digit', minute: '2-digit', hour12: true };
                return new Date(dateString).toLocaleTimeString('en-US', options);
            };
            const addOneAndHalfHours = (dateString) => {
                const date = new Date(dateString);
                date.setHours(date.getHours() + 1);
                date.setMinutes(date.getMinutes() + 30);
                return date;
            };
            const getDayOfWeek = (dateString) => {
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                return days[new Date(dateString).getDay()];
            };
            this.details = details;
            details.date = new Date(details.date._seconds * 1000 + details.date._nanoseconds / 1000000);
            this.dayOfWeek = getDayOfWeek(details.date);
            this.date = formatDate(details.date);
            this.startTime = formatTime(details.date);
            this.endDate = addOneAndHalfHours(details.date);
            this.endTime = formatTime(this.endDate);       
        } catch (error) {
            this.details = {
                heading: "We're Engaged!!!",
                message: 'To Be Announced',
                date: 'To Be Announced',
                location: 'To Be Announced'
            }
            this.date = 'Date TBD';
            this.startTime = 'Start Time TBD';
            this.endTime = 'End Time TBD';
        }
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="./stylesheets/style.css">
            <div class="${this.bgClass} bg">
                <hamburger-menu></hamburger-menu>
                <h2 class="title"><slot name="title">${this.details.heading}</slot></h2>
                <div class="content">
                    <div class="left">
                        <slot name="left-content">
                        <h3>${this.details.message}</h3>
                        <h3>${this.date}</h3>
                        <h3>${this.dayOfWeek}</h3></slot>
                    </div>
                    <div class="center">
                        <slot name="center-content"></slot>
                    </div>
                    <div class="right">
                        <slot name="right-content"><h3>${this.startTime} - ${this.endTime}</h3>
                        <h3>${this.details.location}</h3></slot>
                    </div>
                </div>
            </div>
        `;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'bg-class') {
            this.bgClass = newValue || 'default';
        }
    }
}

customElements.define('page-template', PageTemplate);