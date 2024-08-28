const posts_db = require('../models/posts.model');
const LikedPostsDB = require('../models/liked.model');
const getUserData = require('../utils/getUsername');
const userModel = require('../models/user.model');
const searchPf = require('../utils/searchPf');

const getFeed = async (req, res) => {
    // const auth = req.authorization;
    const userData = getUserData(req);
    
    try {
        const userDoc = await userModel.findOne({username:userData.username});
        console.log("🟡 Fetching feed");
        var feed;
        const likedPosts = await LikedPostsDB.find({ userId: userData.uid });
        var likesArray = likedPosts
            .filter(el => el.category)
            .map(el => el.category);


        console.log(likesArray)
        if(likesArray.length>0){
            feed = await posts_db.find({});
            

            const map = likesArray.reduce((acc, category) => {
                acc[category] = (acc[category] || 0) + 1;
                return acc;
            }, {});
    
            console.log(map);
    
            feed.sort((a, b) => {
                const aCategory = a.category || 'Unknown';
                const bCategory = b.category || 'Unknown';
                return (map[aCategory] || 0) - (map[bCategory] || 0);
            });

            for (const postObj of feed) {
                if (postObj.postImg === 'none') {
                    console.log("⚠️ No postImg in post with id: ", postObj._id);
                    const driveData = await searchPf(postObj.upid);
                    if (driveData) {
                        // Update only the postImg in the database to avoid altering other fields
                        await posts_db.updateOne(
                            { _id: postObj._id },
                            { $set: { postImg: driveData.id } }
                        );
                        console.log("🔄 Updated postImg for post with id: ", postObj._id);
                    }
                } else {
                    console.log("🚀 postImg already exists in post with id: ", postObj._id);
                }
            }
    
            const values = Object.values(map);
            const maxValue = Math.max(...values);
            const maxKey = Object.keys(map).find(key=>map[key]==maxValue)
            console.log(userData.username, " likes ", maxKey ," The most.");
            if (!userDoc.category_pref || userDoc.category_pref[0] !== maxKey) {
                userDoc.category_pref = [maxKey];
                await userDoc.save();
                console.log("🟢 User profile updated with new category preference.");
            }
            console.log("PPPPPPPROFILE UPDATED...")
    
            console.log("🟢 Feed fetched successfully for", userData.username);
        }else{
            feed = await posts_db.find({});
            // likesArray=[undefined,'Sports',undefined,'Sports','Technology','']
            
        }
        if(feed.length>0){
            return res.status(200).json(feed);
        }else{
            const needs_cat_selection=[0,0];
            return res.status(200).json(needs_cat_selection);
        }
        


    } catch (e) {
        console.log("Error fetching feed: ", e);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = getFeed;
