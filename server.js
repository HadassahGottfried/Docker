const express = require('express');
const { Storage } = require('@google-cloud/storage');
const app = express();
const PORT = process.env.PORT || 8080;
const bucketName = 'hadassah-bucket-docker';
const storage = new Storage();

async function listFiles() {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    return files.map(file => file.name);
  } catch (error) {
    console.error("Error retrieving files", error);
    throw new Error('Error retrieving files');
  }
}

app.get('/', async (req, res) => {
  try {
    const files = await listFiles();
    if (files.length > 1) {
      const imageUrl1 = `https://storage.googleapis.com/${bucketName}/${files[0]}`;
      const imageUrl2 = `https://storage.googleapis.com/${bucketName}/${files[1]}`;

      res.send(`
        <h1>Welcome to the Cloud Storage App</h1>
        <p>Here are the images from your bucket:</p>
        <div style="display: flex; justify-content: center; gap: 20px;">
          <img src="${imageUrl1}" alt="Image 1" style="max-width: 45%; height: auto;" />
          <img src="${imageUrl2}" alt="Image 2" style="max-width: 45%; height: auto;" />
        </div>
      `);
    } else {
      res.send('<h1>Not enough files found in the bucket!</h1>');
    }
  } catch (error) {
    res.status(500).send('<h1>Error retrieving files</h1>');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});