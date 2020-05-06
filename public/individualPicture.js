let friendReguest = document.getElementById('friendReguest')

console.log('BE MY FRIENDS PLEAASEEASDF');
friendReguest.addEventListener('click', () => {
 let id_of_img_poster = friendReguest.getAttribute('data-id')

 fetch('friendReguest', {
   method: 'post',
   headers: {
     'Content-Type': "application/json"
   },
   body: JSON.stringify({
     'id_of_img_poster': id_of_img_poster
   })
 })
 .then(res => {
   console.log(res);
 })
})


// let heart = document.getElementById('heart')
//   heart.addEventListener('click', () => {
//     console.log(heart.getAttribute('data-id'));
//     let pictureId = heart.getAttribute('data-id')
//     fetch('addHeart', {
//       method: 'put',
//       headers: {
//         'Content-Type': "application/json"
//       },
//       body: JSON.stringify({
//         'pictureId': pictureId
//       })
//     }).then(function(res) {
//       console.log(res);
//        // window.location.reload()
//     })
//     window.location.reload(true)
//   })
