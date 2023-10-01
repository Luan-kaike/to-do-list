
const hiddenAndViewVerticalBar = (e) => {
  if(e.key === 'b' && e.ctrlKey){
    const nav = document.querySelector('nav');
    const isHidden = nav.style.transform === 'translateX(-100%)';
    nav.style.transform = `translateX(${isHidden? 0 : -100}%)`;

    const aside = document.querySelector('aside');
    const div = document.querySelector('body > div');
    [aside, div].forEach(e => {
      e.style.transform = `translateX(${isHidden? 0 : '-50%'})`;
      e.style.left = `${isHidden? 'var(--width-verticalBar)' : '50vw'}`;
    });
  };
};

const focusInputs = (e) => {
  if(e.key === 'd' && e.ctrlKey)
    document.querySelector('nav > label > input').focus();

  else if(e.key === 'g' && e.ctrlKey)
  document.querySelector('aside > label > input')?.focus();
};

const initShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    hiddenAndViewVerticalBar(e);
    focusInputs(e);
  })
};

export { initShortcuts };