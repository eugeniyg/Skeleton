export const getLocalesContentData = (
  currentLocaleContentResponse: any,
  defaultLocaleContentResponse: any
): {
  currentLocaleData: any;
  defaultLocaleData: any;
} => {
  const contentData = {
    currentLocaleData: undefined,
    defaultLocaleData: undefined,
  };

  if (currentLocaleContentResponse.status !== 'rejected') {
    contentData.currentLocaleData = currentLocaleContentResponse.value;
  }

  if (defaultLocaleContentResponse.status !== 'rejected') {
    contentData.defaultLocaleData = defaultLocaleContentResponse.value;
  }

  return contentData;
};

export const replaceContent = (content: string, separator: string): string => {
  const pathArr = content.split(separator);
  let newString = '';
  pathArr.forEach((path, index) => {
    if (index % 2) {
      newString += `<span>${path}</span>`;
    } else {
      newString += `${path}`;
    }
  });
  return newString;
};
