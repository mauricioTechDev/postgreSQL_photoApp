let hearts = document.querySelectorAll('.heart')
console.log('Hello world');
Array.from(hearts).forEach(heart => {
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
})


// Array.from(edit).forEach(function(element) {
//   element.addEventListener("click", function() {
//     // console.log(edit);
//     const name = this.parentNode.childNodes[5].innerText
//     const income = this.parentNode.childNodes[9].innerText
//     console.log(name, income)
//     fetch("updateUser", {
//       method: "put",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         'name': name,
//         'income': income,
//       })
//     }).then(function(response) {
//       console.log(response);
//       window.location.reload()
//     });
//   });
// });
