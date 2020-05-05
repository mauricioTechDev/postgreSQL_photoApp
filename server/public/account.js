let accept = document.getElementById('ACCEPT')
let decline = document.getElementById('DECLINE')
console.log('SWAGGGERR');


accept.addEventListener('click', () => {
  console.log(accept.getAttribute('data-id'));
  let friendReguestId = accept.getAttribute('data-id')
  fetch('acceptRequest', {
    method: 'put',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      'friendReguestId': friendReguestId
    })
  })
  .then(res => {
    console.log(res);
  })
  window.location.reload(true)

})


decline.addEventListener('click', () => {
  console.log(accept.getAttribute('data-id'));

  let friendReguestId = decline.getAttribute('data-id')
  fetch('declineRequest', {
    method: 'put',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({
      'friendReguestId': friendReguestId
    })
  })
  .then(res => {
    console.log(res);
  })
  window.location.reload(true)
})
