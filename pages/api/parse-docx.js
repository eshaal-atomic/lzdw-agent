import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { file } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // File comes as base64 from frontend
    const buffer = Buffer.from(file, 'base64');
    
    const result = await mammoth.extractRawText({ buffer });
    
    return res.status(200).json({ 
      text: result.value,
      messages: result.messages 
    });
  } catch (error) {
    console.error('DOCX parsing error:', error);
    return res.status(500).json({ 
      error: 'Failed to parse DOCX file',
      message: error.message
    });
  }
}
