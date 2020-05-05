CREATE DATABASE quickpound_postgres


CREATE TABLE user_account (
  user_id UUID PRIMARY KEY,
  first_name VARCHAR(35) NOT NULL,
  last_name VARCHAR(35) NOT NULL,
  email  VARCHAR(100) NOT NULL,
  password VARCHAR(80) NOT NULL,
  about_me VARCHAR(300),
  profile_img bytea
);


CREATE TABLE img_post (
  img_post_id SERIAL PRIMARY KEY,
  img VARCHAR(350) NOT NULL,
  description VARCHAR(300),
  img_likes INTEGER NOT NULL DEFAULT 0,
  date_posted   DATE,
  id_of_img_poster UUID,
  FOREIGN KEY (id_of_img_poster) REFERENCES user_account(user_id)
);

CREATE TABLE friends (
  friends_id serial PRIMARY KEY,
  requesterId UUID,
  addresseeId UUID,
  status  VARCHAR(100) NOT NULL,
   FOREIGN KEY (requesterId) REFERENCES user_account (user_id),
   FOREIGN KEY (addresseeId) REFERENCES user_account (user_id)
);

CREATE TABLE comments (
  comments_id SERIAL PRIMARY KEY,
  comment VARCHAR(300),
  comment_likes INTEGER,
  commenter_user_id UUID,
  img_commented_on_id INT,
  FOREIGN KEY (commenter_user_id) REFERENCES user_account(user_id),
  FOREIGN KEY (image_commented_on_id ) REFERENCES img_post (img_post_id) ON DELETE CASCADE
);
