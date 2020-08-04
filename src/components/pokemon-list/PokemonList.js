import { LitElement, html, css } from 'lit-element';

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
      pokemonToShow: {
        type: Array,
        attribute: false,
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
      this.currentPage = this.currentPage || 1;
      this.pokemonPerPage = this.pokemonPerPage || 10;
      this.numberOfPages = Math.ceil(
        this.pokemonList.length / this.pokemonPerPage
      );
    }
    this.pokemonToShow = this.getPokemonToShow();
  }

  static renderPokemon(pokemon) {
    return html`<p>${pokemon.name}<br />${pokemon.url}</p>`;
  }

  getPokemonToShow() {
    let result = this.pokemonList;

    if (this.pagination) {
      const pokemonToShowLimits = {
        max: this.pokemonPerPage * (this.currentPage - 1) + this.pokemonPerPage,
        min: this.pokemonPerPage * (this.currentPage - 1),
      };

      result = this.pokemonList.slice(
        pokemonToShowLimits.min,
        pokemonToShowLimits.max
      );
    }

    return result;
  }

  goToPage(page) {
    this.dispatchEvent(
      new CustomEvent('pokemon-list-go-to-page', {
        composed: true,
        bubbles: true,
        detail: {
          oldPage: this.currentPage,
          newPage: page,
        },
      })
    );
    this.currentPage = page;
    this.pokemonToShow = this.getPokemonToShow();
  }

  renderPaginationItems() {
    let paginationItems = '';
    for (let i = 0; i < this.numberOfPages; i += 1) {
      const page = i + 1;
      paginationItems = html`
        ${paginationItems}
        <button
          data-page="${page}"
          class="navigation-link ${this.currentPage === page ? 'active' : null}"
          @click="${() => {
            this.goToPage(page);
          }}"
        >
          ${page}
        </button>
      `;
    }
    return paginationItems;
  }

  renderPagination() {
    return html`
      <nav class="navigation">
        ${this.currentPage === 1
          ? null
          : html`<button
              data-page="${this.currentPage - 1}"
              class="navigation-link previous-link"
              @click="${() => {
                this.goToPage(this.currentPage - 1);
              }}"
            >
              Previous
            </button>`}
        ${this.renderPaginationItems()}
        ${this.currentPage === this.numberOfPages
          ? null
          : html`<button
              data-page="${this.currentPage + 1}"
              class="navigation-link next-link"
              @click="${() => {
                this.goToPage(this.currentPage + 1);
              }}"
            >
              Next
            </button>`}
      </nav>
    `;
  }

  renderPokemonToShow() {
    return this.pokemonToShow.map(pokemon =>
      PokemonList.renderPokemon(pokemon)
    );
  }

  static get styles() {
    return css`
      .navigation {
      }

      .navigation .navigation-link {
        appearance: none;
        background: #e6e6e6;
        border: solid 1px #7f7f7f;
        border-radius: 3px;
        cursor: pointer;
        outline: none;
        transition: all 0.3s ease-in-out;
      }

      .navigation .navigation-link:hover {
        background: #555;
        color: #fff;
      }
    `;
  }

  render() {
    return this.pokemonList
      ? html`
          ${this.renderPokemonToShow()}
          ${this.pagination ? this.renderPagination() : null}
        `
      : html`
          <p class="empty-message">
            Hey, m8, there are no Pokémon to show
          </p>
        `;
  }
}
