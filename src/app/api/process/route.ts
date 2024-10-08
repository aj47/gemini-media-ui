import { NextRequest, NextResponse } from 'next/server';
import { initializeGeminiAPI, processContent } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const features = formData.get('features') as string;
    const model = formData.get('model') as string;

    // Initialize Gemini API with your API key
    initializeGeminiAPI(process.env.GEMINI_API_KEY as string);

    // Process files and convert them to the format expected by Gemini API
    const content = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return {
          fileData: {
            mimeType: file.type,
            fileUri: `data:${file.type};base64,${base64}`,
          },
        };
      })
    );

    // Process content using Gemini API
    const result = await processContent(model, content, JSON.parse(features));

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error processing files:', error);
    return NextResponse.json({ error: 'Error processing files' }, { status: 500 });
  }
}