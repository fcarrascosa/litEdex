import { LitElement, html, css } from 'lit-element';
import ApiConsumer from '../../utils/api-consumer/src/ApiConsumer.js';

export default class PokemonCard extends LitElement {
  constructor() {
    super();
    this.loading = true;
  }

  static get is() {
    return 'pokemon-card';
  }

  static get properties() {
    return {
      name: { type: String, attribute: 'name' },
      url: { type: String, attribute: 'url' },
      pokemon: { type: Object },
      loading: { type: Boolean, reflect: true, attribute: 'loading' },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.loading = true;
    this.setPokemon().then(() => {
      this.loading = false;
    });
  }

  attributeChangedCallback(name, old, value) {
    super.attributeChangedCallback(name, old, value);
    this.loading = true;
    if (this.url) {
      this.setPokemon().then(() => {
        this.loading = false;
      });
    }
  }

  async setPokemon() {
    this.loading = true;
    this.pokemon = await ApiConsumer.unwrappedFetch(this.url);
    this.loading = false;
  }

  renderLoading() {
    return html`
      <section class="pokemon-front">
        <footer class="pokemon-footer">
          #Loading...
        </footer>
        <header class="pokemon-header">
          <h2 class="pokemon-header-title">
            ${this.name}
          </h2>
        </header>
        <div class="pokemon-body">
          <img
            src="./assets/img/pokeball.gif"
            alt="${this.name} loading image"
            title="${this.pokemon.name} loading image..."
            class="pokemon-body-sprite"
            loading="lazy"
          />
        </div>
      </section>
    `;
  }

  renderPokemon() {
    return html`
      <section class="pokemon-front ${this.pokemon.types[0].type.name}">
        <footer class="pokemon-footer">
          #${this.pokemon.order}
        </footer>
        <header class="pokemon-header">
          <h2 class="pokemon-header-title">
            ${this.pokemon.name}
          </h2>
        </header>
        <div class="pokemon-body">
          <img
            src="${this.pokemon.sprites.front_default ||
            './assets/img/pokeball.gif'}"
            alt="${this.pokemon.name}"
            title="${this.pokemon.name}"
            class="pokemon-body-sprite"
          />
        </div>
      </section>
      <section class="pokemon-back">
        <div class="pokemon-types">
          ${this.pokemon.types.map(
            ({ type }) => html`
              <span class="pokemon-types-label ${type.name}">
                ${type.name}
              </span>
            `
          )}
        </div>
        <div class="pokemon-cta">
          <button class="pokemon-cta-link">
            More info
          </button>
        </div>
      </section>
    `;
  }

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
        display: block;
        text-align: center;
        width: 100%;
      }

      .pokemon {
        border-radius: calc(15px / 2);
        box-shadow: 1px 1px 10px 0px #000;
        transition: all 1s ease-in-out;
        transform-style: preserve-3d;
        position: relative;
      }

      :host(:hover) .pokemon {
        transform: rotateY(180deg);
      }

      .pokemon-front {
        background: #1d3557;
      }

      .pokemon .pokemon-front,
      .pokemon .pokemon-back {
        backface-visibility: hidden;
        border: solid 1px black;
        border-radius: calc(15px / 2);
      }

      .pokemon .pokemon-front .pokemon-footer {
        padding: 15px;
        margin: auto;
        width: 50%;
        border-bottom: solid 1px;
      }

      .pokemon .pokemon-front .pokemon-header .pokemon-header-title {
        text-transform: uppercase;
        margin: 0;
        font-weight: 300;
        font-size: 1.5rem;
      }

      .pokemon .pokemon-front .pokemon-body .pokemon-body-sprite {
        max-width: 96px;
      }

      .pokemon .pokemon-back {
        background: #1d3557;
        color: #fff;
        height: 100%;
        position: absolute;
        top: 0;
        transform: rotateY(180deg);
        width: 100%;
      }

      .pokemon .pokemon-back {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .pokemon .pokemon-back .pokemon-types .pokemon-types-label,
      .pokemon .pokemon-back .pokemon-cta .pokemon-cta-link {
        display: inline-block;
        border-radius: 3px;
        padding: 3px 6px;
        margin: auto;
      }

      .pokemon .pokemon-back .pokemon-cta {
        margin-top: 10px;
      }

      .pokemon .pokemon-back .pokemon-cta .pokemon-cta-link {
        appearance: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        color: #fff;
        background: orange;
      }

      .normal {
        background: #a8a77a;
      }
      .fire {
        background: #ee8130;
      }
      .water {
        background: #6390f0;
      }
      .electric {
        background: #f7d02c;
      }
      .grass {
        background: #7ac74c;
      }
      .ice {
        background: #96d9d6;
      }
      .fighting {
        background: #c22e28;
      }
      .poison {
        background: #a33ea1;
      }
      .ground {
        background: #e2bf65;
      }
      .flying {
        background: #a98ff3;
      }
      .psychic {
        background: #f95587;
      }
      .bug {
        background: #a6b91a;
      }
      .rock {
        background: #b6a136;
      }
      .ghost {
        background: #735797;
      }
      .dragon {
        background: #6f35fc;
      }
      .dark {
        background: #705746;
      }
      .steel {
        background: #b7b7ce;
      }
      .fairy {
        background: #d685ad;
      }
    `;
  }

  render() {
    return html`
      <div class="pokemon">
        ${this.loading ? this.renderLoading() : this.renderPokemon()}
      </div>
    `;
  }
}
