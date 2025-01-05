class GuestbookForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="style.css">
        <form id="guestbook-form">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required />
          <br />
          <label for="message">Message:</label>
          <textarea id="message" name="message" required></textarea>
          <br />
          <button type="submit" class="button">
            <h4>Submit</h4>
          </button>
        </form>
      `;

        const form = this.shadowRoot.getElementById('guestbook-form');
        form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    handleSubmit(event) {
        event.preventDefault();
        const name = this.shadowRoot.getElementById('name').value;
        const message = this.shadowRoot.getElementById('message').value;

        const messages = JSON.parse(localStorage.getItem('guestbookMessages')) || [];
        messages.push({ name, message });
        localStorage.setItem('guestbookMessages', JSON.stringify(messages));

        document.querySelector('guestbook-messages').displayMessages();
        this.shadowRoot.getElementById('guestbook-form').reset();
    }
}

customElements.define('guestbook-form', GuestbookForm);