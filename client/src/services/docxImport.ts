/* ============================================
   DOCX Resume Import
   Extracts text from a .docx file using mammoth,
   then feeds it into the same parser the PDF
   import uses (regex-based, with optional AI pass).
   No OCR needed — Word documents always contain
   real text.
   ============================================ */

import * as mammoth from 'mammoth';

/**
 * Extract all text from a .docx file (client-side).
 * mammoth preserves paragraph breaks, which keeps
 * resume structure (name line, section headers,
 * bullet lines) intact for the parser.
 */
export async function extractDOCXText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result.value || '').trim();
}
