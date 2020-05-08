require('dotenv').config();


module.exports = function(app, pool, multer, AWS, multerS3) {

  const s3 = new AWS.S3({
    credentials : {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
// connect the AWS object instance with multer using the multer-s3 module as a storage object.
const uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: process.env.S3_BUCKET,
    // metadata() method is used to send additional data about the file we are uploading to Amazon
    metadata: (req, file, cb) => {
      cb(null, {fieldName: file.fieldname})
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname)
    }
  })
});

  app.get('/newsfeed/:id', async (req, res) => {
    try {
      const newsFeed = await pool.query(`
        SELECT
        img_post.img, img_post.description, img_post.img_likes, img_post.img_post_id,
        user_account.first_name, user_account.user_id
        FROM img_post
        LEFT JOIN user_account
        ON img_post.id_of_img_poster = user_account.user_id
        ORDER BY img_post.img_post_id DESC
        `)
      const commentCount = await pool.query(`
        SELECT image_commented_on_id, count(image_commented_on_id)
        FROM comments
        GROUP BY image_commented_on_id`)
      res.render('newsFeed.ejs',{
        userData: req.user[0],
        newsFeed: newsFeed.rows,
        commentCount: commentCount.rows,
      })
    } catch (err) {
      console.error(err.message);

    }
  })
  app.put('/newsfeed/addHeart', async(req, res) =>{
    try {
      let pictureId = Number(req.body.pictureId)

      const heartPicture = await pool.query(`
        UPDATE img_post
        SET img_likes = img_likes + 1
        WHERE img_post_id = $1`, [pictureId])
      // UPDATE counters SET current_value = current_value + 1 WHERE counter_name = 'whatever';
      console.log(heartPicture);

    } catch (err) {
      console.error(err.message);

    }
  })
  app.put('/individualPicture/addHeart', async(req, res) =>{
    try {
      let pictureId = Number(req.body.pictureId)
      const heartPicture = await pool.query(`
        UPDATE img_post
        SET img_likes = img_likes + 1
        WHERE img_post_id = $1`, [pictureId])
      // UPDATE counters SET current_value = current_value + 1 WHERE counter_name = 'whatever';
    } catch (err) {
      console.error(err.message);

    }
  })



// =============================
// ROUTE TO UPLOADE PICTURES
// =============================
  app.post('/profile', uploadS3.single('file-to-upload'), async (req, res, next) => {
    try {
      let  location  = req.file.location;
      const { email, user_id } = req._passport.session.user[0]
      const { description } = req.body
      let date_ob = new Date();
      let date = date_ob.getDate();
      let month = date_ob.getMonth() + 1;
      let year = date_ob.getFullYear();
      let fullDate = `${year}-${month}-${date}`

      const picture = await pool.query(`
        INSERT INTO img_post (img, description, date_posted, id_of_img_poster)
        VALUES ($1, $2, $3, $4)`, [location, description, fullDate, user_id])
      res.redirect('/account');

    } catch (err) {
      console.error(err.message);
    }
  })


  // ================================
  // ROUTE TO UPLOADE PROFILE PICTURE
  // ================================

  app.post('/profileAvatar', uploadS3.single('file-to-upload'), async (req, res, next) => {
    try {
      let  location = req.file.location;
      const { email, user_id } = req._passport.session.user[0]

      const picture = await pool.query(`
        UPDATE user_account
        SET profile_img = $1
        WHERE email = $2;`,[location,email])
      console.log(picture)
      // res.json(picture)
      res.redirect('/account');

    } catch (err) {
      console.error(err.message);
    }
  })
  app.delete("/individualUserImg/deletePicture", async (req, res) => {
    try {
      const pictureId = Number(req.body.pictureId);
      const { email, user_id } = req._passport.session.user[0]
      const deleteTodo = await pool.query(
        `DELETE FROM img_post
        WHERE img_post_id = $1 AND id_of_img_poster = $2`,
        [pictureId, user_id]
      );
      res.json("Picture was deleted")
    } catch (err) {
      console.error(err.message);
    }
  })

  app.get('/individualUserImg/:id', async (req, res) => {
    try {
      let url = req._parsedOriginalUrl._raw
      let id;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          id = Number(url.slice(i+1))
          break;
        }
      }

      const individualUserImg = await pool.query(`
        SELECT * FROM img_post
        FULL JOIN comments
        ON img_post.img_post_id = comments.image_commented_on_id
        WHERE img_post.img_post_id = $1`, [id])

      const userNames = await pool.query(`SELECT user_id, first_name FROM user_account`)
      const commentCount = await pool.query(`
        SELECT image_commented_on_id, count(image_commented_on_id)
        FROM comments
        GROUP BY image_commented_on_id`)

      // console.log(individualUserImg.rows);
      res.render('individualUserImg.ejs',{
        userData: req.user[0],
        individualUserImg: individualUserImg.rows,
        userNames: userNames.rows,
        commentCount: commentCount.rows
      })
    } catch (err) {
      console.error(err.message);
    }
  })
  app.put('/individualUserImg/addHeart', async(req, res) =>{
    try {
      let pictureId = Number(req.body.pictureId)
      const heartPicture = await pool.query(`
        UPDATE img_post
        SET img_likes = img_likes + 1
        WHERE img_post_id = $1`, [pictureId])
      // UPDATE counters SET current_value = current_value + 1 WHERE counter_name = 'whatever';
    } catch (err) {
      console.error(err.message);

    }
  })

  app.get('/editProfile/:useId', async (req, res) => {
    try {
      const { email, user_id } = req._passport.session.user[0]

      const userInfo = await pool.query(`
        SELECT * FROM user_account
        WHERE user_account.email = $1`, [email])

      res.render('editAccount.ejs',{
        userData: req.user[0],
        userInfo: userInfo.rows[0]
      })

    } catch (error) {
      console.error(error);
    }
  })



  // ===============================
  // ROUTE TO IDIVIDUAL PICTURE PAGE
  // ===============================
  app.get('/individualPicture/:picId', async (req, res) => {
    try {
      let url = req._parsedOriginalUrl._raw
      let id;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          id = Number(url.slice(i+1))
          break;
        }
      }
      const individualPicture = await pool.query(`
        SELECT * FROM img_post
        FULL JOIN comments
        ON img_post.img_post_id = comments.image_commented_on_id
        WHERE img_post.img_post_id = $1`, [id])
      const userNames = await pool.query(`
        SELECT user_id, first_name
        FROM user_account`)
      const commentCount = await pool.query(`
        SELECT image_commented_on_id, count(image_commented_on_id)
        FROM comments GROUP BY image_commented_on_id`)

      res.render('individualPicture.ejs', {
        userData: req.user[0],
        individualPicture: individualPicture.rows,
        userNames: userNames.rows,
        commentCount: commentCount.rows
      })
    } catch (err) {
      console.error(err.message);
    }
  })

// =============================
// POSTING A COMMENT
// =============================
  app.post('/comment', async (req, res) => {
    try {
      let commenter_user_id = req.user[0].user_id
      const { comment } = req.body
      let url = req.headers.referer;
      let image_commented_on_id;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          image_commented_on_id = Number(url.slice(i+1))
          break;
        }
      };
      const commentPost = await pool.query(`
        INSERT INTO comments (comment, commenter_user_id, image_commented_on_id)
        VALUES ($1, $2, $3)`, [comment, commenter_user_id, image_commented_on_id])
      res.redirect(`/individualPicture/${image_commented_on_id}`)
    } catch (err) {
      console.error(err.message);
    }
  })



  // =============================
  // REPLY TO A COMMENT
  // =============================
  app.get('/replies/:commentId', async(req, res) => {
    try {
      let url = req._parsedOriginalUrl._raw

      let comment_replied_to_id;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          comment_replied_to_id = Number(url.slice(i+1))
          break;
        }
      };
      const comment = await pool.query(`
        SELECT * FROM comments
        WHERE comments_id = $1`,
        [comment_replied_to_id])
      const replies = await pool.query(`
        SELECT
        reply, reply_likes, reply_user_id, comment_replied_to_id, img_replied_to_id
        FROM comment_replies
        WHERE comment_replied_to_id = $1`,
        [comment_replied_to_id])
      const userNames = await pool.query(`
        SELECT user_id, first_name
        FROM user_account`)
      res.render('replies.ejs', {
        userData: req.user[0],
        replies: replies.rows,
        userNames: userNames.rows,
        comment: comment.rows
      })
    } catch (err) {
      console.error(err.message);
    }
  })

  app.post('/commentReply', async (req, res) => {
    try {
      let reply_user_id = req.user[0].user_id
      let reply = req.body.reply
      let img_replied_to_id = Number(req.body.img_replied_to_id)

      let url = req.headers.referer;
      let comment_replied_to_id;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          comment_replied_to_id = Number(url.slice(i+1))
          break;
        }
      };

      const replyPost = await pool.query(`
        INSERT INTO comment_replies
        (reply, reply_user_id, comment_replied_to_id, img_replied_to_id)
        VALUES ($1, $2, $3, $4)`,
        [reply, reply_user_id, comment_replied_to_id, img_replied_to_id])

      res.redirect(`/replies/${comment_replied_to_id}`)
    } catch (err) {
      console.error(err.message);
    }
  })




  app.post('/individualPicture/friendReguest', async (req, res) => {
    try {
      let requesterid = req.user[0].user_id;
      let addresseeid = req.body.id_of_img_poster;
      let status = 'PENDING'

      //I must await to recieve the promise ;-]
      const friendReguest = await pool.query(`
        INSERT INTO
        friends (requesterid, addresseeid, status)
        VALUES ($1, $2, $3)`,
        [requesterid, addresseeid, status])
    } catch (err) {
      console.error(err.message);
    }
  })

  app.put('/acceptRequest', async (req, res) => {
    try {
      let friends_id = Number(req.body.friendReguestId)

      const updateFriendStatus = await pool.query(`
        UPDATE friends
        SET status = 'ACCEPTED'
        WHERE friends_id = $1`,
        [friends_id])
    } catch (err) {
      console.error(err.message);
    }
  })

  app.put('/declineRequest', async (req, res) => {
    try {
      let friends_id = Number(req.body.friendReguestId)

      const updateFriendStatus = await pool.query(`
        UPDATE friends
        SET status = 'DECLINE'
        WHERE friends_id = $1`,
        [friends_id])
    } catch (err) {
      console.error(err.message);
    }
  })

  app.get('/friend/:friendId', async(req, res) => {
    try {
      let url = req._parsedOriginalUrl._raw
      let friendId;
      for(let i = url.length - 1; i > 0; i--){
        if(url[i] == '/'){
          friendId = url.slice(i+1)
          break;
        }
      }
      const friend = await pool.query(`
        SELECT * FROM user_account
        WHERE user_id = $1`,[friendId])
      const friendsPicture = await pool.query(`
        SELECT * FROM img_post
        WHERE id_of_img_poster = $1`, [friendId])
      const commentCount = await pool.query(`
        SELECT image_commented_on_id, count(image_commented_on_id)
        FROM comments
        GROUP BY image_commented_on_id`)
      res.render('friends.ejs',{
        userData: req.user[0],
        friend: friend.rows[0],
        friendsPicture: friendsPicture.rows,
        commentCount: commentCount.rows
        })
    } catch (err) {
      console.error(err.message);
    }
  })

  app.put('/friend/addHeart', async(req, res) =>{
    try {
      let pictureId = Number(req.body.pictureId)

      const heartPicture = await pool.query(`
        UPDATE img_post
        SET img_likes = img_likes + 1
        WHERE img_post_id = $1`, [pictureId])
      // UPDATE counters SET current_value = current_value + 1 WHERE counter_name = 'whatever';
    } catch (err) {
      console.error(err.message);
    }
  })
}
