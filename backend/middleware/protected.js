let Authenticated = (req,res,next) => {


    if(!req.session.user){
        return res.status(401).json({
            message: "Nkawe koko !!"
        })
    }
    next();
}

export default Authenticated