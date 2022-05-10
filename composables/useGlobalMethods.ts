import { useRouter } from 'nuxt/app';

export const useGlobalMethods = () => {
  const router = useRouter();

  const navigate = (href:string):void => {
    router.push(href);
  };

  const getCurrentUrl = ():string => router.currentRoute.value.fullPath;

  const isHomePage = ():boolean => router.currentRoute.value.name === 'home';

  return {
    navigate,
    getCurrentUrl,
    isHomePage,
  };
};
