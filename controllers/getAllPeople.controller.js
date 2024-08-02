const db = require('../models/user.model');
const getUserData = require('../utils/getUsername');

const people=async (req,res)=>{
    try{
        console.log("Fetching all the people for ",getUserData(req).username);
        const people = await db.find({});
        // console.log(people)
        res.status(200).send(people)
        // res.status(400).send(null)
    }catch(e){
        console.log("ERROR IN GetAllPeople.js: ",e)
        res.status(500).send("Error in gettAllPeople.js")
    }
}
module.exports=people