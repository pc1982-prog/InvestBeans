const asyncHandler=(requestHandler)=>{
   return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>{
           err.requestInfo={
            method:req.method,
            url:req.originalUrl,
            body:req.body,
            params:req.params,
            query:req.query,
            ip:req.ip
           };
        
            next(err);
        });
    };
};

    
export {asyncHandler}

