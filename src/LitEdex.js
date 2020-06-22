import { LitElement, html, css } from 'lit-element';

export class LitEdex extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      page: { type: String },
    };
  }

  static get is() {
    return 'lit-edex';
  }

  static get styles() {
    return css``;
  }

  render() {
    return html`
      <main>
        <h1>LitEdex</h1>
      </main>
    `;
  }
}
