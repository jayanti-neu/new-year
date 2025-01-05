const menuItems = [
	{ href: "/", text: "Home" },
	{ href: "about", text: "About" },
	{ href: "photos", text: "Photo Gallery" },
	{ href: "guestbook", text: "Guestbook" },
	{ href: "registry", text: "Registry" }
];

const menuHTML = menuItems.map(item => `<li><a href="${item.href}">${item.text}</a></li>`).join('');

class HamburgerMenu extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.shadowRoot.innerHTML = `
			<link rel="stylesheet" href="/stylesheets/menu.css">
			<div class="hamburger-menu">
				<input type="checkbox" id="menu-toggle">
				<label for="menu-toggle" class="menu-icon">&#9776;</label>
				<nav class="menu">
					<ul>
						${menuHTML}
					</ul>
				</nav>
			</div>
		`;
	}
}

customElements.define('hamburger-menu', HamburgerMenu);