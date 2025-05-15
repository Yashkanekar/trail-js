export function waitForSelector(
  selector: string,
  timeout = 5000,
  interval = 100
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);

      if (Date.now() - startTime >= timeout) {
        return reject(
          new Error(`Selector ${selector} not found within timeout.`)
        );
      }

      setTimeout(check, interval);
    };

    check();
  });
}
