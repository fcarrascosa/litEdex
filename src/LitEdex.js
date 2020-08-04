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
    this.totalAmountOfPokemon = await this.getPokemonCount();
    this.currentPage = this.getAttribute('current-page') || 1;
    this.pokemonPerPage = this.getAttribute('pokemon-per-page') || 20;
    this.pokemonList = await this.getPokemonList();
  }

  static get properties() {
    return {
      apiHandler: { type: Function },
      pokemonList: { type: Array },
      currentPage: { type: Number },
      pokemonPerPage: { type: Number },
      totalAmountOfPokemon: { type: Number },
    };
  }

  static get is() {
    return 'lit-edex';
  }

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        display: block;
        text-align: center;
        width: 100%;
      }

      main {
        margin: auto;
        max-width: 960px;
        width: 100%;
      }
    `;
  }

  async getPokemonList(pokemonPerPage, currentPage) {
    const queryOptions = {
      limit: pokemonPerPage || this.pokemonPerPage,
      offset: currentPage || this.currentPage * this.pokemonPerPage,
    };

    const { results } = await this.apiHandler
      .getPokemonList(queryOptions)
      .catch(error => {
        console.error(error);
        return { results: [] };
      });

    return results;
  }

  async getPokemonCount() {
    const queryOptions = {
      limit: 1,
      offset: 0,
    };

    const { count } = await this.apiHandler
      .getPokemonList(queryOptions)
      .catch(error => {
        console.error(error);
        return { count: 0 };
      });

    return count;
  }

  render() {
    return html`
      <main>
        <h1>LitEdex</h1>
      </main>
    `;
  }
}
