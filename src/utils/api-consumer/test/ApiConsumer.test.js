import { expect } from '@open-wc/testing';
import pokeApiMocks from '../../../../test/mocks/pokeapi.mock.js';
import ApiConsumer from '../src/ApiConsumer.js';

describe('ApiConsumer Class', () => {
  const baseUrl = 'https://pokeapi.co/api/v2/';
  let client;
  let sandbox;
  beforeEach(() => {
    client = new ApiConsumer();
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('fetch method', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sandbox.stub(window, 'fetch');
    });

    describe('basic behavior', () => {
      beforeEach(() => {
        fetchStub.resolves({ json: () => Promise.resolve() });
      });

      it('should call window.fetch', async () => {
        await client.fetch();
        expect(fetchStub.calledOnce).to.be.true;
      });

      describe('when called without parameters', () => {
        it('should call window.fetch with baseUrl as argument', async () => {
          await client.fetch();
          expect(fetchStub.calledWith(baseUrl)).to.be.true;
        });
      });
    });

    describe('when fetch fails', () => {
      it('should throw an error', async () => {
        const error = { status: 'someStatus', statusText: 'someText' };
        fetchStub.rejects(error);
        const errorObject = await client.fetch().catch(err => {
          return err;
        });

        expect(errorObject).to.deep.equal(error);
      });
    });
  });

  describe('getPokemonList', () => {
    let fetchStub;

    beforeEach(() => {
      fetchStub = sandbox.stub(client, 'fetch');
    });

    afterEach(() => {
      sandbox.reset();
    });

    after(() => {
      sandbox.restore();
    });

    it('should call client.fetch method', () => {
      fetchStub.resolves(pokeApiMocks['/pokemon']);
      client.getPokemonList();

      expect(fetchStub.calledOnce).to.be.true;
    });

    describe('without parameters', () => {
      describe('when api call is successful', () => {
        beforeEach(() => {
          fetchStub.resolves(pokeApiMocks['/pokemon']);
        });

        it('should return the pokemon list', async () => {
          const response = await client.getPokemonList();
          expect(response).to.deep.equal(pokeApiMocks['/pokemon']);
        });
      });

      describe('when the api call is not successful', () => {
        const error = { status: 'someStatus', statusText: 'someText' };

        beforeEach(() => {
          fetchStub.rejects(error);
        });

        it('should throw an error', async () => {
          const errorObject = await client.getPokemonList().catch(err => {
            return err;
          });

          expect(errorObject).to.deep.equal(error);
        });
      });
    });

    describe('with parameters', () => {
      const query = {
        limit: 20,
        offset: 0,
      };

      beforeEach(() => {
        fetchStub.resolves(pokeApiMocks['/pokemon']);
      });

      it('should call client.fetch() with queryString', () => {
        client.getPokemonList(query);

        expect(fetchStub.calledWith('pokemon?limit=20&offset=0')).to.be.true;
      });
    });
  });
});
