import get from 'lodash/get';

export const getContent = (contentData: any, defaultLocaleContentData: any, path: string): any =>
  get(contentData, path) ?? get(defaultLocaleContentData, path);
