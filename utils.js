const fs = require("fs");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateFeedback(imagePath) {
  const SYSTEM_PROMPT =
    "You are a fashion expert who gives snarky but constructive feedback on outfits. Your advice should be helpful but entertaining. Keep it concise, no more than 80 words. Your response will be converted to speech, so avoid emojis, markdown, or any formatting that could confuse a speech synthesis model.";

  try {
    if (!imagePath) throw new Error("Image path required");

    const base64Image = fs.readFileSync(imagePath, "base64");

    console.log("Generating feedback...");
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Judge this outfit and give constructive feedback",
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`,
            },
          ],
        },
      ],
    });

    console.log("Successfully generated feedback");
    return response.output_text;
  } catch (error) {
    console.error("Failed to generated feedback: ", error);
    throw new Error(error);
  }
}

async function convertFeedbackToSpeech(feedback, destPath) {
  try {
    console.log("Converting feedback to speech...");
    const mp3 = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "alloy",
      input: feedback,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(destPath, buffer);
    console.log("Successfully converted feedback to speech: ", destPath);
    return destPath;
  } catch (error) {
    console.error("Failed to convert feedback to speech: ", error);
  }
}
module.exports = { generateFeedback, convertFeedbackToSpeech };
