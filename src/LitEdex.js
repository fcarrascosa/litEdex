import { css, html, LitElement } from 'lit-element';
import ApiConsumer from './utils/api-consumer/src/ApiConsumer.js';

export class LitEdex extends LitElement {
  constructor() {
    super();
    this.apiHandler = new ApiConsumer();
    this.pokemonList = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    this.pokemonList = await this.getPokemonList();
  }

  static get properties() {
    return {
      apiHandler: { type: Function },
      pokemonList: { type: Array },
    };
  }

  static get is() {
    return 'lit-edex';
  }

  static get styles() {
    return css``;
  }

  async getPokemonList() {
    const { results } = await this.apiHandler.getPokemonList().catch(error => {
      console.error(error);
      return { results: [] };
    });

    return results.map((pokemon, i) => ({ ...pokemon, id: i + 1 }));
  }

  render() {
    return html`
      <main>
        <h1>LitEdex</h1>
      </main>
    `;
  }
}
