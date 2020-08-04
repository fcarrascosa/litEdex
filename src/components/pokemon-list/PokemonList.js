import { LitElement, html } from 'lit-element';

export default class PokemonList extends LitElement {
  static get is() {
    return 'pokemon-list';
  }

  static get properties() {
    return {
      currentPage: {
        type: Number,
        attribute: 'current-page',
        reflect: 'true',
      },
      pagination: {
        type: Boolean,
        reflect: true,
      },
      numberOfPages: { type: Number, attribute: false },
      pokemonList: { type: Array, attribute: false },
      pokemonPerPage: {
        type: Number,
        attribute: 'pokemon-per-page',
        reflect: true,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.pagination && this.pokemonList) {
      this.pokemonPerPage = this.pokemonPerPage || 10;
      this.numberOfPages = Math.ceil(
        this.pokemonList.length / this.pokemonPerPage
      );
    }
  }

  static renderPokemon(pokemon) {
    return html`<p>${pokemon.name}<br />${pokemon.url}</p>`;
  }

  renderPagination() {
    return html`
      ${this.currentPage === 1
        ? null
        : html`<a href="#" class="navigation-link">Previous</a>`}
      ${this.renderPaginationItems()}
      ${this.currentPage === this.numberOfPages
        ? null
        : html`<a href="#" class="navigation-link">Next</a>`}
    `;
  }

  renderPaginationItems() {
    let paginationItems = '';
    for (let i = 0; i < this.numberOfPages; i += 1) {
      const page = i + 1;
      paginationItems = html` ${paginationItems}
        <a
          href="#"
          data-page="${page}"
          class="navigation-link ${this.currentPage === page ? 'active' : null}"
          >${page}</a
        >`;
    }
    return paginationItems;
  }

  render() {
    return this.pokemonList
      ? html`
          ${this.pokemonList.map(pokemon => PokemonList.renderPokemon(pokemon))}
          ${this.pagination ? this.renderPagination() : null}
        `
      : html`
          <p class="empty-message">
            Hey, m8, there are no Pokémon to show
          </p>
        `;
  }
}
