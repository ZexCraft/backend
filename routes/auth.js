const router = require("express").Router();
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
// const { createClient } = require("@supabase/supabase-js");

router.post("/store", async (req, res) => {
  const { metadataString } = req.body;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  const supabase = SUPABASE_URL
    ? createClient(SUPABASE_URL, SUPABASE_KEY || "")
    : null;

  try {
    const metadataFilePath = "./metadata.json";

    fs.writeFileSync(metadataFilePath, metadataString, { encoding: "utf-8" });

    const formData = new FormData();
    formData.append("file", fs.createReadStream(metadataFilePath));

    // Make the request to the NFT storage API
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

    console.log(response.data);
    const uploadImageToBucket = async () => {
      const imageRes = await fetch(metadataString, {
        mode: "cors",
      });
      const image = await imageRes.blob();
      const { data, error } = supabase
        ? await supabase.storage.from("images").upload(`${cid}.png`, image, {
            contentType: "image/png",
          })
        : { data: null, error: new Error("supabase not initialized") };
      if (error) {
        throw new Error(error.message);
      }
      if (data.path != undefined) return data.path;
      else return "no image";
    };
    uploadImageToBucket();
    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/hello", async (req, res) => {
  console.log("hello");
  res.status(200).json({ response: "hello v1" });
});
