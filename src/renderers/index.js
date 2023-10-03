import { initShortcuts } from './KeyboardShortcuts.mjs';

const init = () => {
  window.communicate.API({ 
    params: '/lists?names=true', 
    method: 'get', 
    response: 'populateNav'
  });
};

const addEffectScroll = () => {
  const manipulateBg = (elem, color) => {
    const toHaveScroll = elem.scrollHeight > elem.clientHeight
    const gradientPercent = 
      elem.scrollTop === 0? toHaveScroll ? '15%' : '0%' : '0%';

    elem.style.background =  
      `linear-gradient(0deg, var(--third-color), ${color} ${gradientPercent})`;
  };

  const aside = document.querySelector('aside > ul');
  const nav = document.querySelector('nav');

  [nav, aside].forEach(e => {
    const style = window.getComputedStyle(e)
    const color = style.getPropertyValue('background-color')
    console.log(color)
    manipulateBg(e, color);
    e.addEventListener('scroll', () => {
      manipulateBg(e, color);
    });
  })
};

document.addEventListener('DOMContentLoaded', () => {
  initShortcuts();
  addEffectScroll();
  init();
});