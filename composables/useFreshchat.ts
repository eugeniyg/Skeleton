export const useFreshchat = () => {
  const { currentLocale } = useGlobalStore();

  const widgetDefaultConfig = {
    locale: currentLocale?.code ?? 'en',
    config: {
      headerProperty: {
        hideChatButton: true
      }
    }
  };

  const profileStore = useProfileStore();
  const { profile, isLoggedIn } = storeToRefs(profileStore);
  const profileSegments = computed(() => {
    const segmentsArr = profile.value?.segments.map(segment => segment.name);
    return segmentsArr?.length ? segmentsArr.join(', ') : null;
  })

  const bonusStore = useBonusStore();
  const { activePlayerBonuses, activePlayerFreeSpins } = storeToRefs(bonusStore);

  const setUserChatData = (): void => {
    const storeData = localStorage.getItem('restore');
    const storeRestoreList: { externalId: string, restoreId: string }[] = storeData ? JSON.parse(storeData) : [];
    const userRestore = storeRestoreList.find(restoreData => restoreData.externalId === profile.value?.id)?.restoreId;


    // window.fcWidgetMessengerConfig = {
    //   ...widgetDefaultConfig,
    //   externalId: profile.value?.id,
    //   restoreId: userRestore || null
    // };

    window.fcSettings = {
      onInit: function() {
        console.log(isLoggedIn.value);
        window.fcWidget.on("widget:destroyed", function() {
          console.log('inside destroyed');
          initChat();
        });

        if (isLoggedIn.value) {
          window.fcWidget.setExternalId(profile.value?.id);
          window.fcWidget.user.setProperties({
            firstName: profile.value?.firstName,
            lastName: profile.value?.lastName,
            email: profile.value?.email,
            cf_segments: profileSegments.value,
            cf_active_bonuses: `${!!(activePlayerBonuses.value?.length || activePlayerFreeSpins.value?.length)}`,
          });

          window.fcWidget.on('user:created', function({ status, data }:any) {
            if (status === 200 && data.restoreId) {
              const stringifyData = JSON.stringify(
                [...storeRestoreList, { externalId: profile.value?.id, restoreId: data.restoreId }]
              )
              localStorage.setItem('restore', stringifyData);
            }
          });
        }
      }
    };
  }
  const initChat = async ():Promise<void> => {
    console.log('inside');
    setUserChatData();

    // if (isLoggedIn.value) {
    //   setUserChatData();
    // } else {
    //   window.fcWidgetMessengerConfig = widgetDefaultConfig;
    // }

    if (!window.fcWidget) {
      const chatScript = document.createElement('script');
      chatScript.setAttribute('src', '//eu.fw-cdn.com/12575021/605032.js');
      chatScript.setAttribute('chat', 'false');
      document.body.append(chatScript);
    }

    console.log('window.fcWidget.isInitialized(): ', window.fcWidget?.isInitialized());
    if (window.fcWidget) {
      console.log('test test');
      window.fcWidget.init();
    }
  }

  const updateChat = async (): Promise<void> => {
    await clearUserChat();
    // await window.fcWidget.destroy();
    // initChat();
  }

  const clearUserChat = async ():Promise<void> => {
    try {
      await window.fcWidget.user.clear();
    } catch {
      window.fcWidget.destroy();
      console.error('User Chat Not cleared');
    }
  }

  return {
    initChat,
    updateChat
  }
}