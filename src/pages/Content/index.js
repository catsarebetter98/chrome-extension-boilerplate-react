import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");
// Wait for the profile name to load
const waitForName = () => {
  return new Promise(resolve => {
    const nameElement = document.querySelector('.text-heading-xlarge');
    if (nameElement) {
      resolve(nameElement.innerText.trim());
    } else {
      const observer = new MutationObserver(mutations => {
        const nameElement = document.querySelector('.text-heading-xlarge');
        if (nameElement) {
          observer.disconnect();
          resolve(nameElement.innerText.trim());
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  });
};

// Scrape the name from the LinkedIn profile
const scrapeName = async () => {
  const name = await waitForName();
  console.log('Name:', name);
};

// Call the function to scrape the name from the LinkedIn profile
scrapeName();
