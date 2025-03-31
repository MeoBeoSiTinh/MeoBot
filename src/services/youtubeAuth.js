import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getAuthedClient = async () => {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, 'oauth2.keys.json'),
    scopes: ['https://www.googleapis.com/auth/youtube.force-ssl'],
  });
  
  return google.youtube({ version: 'v3', auth });
};