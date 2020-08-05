import { LitElement, html, css } from 'lit-element';
import '../pokemon-card/pokemon-card.js';

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
    return html`<pokemon-card
      name="${pokemon.name}"
      url="${pokemon.url}"
      class="pokemon-list-item"
    ></pokemon-card>`;
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
      :host {
        box-sizing: border-box;
        display: block;
        text-align: center;
        width: 100%;
      }

      .pokemon-list {
        display: flex;
        flex-wrap: wrap;
      }

      .pokemon-list .pokemon-list-item {
        width: calc(100% / 5 - 2rem - 2rem / 5);
        margin: 1rem 1.5rem;
      }

      .pokemon-list .pokemon-list-item:first-child,
      .pokemon-list .pokemon-list-item:nth-child(5n + 1) {
        margin-left: 0;
      }

      .pokemon-list .pokemon-list-item:last-child,
      .pokemon-list .pokemon-list-item:nth-child(5n) {
        margin-right: 0;
      }

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

      @media (max-width: 768px) {
        .pokemon-list .pokemon-list-item {
          width: calc(100% / 3 - 2rem);
        }

        .pokemon-list .pokemon-list-item:first-child,
        .pokemon-list .pokemon-list-item:nth-child(3n + 1) {
          margin-left: 0 !important;
        }

        .pokemon-list .pokemon-list-item:last-child,
        .pokemon-list .pokemon-list-item:nth-child(3n) {
          margin-right: 0 !important;
        }

        .pokemon-list .pokemon-list-item:nth-child(5n + 1) {
          margin-left: 1.5rem;
        }

        .pokemon-list .pokemon-list-item:nth-child(5n) {
          margin-right: 1.5rem;
        }
      }

      @media (max-width: 375px) {
        .pokemon-list .pokemon-list-item {
          width: 100%;
          margin: 0 0 15px;
        }

        .pokemon-list .pokemon-list-item:first-child,
        .pokemon-list .pokemon-list-item:nth-child(3n + 1),
        .pokemon-list .pokemon-list-item:last-child,
        .pokemon-list .pokemon-list-item:nth-child(5n + 1),
        .pokemon-list .pokemon-list-item:nth-child(5n) {
          margin-left: 0;
          margin-right: 0;
        }
      }
    `;
  }

  render() {
    return this.pokemonList
      ? html`
          <div class="pokemon-list">
            ${this.renderPokemonToShow()}
          </div>
          ${this.pagination ? this.renderPagination() : null}
        `
      : html`
          <p class="empty-message">
            Hey, m8, there are no Pokémon to show
          </p>
        `;
  }
}
