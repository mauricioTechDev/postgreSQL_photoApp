console.log('HEllo FOLKS');


let deleteimg = document.getElementById('delete')

  deleteimg.addEventListener('click', () => {
    console.log(deleteimg.getAttribute('data-id'));
    let pictureId = deleteimg.getAttribute('data-id')
    console.log(pictureId);
    fetch('deletePicture', {
      method: 'delete',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        'pictureId': pictureId
      })
    })
    .then(res => {
      console.log(res);
    })
    // window.location.reload(true)
  })


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
