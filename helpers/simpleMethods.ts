export const sortByAlphabet = (a: string, b: string): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getNicknameFromEmail = (email?: string): string => {
  if (!email) return 'unknown';
  const getFirstPath = email.split('@')[0];
  if (getFirstPath.length < 4) return `${getFirstPath.slice(0, 1)}***`;
  return `${getFirstPath.slice(0, -3)}***`;
};

export const handleExternalLink = (url: string): void => {
  const router = useRouter();
  if (url.includes('http')) window.open(url, '_blank');
  else router.push(localizePath(url));
};
