import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY is missing. Please add it to .env.local.");
    process.exit(1);
  }

  console.log("Initializing GoogleGenAI...");
  const ai = new GoogleGenAI({ apiKey });

  const prompt = process.argv[2] || "A beautifully cinematic sweeping shot of a quiet futuristic city at dawn, high quality, 4k, photorealistic.";
  
  console.log(`Using prompt: "${prompt}"`);
  console.log("Starting video generation with Veo...");

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      source: { prompt: prompt },
      config: {
        aspectRatio: '16:9',
      },
    });

    console.log("Generation started, waiting for completion (this may take several minutes)...");

    while (!operation.done) {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({
        operation: operation.name || operation,
      });
    }
    
    console.log("\nOperation complete!");
    
    if (operation.error) {
       console.error("API returned an error:", operation.error);
       process.exit(1);
    }

    const result = operation.response;
    const videoUri = result?.generatedVideos?.[0]?.video?.uri;
    const videoBytes = result?.generatedVideos?.[0]?.video?.videoBytes; 

    if (!videoUri && !videoBytes) {
      console.error("Error: No video data returned in the response.");
      console.dir(result, { depth: null });
      process.exit(1);
    }

    const outputDir = path.join(process.cwd(), '..', '09-Video');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const filename = `veo-test-${Date.now()}.mp4`;
    const filepath = path.join(outputDir, filename);

    if (videoBytes) {
      console.log("Saving video from base64 response...");
      const buffer = Buffer.from(videoBytes, 'base64');
      fs.writeFileSync(filepath, buffer);
    } else if (videoUri) {
       console.log(`Downloading video from URI: ${videoUri}`);
       const response = await fetch(videoUri);
       if (!response.ok) {
           throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
       }
       const arrayBuffer = await response.arrayBuffer();
       fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
    }
    
    console.log(`Success! Video saved to: ${filepath}`);
  } catch (error) {
    console.error("\nVideo generation failed:");
    if (error.status === 401 || error.status === 403) {
      console.error("- Authentication/Authorization error. Check your API key.");
    } else if (error.status === 429) {
      console.error("- Quota exceeded or billing not enabled. Veo models require a paid tier.");
    } else {
      console.error(error.message || error);
    }
    process.exit(1);
  }
}

main();
