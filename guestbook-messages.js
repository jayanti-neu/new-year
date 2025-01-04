class GuestbookMessages extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="style.css">
        <h2>Messages</h2>
        <div id="messages"></div>
      `;
        this.displayMessages();
    }

    displayMessages() {
        const messagesDiv = this.shadowRoot.getElementById('messages');
        const messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];
        messagesDiv.innerHTML = '';
        messages.forEach((msg) => {
            const newMessage = document.createElement('div');
            newMessage.textContent = `${msg.name}: ${msg.message}`;
            messagesDiv.appendChild(newMessage);
        });
    }
}

customElements.define('guestbook-messages', GuestbookMessages);