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

  it('should instantiate the api candler', () => {
    expect(el.apiHandler).to.be.instanceOf(ApiConsumer);
  });

  describe('rendering behavior', () => {
    beforeEach(() => {
      sandbox.stub(el, 'getPokemonList').resolves([]);
    });

    it('should call apiHandler when rendered', async () => {
      await el.connectedCallback();
      expect(el.getPokemonList.calledOnce).to.be.true;
    });

    it('should set the pokemonList to the proper value when fetch succeeds', async () => {
      el.getPokemonList.resolves(
        pokeApiMocks['/pokemon'].results.map((item, i) => ({
          ...item,
          id: i + 1,
        }))
      );
      await el.connectedCallback();

      expect(el.pokemonList).to.deep.equal([
        {
          id: 1,
          name: 'bulbasaur',
          url: 'https://pokeapi.co/api/v2/pokemon/1/',
        },
      ]);
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
        it('should console an error', async () => {
          sandbox.spy(window.console, 'error');
          await el.getPokemonList();
          expect(console.error.calledOnce).to.be.true;
        });
      });
    });
  });
});
