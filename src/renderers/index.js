const testAPI = () => {
  const params = '/lists?names=true'
  const method = 'get'
  const content = null
  const response = 'populateNav'
  window.communicate.API({ params, method, content, response })
}

addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('button')
  btn.addEventListener('click', testAPI)
})