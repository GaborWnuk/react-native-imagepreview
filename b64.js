/**
 * Image Preview component for React Native
 * https://github.com/GaborWnuk
 * @flow
 */

if (!global.atob) {
  global.atob = require('base-64').decode;
}

if (!global.btoa) {
  global.btoa = require('base-64').encode;
}

export default class B64ImagePreview {
  static b64Header = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDADUlKC8oITUvKy88OTU/UIVXUE' +
    'lJUKN1e2GFwarLyL6qurfV8P//1eL/5re6////////////zv/////////' +
    '/////2wBDATk8PFBGUJ1XV53/3Lrc////////////////////////////' +
    '////////////////////////////////////////wAARCAAqACoDASIAA' +
    'hEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtR' +
    'AAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0K' +
    'xwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVW' +
    'V1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp' +
    '6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8v' +
    'P09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8Q' +
    'AtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKR' +
    'obHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU' +
    '1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoq' +
    'OkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6On' +
    'q8vP09fb3+Pn6/9oADAMBAAIRAxE=';

  constructor(b64Body: string) {
    this.b64HeaderBinary = atob(B64ImagePreview.b64Header);

    try {
      this.b64BodyBinary = atob(b64Body);
    } catch (exception) {
      this.b64BodyBinary = false;
    }

    this.b64Binary = this.b64HeaderBinary + this.b64BodyBinary;
    this.b64String = btoa(this.b64Binary);
  }

  get base64Binary(): string {
    return this.b64BodyBinary ? this.b64Binary : null;
  }

  get base64String(): string {
    return this.b64BodyBinary ? this.b64String : null;
  }

  get imageSource(): string {
    return this.b64BodyBinary
      ? 'data:image/jpg;base64,' + this.b64String
      : null;
  }
}
