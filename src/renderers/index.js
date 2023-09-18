const init = () => {
  window.communicate.API({ 
    params: '/lists?names=true', 
    method: 'get', 
    response: 'populateNav'
  });
};

addEventListener('DOMContentLoaded', () => {
  init();
});