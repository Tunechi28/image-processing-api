import  sharp from "sharp";
import * as fs from "fs";
import * as fsAsync from "fs/promises"
import * as path from "path";
import * as stream from "stream";
import { threadId } from "worker_threads";

const fullImagePath: string = path.join(__dirname, '../../../image/full')
const transformedImagePath:string = "./image/transformed";

export interface SharpImage {
    imageId: string,
	width: number,
	height: number,
	isOriginal: boolean,
	getStockImagePath: Function,
	getImagePath: Function,
	readImageStream: Function,
	checkIfOriginalImageExists: Function,
	init: Function
}


export default{
    /**
     * @type {string}
     */
    imageId : "",

    /**
     * @type {number}
     */
    width : 0,

    /**
     * @type {number}
     */
    height : 0,

    /**
     * @type {boolean}
     */
    isOriginal : true,

    /**
     * returns the full path of the image based on a constant an the image id
     * 
     * @method getStockImagePath
     * @return {string} the stock image path
     */

     getStockImagePath(): string {
         return `${fullImagePath}/${this.imageId}`

     },

     /**
      * returns the transformed image based on a constant, combination of width, height and imageID
      * @method getImagePath
      * @return {string}
      */
     getImagePath(): string{
         return(this.isOriginal ? this.getStockImagePath() : `${transformedImagePath}/${this.imageId}_${this.width}_${this.height}`)
     },

     /**
      * @method readImageStream
      * @return {stream}
      * @throws return 404 if image ID cannot be found
      */
     readImageStream() : stream{
         try{
            return fs.createReadStream(this.getStockImagePath())
         }catch(e){
             throw new Error('image id not found')
         }
     },

     async checkIfOriginalImageExists() : Promise<boolean> {
        try{
            let datafile = fsAsync.open(this.getStockImagePath(), 'r');
            (await datafile).close();
            return true;
        }catch(e){
            return false
        }
     },

     async checkIfTransformedImageExists() : Promise<boolean> {
        try{
            let datafile = await fsAsync.open(this.getImagePath(), 'r');
            await datafile.close();
            return true;
        }catch(e){
            return false
        }
     },

     /**
	 * Create a Sharp Image instance based on a stock image and return the file instance.
	 * If the transformed image already exists, it will be served from cache instead.
	 *
	 * @constructor
	 * @method init
	 * @async
	 * @param {string} imageId - The image ID.
	 * @param {number} [width=0] - The image desired width.
	 * @param {number} [height=0] - The image desired height.
	 * @throws It will throw a `400 - Bad request` error if the `imageId` parameter is not available.
	 * @throws It will throw a `404 - Not found` error if the `imageId` could not be found within the stock image folder.
	 * @throws It will throw a `500 - Internal server` error if some processing issue happens.
	 * @return {SharpImage} - The constructed file representation.
	 */
    
     init : async function (imageId: string, width : number =0, height: number = 0 ): Promise<SharpImage> {
         console.log(fullImagePath)
        if(!imageId){
            throw new Error(JSON.stringify({
                status : 404,
                message : "the image does not exist"
            }))
        }

        this.imageId = imageId;
        this.width = width;
        this.height = height;
        this.isOriginal = height <= 0 || width <= 0

        if(this.isOriginal){
            //check if original image exist
            let originalImageExists = await this.checkIfOriginalImageExists

            if(!originalImageExists){
                throw new Error(JSON.stringify({
                    status : 404,
                    message: "image does not exist"
                }))
            }

        }else{
            let transformedImageExist =await this.checkIfTransformedImageExists();
            if(!transformedImageExist){
                let originalImageExists = await this.checkIfOriginalImageExists();
                if(originalImageExists){
                    //we create the processed image from it
                    //create the file binary

                    let fileData = await fsAsync.open(this.getImagePath(), "w")

                    //write image to the file 

                    await fileData.write(
                        await sharp(
                            this.getStockImagePath()
                        ).resize(
                            width, height
                        ).toBuffer()
                    );
                    await fileData.close
                    
                }else{
                    throw new Error(JSON.stringify({
                        status : 404,
                        message : 'image cannot be found'
                    }))
                }
            }
        }

        return this;
     }

}
