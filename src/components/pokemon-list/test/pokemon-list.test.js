import { expect, fixture, html } from '@open-wc/testing';
import '../pokemon-list.js';

describe('pokemon-list component', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(html`<pokemon-list></pokemon-list>`);
  });

  it('should be instantiated properly', () => {
    expect(el.constructor.is).to.equal('pokemon-lis');
  });
});
