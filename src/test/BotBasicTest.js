import {expect} from 'chai';
import Bot from '../';

describe('Basic Bot test', () => {
  it('Bot requires init', () => {
    let fn = () => Bot.sendText('123', 'text');
    expect(fn).to.throw(Error);

    fn = () => Bot.router();
    expect(fn).to.throw(Error);
  });
});
