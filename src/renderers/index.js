
const populateNavLists = () => {
  const content = document.querySelector('nav > ul');
  content.innerHTML += 'oi' ;
}

const testAPI = () => {
  const params = '/lists'
  const method = 'get'
  const content = null
  window.communicate.API({ params, method, content })
}

addEventListener('DOMContentLoaded', () => {
  populateNavLists();

  const btn = document.querySelector('button')
  btn.addEventListener('click', testAPI)
})