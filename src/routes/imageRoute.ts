import express, {Request, Response} from "express";
import sharpimage from "../server/utilities/sharpimage";
import imageParams from "../server/middleware/imageParams";

const router = express.Router();

router.get('/',imageParams.validateImageParams, async (req: Request, res:Response) => {
    try{
        const image = await sharpimage.init(res.locals.imageId, res.locals.width, res.locals.height);
        console.log(image.getStockImagePath)
        res.type("jpg").status(200)
        image.readImageStream().pipe(res)
    }catch(e){
        return res.status(e.status || 500).send(e.message || e || "Unknown error");
    }
})

export default router
