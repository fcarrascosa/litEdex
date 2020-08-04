import { expect, fixture, html } from '@open-wc/testing';
import pokeApiMocks from './mocks/pokeapi.mock.js';
import '../src/lit-edex.js';
import ApiConsumer from '../src/utils/api-consumer/src/ApiConsumer.js';

describe('lit-edex component', () => {
  let el;
  const sandbox = sinon.createSandbox();

  beforeEach(async () => {
    sandbox
      .stub(window, 'fetch')
      .resolves({ json: () => Promise.resolve(pokeApiMocks['/pokemon']) });

    el = await fixture(html`<lit-edex></lit-edex>`);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be instantiated propperly', () => {
    expect(el.constructor.is).to.equal('lit-edex');
  });

  it('should instantiate the api handler', () => {
    expect(el.apiHandler).to.be.instanceOf(ApiConsumer);
  });

  describe('rendering behavior', () => {
    beforeEach(() => {
      sandbox
        .stub(el, 'getPokemonList')
        .resolves(pokeApiMocks['/pokemon'].results);
    });

    it('should call getPokemonList when rendered', async () => {
      await el.connectedCallback();
      expect(el.getPokemonList.calledOnce).to.be.true;
    });

    it('should set the pokemonList to the proper value when fetch succeeds', async () => {
      expect(el.pokemonList).to.deep.equal(pokeApiMocks['/pokemon'].results);
    });

    it('should set the pokemonCount to the proper value when fetch succeeds', () => {
      expect(el.totalAmountOfPokemon).to.deep.equal(
        pokeApiMocks['/pokemon'].results.length
      );
    });

    it('should set the loading property to false', async () => {
      el.loading = true;
      await el.connectedCallback();
      expect(el.loading).to.be.false;
    });
  });

  describe('unit tests for methods', () => {
    describe('getPokemonList method', () => {
      describe('when fetch throws an error', () => {
        beforeEach(() => {
          window.fetch.rejects();
        });

        it('should return an empty array', async () => {
          const testItem = await el.getPokemonList();
          expect(testItem).to.deep.equal([]);
        });
        it('should set the error property to true', async () => {
          el.error = false;
          await el.getPokemonList();
          expect(el.error).to.be.true;
        });

        it('should console an error', async () => {
          sandbox.spy(window.console, 'error');
          await el.getPokemonList();
          expect(console.error.calledOnce).to.be.true;
        });
      });
      describe('when fetch is successful', () => {
        it('should return the pokemon list', async () => {
          const result = await el.getPokemonList();
          expect(result).to.deep.equal(pokeApiMocks['/pokemon'].results);
        });
      });
    });
  });
});
