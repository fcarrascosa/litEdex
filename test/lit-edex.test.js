import { expect, fixture, html } from '@open-wc/testing';
import '../src/lit-edex.js';

describe('lit-edex component', () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<lit-edex></lit-edex>`);
  });

  it('should be instantiated propperly', () => {
    expect(el.constructor.is).to.equal('lit-edex');
  });
});
