import { Loader } from 'resource-loader';

/**
 * @export
 * @param src
 * @param cb
 * @return {Promise<string>}
 */
export const srcToBlob = async ({ src, cb }) => {
  const loader = new Loader();
  loader.add(src).use((resource, next) => {
    next();
  }).load((loader, resources) => {
    const blob = new Blob([resources[src].data], { type: 'image/png' });
    cb(URL.createObjectURL(blob));
  });
};

/**
 * @export
 * @param {string} url
 * @return {Promise<string>}
 */
export async function getFileFromUrl(url) {
  const response = await fetch(url, {});
  const blob = await response.blob();
  // Then create a local URL for that image.
  return URL.createObjectURL(blob);
}

/**
 * @export
 * @param {string} url
 * @param {function} callback
 */
export function getImageFromUrl(url, callback) {
  const img = new Image();
  img.setAttribute('crossOrigin', 'Anonymous');
  img.onload = function(a) {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this, 0, 0);

    const dataURI = canvas.toDataURL('image/png');

    // Convert base64/URLEncoded data component to raw binary data held in a string.
    const byteString =
      dataURI.split(',')[0].indexOf('base64') >= 0
        ? atob(dataURI.split(',')[1])
        : unescape(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return callback(new Blob([ia], { type: mimeString }));
  };

  img.src = url;
}

/**
 * @function
 * @function
 * @param file
 * @return {Promise<unknown>}
 */
export function toBase64({ file }) {
  if (!file) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * @export
 * @param b64Data
 * @param contentType
 * @param sliceSize
 * @return {Blob}
 */
export const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * @export
 * @param url
 * @param fileName
 * @return {Promise<void>}
 */
export const download = (url, fileName) => {
  return getFileFromUrl(url).then((blob) => {
    const link = document.createElement('a');
    link.href = blob;
    link.download = fileName;
    link.click();
  });
};

/**
 * @export
 * @param url
 * @return {string}
 */
export const cachedUrl = url => {
  return url.match(/blob/) ? url : `${url}?${+(new Date)}`;
};
