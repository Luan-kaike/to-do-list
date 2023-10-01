import { initShortcuts } from './keyboardShortcuts.mjs'

const init = () => {
  window.communicate.API({ 
    params: '/lists?names=true', 
    method: 'get', 
    response: 'populateNav'
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initShortcuts();
  init();
});