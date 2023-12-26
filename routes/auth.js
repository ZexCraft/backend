const router = require("express").Router();
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = SUPABASE_URL
  ? createClient(SUPABASE_URL, SUPABASE_KEY || "")
  : null;

const uploadImageToBucket = async (image, name) => {
  const { data, error } = supabase
    ? await supabase.storage.from("images").upload(`${name}.png`, image, {
        contentType: "image/png",
      })
    : { data: null, error: new Error("supabase not initialized") };
};

router.get("/hello", async (req, res) => {
  console.log("hello");
  res.status(200).json({ response: "hello v1" });
});

router.post("/image-pinata", async (req, res) => {
  const { image } = req.body;

  try {
    const formData = new FormData();
    const { data } = await axios.get(image, { responseType: "arraybuffer" });
    console.log(data);
    const imageBuffer = Buffer.from(data, "binary");

    const tempFilePath = "./image.jpg";
    fs.writeFileSync(tempFilePath, imageBuffer);
    // // Create FormData
    formData.append("file", fs.createReadStream(tempFilePath), {
      filename: "image.jpg",
    });
    const pinataMetadata = JSON.stringify({
      name: "ZexCraft NFT",
    });
    formData.append("pinataMetadata", pinataMetadata);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.PINATA_JWT_KEY}`,
          },
        }
      );
      const blob = new Blob([imageBuffer], { type: "image/jpeg" });
      uploadImageToBucket(blob, response.data.IpfsHash + ".png");

      res.status(200).json({
        image: response.data.IpfsHash,
        imageAlt:
          SUPABASE_URL +
          "/storage/v1/object/public/images/" +
          response.data.IpfsHash +
          ".png",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/image", async (req, res) => {
  const { image } = req.body;
  console.log(image);

  try {
    const { data } = await axios.get(image, { responseType: "arraybuffer" });
    console.log(data);
    const imageBuffer = Buffer.from(data, "binary");

    const tempFilePath = "./image.jpg";
    fs.writeFileSync(tempFilePath, imageBuffer);
    // // Create FormData
    const formData = new FormData();
    formData.append("file", fs.createReadStream(tempFilePath), {
      filename: "image.jpg",
    });

    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.NFT_STORAGE_KEY}`,
          ...formData.getHeaders(),
        },
      }
    );

    const blob = new Blob([imageBuffer], { type: "image/jpeg" });
    uploadImageToBucket(blob, response.data.value.cid);

    res.status(200).json({
      image: response.data.value.cid,
      imageAlt:
        SUPABASE_URL +
        "/storage/v1/object/public/images/" +
        response.data.value.cid +
        ".png",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error", message: error });
  }
});

module.exports = router;
