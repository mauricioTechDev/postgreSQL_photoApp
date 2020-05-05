console.log('Thanks for being my friends again');

let heart = document.getElementById('heart')
  heart.addEventListener('click', () => {
    console.log(heart.getAttribute('data-id'));
    let pictureId = heart.getAttribute('data-id')
    fetch('addHeart', {
      method: 'put',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        'pictureId': pictureId
      })
    }).then(function(res) {
      console.log(res);
       // window.location.reload()
    })
    window.location.reload(true)
  })
