function requireUser(req,res,next) {
    if(!req.user) {
        next({
            name:"MissingUserError",
            message:"You must be logged in to perform this action"
        })
    }

    next();
}

// function requireActiveUser(req,res,next) {
//     console.log(req.user);
//     //console.log(req.user.active);
//     if(!req.user.active) {
//         next({
//             name:"UserNotActive",
//             message:"This user is not active"
//         })
//     }

//     next();
// }

module.exports = {
    requireUser,
    // requireActiveUser
}