import { expect, fixture, html } from '@open-wc/testing';
import pokeApiMocks from '../../../../test/mocks/pokeapi.mock.js';
import '../pokemon-list.js';
import PokemonList from '../PokemonList.js';

describe('pokemon-list component', () => {
  let el;
  let sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    el = await fixture(html`<pokemon-list></pokemon-list>`);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be instantiated properly', () => {
    expect(el.constructor.is).to.equal('pokemon-list');
  });

  describe('when no pokemonList is not passed or empty', () => {
    beforeEach(async () => {
      el = await fixture(html`<pokemon-list></pokemon-list>`);
    });

    it('should display an empty list message', () => {
      expect(el.shadowRoot.querySelector('p.empty-message').innerText).to.equal(
        'Hey, m8, there are no Pokémon to show'
      );
    });
  });

  describe('when pokemonList is passed', () => {
    beforeEach(async () => {
      el = await fixture(
        html`<pokemon-list
          .pokemonList="${pokeApiMocks['/pokemon'].results}"
        ></pokemon-list>`
      );
    });

    describe('default behavior', () => {
      beforeEach(() => {
        sandbox.spy(PokemonList, 'renderPokemon');
      });

      it('should call renderPokemon method', async () => {
        await el.render();
        expect(PokemonList.renderPokemon).to.have.been.calledOnce;
      });

      describe('pagination is not set', () => {
        beforeEach(() => {
          sandbox.spy(el, 'renderPagination');
        });

        it('should not call renderPagination method', async () => {
          await el.render();
          expect(el.renderPagination).to.not.have.been.calledOnce;
        });

        it('should not set the pagination boolean', () => {
          expect(el.pagination).to.be.undefined;
        });
        it('should not set the numberOfPages object', () => {
          expect(el.numberOfPages).to.be.undefined;
        });
        it('should not set the pokemonPerPage object', () => {
          expect(el.pokemonPerPage).to.be.undefined;
        });
      });
    });

    describe('and pagination is set', () => {
      beforeEach(async () => {
        el = await fixture(
          html`<pokemon-list
            .pokemonList="${pokeApiMocks['/pokemon'].results}"
            pagination
          ></pokemon-list>`
        );
        sandbox.spy(el, 'renderPagination');
        sandbox.spy(el, 'renderPaginationItems');
      });

      it('should call renderPagination method', async () => {
        await el.render();
        expect(el.renderPagination).to.have.been.calledOnce;
      });

      it('should call renderPaginationItems (1 item) method as many times as numberOfpages(1)', async () => {
        await el.render();
        expect(el.renderPaginationItems.getCalls().length).to.equal(
          el.numberOfPages
        );
      });

      it('should set pokemonPerPage by default to 10', async () => {
        expect(el.pokemonPerPage).to.equal(10);
      });

      it('should set numberOfPages to 1 for an object with 1 element', () => {
        expect(el.numberOfPages).to.equal(1);
      });

      it('should set the appropriate number of pages (2) for an object with multiple elements (20)', async () => {
        const numberOfElements = 20;
        const pokemonList = [];
        while (pokemonList.length !== numberOfElements) {
          pokemonList.push(...pokeApiMocks['/pokemon'].results);
        }
        el = await fixture(
          html`<pokemon-list
            .pokemonList="${pokemonList}"
            pagination
          ></pokemon-list>`
        );

        expect(el.numberOfPages).to.equal(2);
      });

      it('should call renderPaginationItems (20 items) method as many times as numberOfPages (2)', async () => {
        const numberOfElements = 20;
        const pokemonList = [];
        while (pokemonList.length !== numberOfElements) {
          pokemonList.push(...pokeApiMocks['/pokemon'].results);
        }
        await el.render();
        expect(el.renderPaginationItems.getCalls().length).to.equal(
          el.numberOfPages
        );
      });

      describe('pagination behavior', () => {
        beforeEach(async () => {
          const numberOfElements = 40;
          const pokemonList = [];
          while (pokemonList.length !== numberOfElements) {
            pokemonList.push(...pokeApiMocks['/pokemon'].results);
          }
          el = await fixture(
            html`<pokemon-list
              .pokemonList="${pokemonList}"
              pagination
            ></pokemon-list>`
          );
          sandbox.spy(el, 'goToPage');
        });

        it('should not display a previous-link when in first-page', () => {
          expect(el.shadowRoot.querySelector('.previous-link')).to.be.null;
        });

        it('should not display a next-link when in last-page', async () => {
          el.currentPage = el.numberOfPages;
          await el.render();
          expect(el.shadowRoot.querySelector('.next-link')).to.be.null;
        });

        it('should call goToPage method when click on .next-link', () => {
          el.shadowRoot.querySelector('.next-link').click();
          expect(el.goToPage).to.have.been.calledOnce;
          expect(el.goToPage).to.have.been.calledWith(2);
        });

        it('should call goToPage method when click on .next-link', () => {
          el.shadowRoot.querySelector('.next-link').click();
          expect(el.goToPage).to.have.been.calledOnce;
          expect(el.goToPage).to.have.been.calledWith(2);
        });

        it('should call goToPage method when click on .previous-link', async () => {
          el.currentPage = 2;
          await el.render();
          el.shadowRoot.querySelector('.previous-link').click();
          expect(el.goToPage).to.have.been.calledOnce;
          expect(el.goToPage).to.have.been.calledWith(1);
        });

        it('should call goToPage method when click on .navigation-link not .previous-link or next-link', () => {
          el.shadowRoot
            .querySelector(
              '.navigation-link:not(.previous-link):not(.next-link)'
            )
            .click();
          expect(el.goToPage).to.have.been.calledOnce;
          expect(el.goToPage).to.have.been.calledWith(1);
        });

        describe('gotoPage method', () => {
          it('should update currentPage to given argument', () => {
            el.goToPage(2);
            expect(el.currentPage).to.equal(2);
          });

          it('should dispatch an event', () => {
            sandbox.spy(el, 'dispatchEvent');
            el.goToPage(2);
            expect(el.dispatchEvent).to.have.been.calledOnce;
          });

          it('shold dispatch an event with the propper pages info', done => {
            const testData = {
              oldPage: 1,
              newPage: 2,
            };

            el.addEventListener('pokemon-list-go-to-page', e => {
              expect(e.detail).to.be.deep.equal(testData);
              done();
            });

            el.goToPage(2);
          });
        });
      });

      describe('and pokemon-per-page is set', () => {
        beforeEach(async () => {
          el = await fixture(
            html`<pokemon-list
              .pokemonList="${pokeApiMocks['/pokemon'].results}"
              pokemon-per-page="1"
              pagination
            ></pokemon-list>`
          );
        });

        it('should set numberOfPages to 1 for an object with 1 element', () => {
          expect(el.numberOfPages).to.equal(1);
        });

        it('should set the appropriate number of pages (20) for an object with multiple elements (20) if itemsPerPage is 1', async () => {
          const numberOfElements = 20;
          const pokemonList = [];
          while (pokemonList.length !== numberOfElements) {
            pokemonList.push(...pokeApiMocks['/pokemon'].results);
          }
          el = await fixture(
            html`<pokemon-list
              .pokemonList="${pokemonList}"
              pokemon-per-page="1"
              pagination
            ></pokemon-list>`
          );

          expect(el.numberOfPages).to.equal(20);
        });
      });
    });
  });
});
