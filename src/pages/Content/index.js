const waitForElement = (selector) => {
  return new Promise(resolve => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element.innerText.trim());
    } else {
      const observer = new MutationObserver(mutations => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element.innerText.trim());
        }
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  });
};

const scrapeLinkedinProfileInfo = async () => {
  const elements = {};
  const selectors = {
    name: '.text-heading-xlarge',
    // image: '.pv-top-card-profile-picture__image .pv-top-card-profile-picture__image--show .ember-view',
    title: '.pv-text-details__left-panel .text-body-medium',
    company: '.pv-text-details__right-panel-item-link[aria-label^="Current company:"]',
    education: '.pv-text-details__right-panel-item-link[aria-label^="Education:"]',
    location: '.pv-text-details__left-panel .text-body-small.inline.t-black--light.break-words'
  };
  for (const [field, selector] of Object.entries(selectors)) {
    elements[field] = await waitForElement(selector);
  }

  // Get the featured div element and the next sibling element containing the text
  const featuredDiv = document.querySelector('#featured');
  if (featuredDiv){
    const nextElement = featuredDiv.nextElementSibling.nextElementSibling;

    // Get the text inside each span element with dir="ltr"
    const spanElements = nextElement.querySelectorAll('span[dir="ltr"]');
    const spanTexts = [];
    for (const spanElement of spanElements) {
      const spanText = spanElement.innerText.trim();
      spanTexts.push(spanText.replace(/<[^>]+>/g, ''));
    }
    elements['featured'] = spanTexts;
  }

  console.log('Profile Info:', elements);
  return elements;
};

const scrapeTwitterProfileInfo = async () => {
  const elements = {};
  const selectors = {
    // name: '.text-heading-xlarge',
    // image: '.pv-top-card-profile-picture__image .pv-top-card-profile-picture__image--show .ember-view',
    // bio: '.pv-text-details__left-panel .text-body-medium',
    // bio: '.pv-text-details__right-panel-item-link[aria-label^="Current company:"]',
    // education: '.pv-text-details__right-panel-item-link[aria-label^="Education:"]',
    // location: '.pv-text-details__left-panel .text-body-small.inline.t-black--light.break-words'
    featured: 'div[data-testid="tweetText"] span'
  };
  for (const [field, selector] of Object.entries(selectors)) {
    elements[field] = await waitForElement(selector);
  }

  const tweetElements = document.querySelectorAll(selectors.featured);
  const tweetTexts = [];
  for (const tweetElement of tweetElements) {
    const tweetText = tweetElement.innerText.trim();
    tweetTexts.push(tweetText.replace(/<[^>]+>/g, ''));
  }
  elements['featured'] = tweetTexts;

  console.log('Profile Info:', elements);
  return elements;
};

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == 'scrapeProfileInfo') {
    if (window.location.hostname.includes('linkedin.com')) {
      scrapeLinkedinProfileInfo().then(elements => {
        sendResponse(elements);
      });
    }
    // else if (window.location.hostname.includes('twitter.com')) {
    //   scrapeTwitterProfileInfo().then(elements => {
    //     sendResponse(elements);
    //   });
    // }

    return true;
  }
});
