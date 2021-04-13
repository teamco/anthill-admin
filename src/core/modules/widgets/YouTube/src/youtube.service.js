import {htmlToElement} from '@/utils/dom';

const REGEXP = /^.*(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
const MASK = 'https://www.youtube.com/embed/{videoId}';

/**
 * Validate youtube
 * @param {string} preview
 * @return {string|boolean}
 */
export function getEmbedCode(preview) {
  if (preview.match(/iframe/)) {
    preview = htmlToElement(preview).getAttribute('src');
  }

  return preview.replace(REGEXP, MASK.replace(/{videoId}/g, '$1')).
      replace(/embed\/embed/, 'embed');
}
