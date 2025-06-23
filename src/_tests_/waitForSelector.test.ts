import { waitForSelector } from '../utils/waitForSelector';

describe('waitForSelector util', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('resolves when element appears', async () => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.id = 'test';
      document.body.appendChild(div);
    }, 50);

    await expect(waitForSelector('#test', 500, 10)).resolves.toBeInstanceOf(Element);
  });

  it('rejects when timeout', async () => {
    await expect(waitForSelector('#nonexistent', 100, 20)).rejects.toThrow(
      /not found within timeout/
    );
  });
});
