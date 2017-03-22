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
  b64Header = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDADUlKC8oITUvKy88OTU/UIVXUElJUKN1e2GFwarLyL6qurfV8P//1eL/5re6////////////zv//////////////2wBDATk8PFBGUJ1XV53/3Lrc////////////////////////////////////////////////////////////////////wAARCAAqACoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxE=';

  constructor(b64Body) {
    this.b64HeaderBinary = atob(this.b64Header);
    this.b64BodyBinary = atob(b64Body);
    this.b64Binary = this.b64HeaderBinary + this.b64BodyBinary;
    this.b64String = btoa(this.b64Binary);
  }

  get base64Binary() {
    return this.b64Binary;
  }

  get base64String() {
    return this.b64String;
  }

  get imageSource() {
    return 'data:image/jpg;base64,' + this.b64String;
  }
}
