
addEventListener('DOMContentLoaded', () => {
  const span = document.querySelector('body > span');
  span.addEventListener('click', () => window.communicate.closedApp());
})