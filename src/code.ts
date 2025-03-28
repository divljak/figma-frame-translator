/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 300, height: 160 });

interface TranslateMessage {
  type: 'translate';
  language: string;
  sourceLanguage: string;
}

interface TranslationRequest {
  text: string;
}

figma.ui.onmessage = async (msg: TranslateMessage) => {
  if (msg.type === 'translate') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a frame first');
      figma.ui.postMessage({ type: 'translationComplete' });
      return;
    }

    const targetLanguage = msg.language;
    const sourceLanguage = msg.sourceLanguage;
    let successCount = 0;
    let errorCount = 0;
    
    for (const node of selection) {
      if (node.type === 'FRAME') {
        try {
          await translateFrame(node, sourceLanguage, targetLanguage);
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          console.error('Translation error:', errorMessage);
          figma.notify(`Error: ${errorMessage}`);
        }
      }
    }

    // Send completion notification
    figma.ui.postMessage({ type: 'translationComplete' });

    // Show summary notification
    if (errorCount === 0 && successCount > 0) {
      figma.notify(`Successfully translated ${successCount} frame${successCount !== 1 ? 's' : ''}`);
    } else if (errorCount > 0) {
      figma.notify(`Translated ${successCount} frame${successCount !== 1 ? 's' : ''} with ${errorCount} error${errorCount !== 1 ? 's' : ''}`);
    }
  }
};

async function translateFrame(frame: FrameNode, sourceLanguage: string, targetLanguage: string) {
  const textNodes = findAllTextNodes(frame);
  
  if (textNodes.length === 0) {
    throw new Error('No text found in the selected frame');
  }

  // Load all fonts first
  await Promise.all(textNodes.map(async (node) => {
    const fontName = node.fontName as FontName;
    if (fontName) {
      await figma.loadFontAsync(fontName);
    }
  }));

  for (const node of textNodes) {
    try {
      const translatedText = await translateText(node.characters, sourceLanguage, targetLanguage);
      if (translatedText && translatedText.trim()) {
        node.characters = translatedText;
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
}

function findAllTextNodes(node: SceneNode): TextNode[] {
  let textNodes: TextNode[] = [];
  
  if (node.type === 'TEXT') {
    textNodes.push(node);
  }
  
  if ('children' in node) {
    for (const child of node.children) {
      textNodes = textNodes.concat(findAllTextNodes(child));
    }
  }
  
  return textNodes;
}

async function translateText(text: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  if (!text.trim()) {
    return text;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`;
    
    const response = await fetch(url);
    const responseText = await response.text();
    console.log('Raw API response:', responseText);

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status} ${response.statusText} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed API response:', data);

    if (!data.responseData?.translatedText) {
      throw new Error('No translation received from API');
    }

    return data.responseData.translatedText;
  } catch (error) {
    console.error('Translation API error details:', error);
    throw new Error(`Translation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
} 