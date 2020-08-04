import { css, html, LitElement } from 'lit-element';
import ApiConsumer from './utils/api-consumer/src/ApiConsumer.js';

export class LitEdex extends LitElement {
  constructor() {
    super();
    this.apiHandler = new ApiConsumer();
    this.pokemonList = [];
    this.loading = true;
    this.error = false;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.totalAmountOfPokemon = await this.getPokemonCount();
    this.currentPage = this.getAttribute('current-page') || 1;
    this.pokemonPerPage = this.getAttribute('pokemon-per-page') || 20;
    this.pokemonList = await this.getPokemonList();
    this.loading = false;
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

      .container {
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
        this.error = true;
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
        this.error = true;
        return { count: 0 };
      });

    return count;
  }

  static renderLoading() {
    return html`
      <div class="">
        <p>Loading...</p>
        <img
          src="../assets/img/loading-mew.gif"
          alt="rolling pokeball"
          title="Loading..."
        />
      </div>
    `;
  }

  render() {
    return html`
      <header>
        <h1 class="container">LitEdex</h1>
      </header>
      <main>
        ${this.loading ? LitEdex.renderLoading() : 'Data has been loaded'}
      </main>
      <footer>
        <p class="container">
          Made with <span>love</span> by
          <a href="https://fcarrascosa.es">Fernando Carrascosa</a> | 2020-2021
        </p>
      </footer>
    `;
  }
}
