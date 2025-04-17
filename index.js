require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { generateFeedback, convertFeedbackToSpeech } = require("./utils");

const app = express();

app.use(express.raw({ type: "image/jpeg", limit: "10mb" }));
app.use(express.json());

app.get("/", (req, res) => {
  console.log("test");
  res.send("testing");
});

app.post("/", async (req, res) => {
  console.log("Image received");

  const timestamp = Date.now();
  const filePath = path.join(__dirname, `/photos/photo_${timestamp}.jpg`);

  try {
    fs.writeFileSync(filePath, req.body);
    console.log("Image saved successfully to ", filePath);

    const audioFilename = `${Date.now()}.mp3`;
    const audioPath = path.join(__dirname, `feedback_audio/${audioFilename}`);

    const feedback = await generateFeedback(filePath);
    await convertFeedbackToSpeech(feedback, audioPath);

    exec(`afplay "${audioPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Audio playback failed: ", err);
      } else {
        console.log("Audio played");
      }
    });
    return res.status(200).send({
      message: "Successfully generated feedback tts",
      file: audioPath,
      url: `/feedback_audio/${audioFilename}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
});

app.post("/generate-feedback", async (req, res) => {
  try {
    if (!req.body.imagePath) throw new Error("Image path required");

    const imagePath = `${__dirname}/photos/${req.body.imagePath}`;
    const response = await generateFeedback(imagePath);

    res.status(200).send({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/convert-feedback-to-speech", async (req, res) => {
  try {
    if (!req.body.feedback) throw new Error("Feedback required");

    const feedback = req.body.feedback;
    const destPath = `${__dirname}/feedback_audio/${Date.now()}.mp3`;

    await convertFeedbackToSpeech(feedback, destPath);
    res.status(200).send("File written to: ", destPath);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

app.post("/play-audio", async (req, res) => {
  try {
    if (!req.body.fileName) throw new Error("Filename is required");

    const fileName = req.body.fileName;
    const audioPath = path.join(__dirname, `feedback_audio/${fileName}`);

    exec(`afplay "${audioPath}"`, (err, stdout, stderr) => {
      if (err) {
        console.error("Audio playback failed: ", err);
      } else {
        console.log("Audio played");
      }
    });
    res
      .status(200)
      .send({ meesage: `Successfully played audio: ${audioPath}` });
  } catch (error) {
    console.error("Failed to play audio: ", error);
    res.status(500).send({ error: error.message });
  }
});
app.post("/generate-feedback-tts", async (req, res) => {
  try {
    if (!req.body.imagePath) throw new Error("Image path is required");

    const imagePath = `${__dirname}/photos/${req.body.imagePath}`;
    const audioPath = `${__dirname}/feedback_audio/${Date.now()}.mp3`;

    const feedbackResponse = await generateFeedback(imagePath);
    await convertFeedbackToSpeech(feedbackResponse, audioPath);
    res.status(200).send({
      message: "Successfully generated feedback tts",
      file: audioPath,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error.message });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://localhost:3000`);
});
