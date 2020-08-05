export default class ApiConsumer {
  constructor() {
    this.baseUrl = 'https://pokeapi.co/api/v2/';
  }

  async fetch(endpoint = '') {
    const url = `${this.baseUrl}${endpoint}`;
    return ApiConsumer.unwrappedFetch(url);
  }

  // eslint-disable-next-line class-methods-use-this
  static async unwrappedFetch(url = '') {
    const response = await fetch(`${url}`).catch(error => {
      throw error;
    });
    return response.json();
  }

  async getPokemonList(query = {}) {
    const queryKeys = Object.keys(query);
    const paramsString = queryKeys.length
      ? `?${queryKeys.map(key => `${key}=${query[key]}`).join('&')}`
      : '';
    const pokemonList = await this.fetch(`pokemon${paramsString}`).catch(
      error => {
        throw error;
      }
    );

    return pokemonList;
  }
}
