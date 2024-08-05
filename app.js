const express = require('express');
const app = express();
const cors = require('cors');
const auth=require('./auth/auth');

const login_controller = require('./controllers/login.controller')
const signup_controller = require('./controllers/signup.controller')
const getAllPeople = require('./controllers/getAllPeople.controller')
const makePost = require('./controllers/make_a_post.controller')
const deletePost = require('./controllers/delete_a_Post.controller')
const getFeed = require('./controllers/getFeed.controller')
const getMyPosts = require('./controllers/myPosts.controller')
const getTrashBin = require('./controllers/myTrashBin.controller');
const getUserData = require('./utils/getUsername');
const likePost = require('./controllers/like_a_Post.controller');
const unLike = require('./controllers/remove_like.controller');
const addComment = require('./controllers/add_a_comment.controller');
const likeComment = require('./controllers/likeComment.controller');
const DeleteComment = require('./controllers/DeleteComment');
const getPerson = require('./controllers/getPerson.controller');
const UpdateProfile = require('./controllers/UpdateProfile.controller');
const deleteForever = require('./controllers/deletePermenently.controller');
const AddFollower = require('./controllers/add_a_follower.controller');
const googleCall = require('./utils/googleCall');

app.use(express.json());
app.use(cors())

app.post('/signup', signup_controller);
app.post('/login', login_controller);

app.get('/people',auth, getAllPeople)
app.post('/post',auth,makePost);
app.delete('/post',auth,deletePost);
app.delete('/deletepermenently',auth,deleteForever);
app.get('/feed',auth,getFeed);
app.post('/myposts',auth,getMyPosts);
app.get('/myTrash',auth,getTrashBin);
app.post('/getData',auth,getUserData);
app.put('/post',auth,likePost)
app.delete('/like',auth,unLike)
app.put('/comment',auth,addComment);
app.post('/comment',auth,likeComment);
app.delete('/comment',auth,DeleteComment);
app.post('/person',auth,getPerson)
app.put('/profile',auth,UpdateProfile)
app.put('/follower',auth,AddFollower)
// app.put('/following',auth,addFollowing)

app.get("/", (req, res) => {
    console.log(req);
    res.send("Socio server is live!");
});

module.exports = app;
