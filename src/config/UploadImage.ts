import type { MultipartFile } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createWriteStream } from "node:fs";




interface UploadImageProps {
  file: MultipartFile;
  allowedTypes: string[];
  folder: string;
}


export const UploadImage = async ({
  file,
  allowedTypes,
  folder,
}: UploadImageProps)=>{


try {
    
if(!allowedTypes.includes(file.mimetype)){
    file.file.resume();
    throw new Error("Invalid image type");
}
const extension = path.extname(file.filename);
 const filename = `${randomUUID()}${extension}`;

const uploadDir = path.join(
      process.cwd(),
      "uploads",
      folder
    );

    await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
 await pipeline(
      file.file,
      createWriteStream(filePath, { flags: "wx" })
    );

 if (file.file.truncated) {
      await fs.unlink(filePath);

      throw new Error("Image size exceeded");
    }


  return {
      filename,
      path: filePath,
      url: `/uploads/${folder}/${filename}`,
    };

} catch (error) {
     throw error; 
}



}



export const DeleteImage = async(imgLink : string)=>{
const fullpath = path.join(process.cwd(),imgLink)
fs.unlink(fullpath)
}

