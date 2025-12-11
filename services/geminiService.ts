import { GoogleGenAI } from "@google/genai";
import { TileData, Direction } from "../types";
import { GRID_SIZE } from "../constants";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = 'gemini-2.5-flash';

export const getAIHint = async (tiles: TileData[], score: number): Promise<string> => {
  try {
    // Construct grid representation
    const grid: number[][] = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    tiles.forEach(t => {
      grid[t.row][t.col] = t.value;
    });

    const boardString = grid.map(row => row.join('\t')).join('\n');

    const prompt = `
You are an expert player of the game 2048.
Current Score: ${score}
Board State:
${boardString}

(0 represents an empty cell)

Analyze the board. Suggest the single best next move (UP, DOWN, LEFT, or RIGHT).
Explain your reasoning in one short, witty sentence. 
Format: "MOVE: [DIRECTION] - [Explanation]"
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.2, // Low temperature for more deterministic/logic-based answers
      }
    });

    return response.text?.trim() || "AI couldn't decide!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI is currently napping. Try again later.";
  }
};