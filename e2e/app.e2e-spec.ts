import { GPage } from './app.po';

describe('g App', function() {
  let page: GPage;

  beforeEach(() => {
    page = new GPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
