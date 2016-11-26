import { OurgroupPage } from './app.po';

describe('ourgroup App', function() {
  let page: OurgroupPage;

  beforeEach(() => {
    page = new OurgroupPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
