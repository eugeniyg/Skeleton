interface ILotteryState {
  selectedLotteryId: string | undefined;
  isLotteryUpdating: boolean;
}

export const useLotteryStore = defineStore('lotteryStore', {
  state: (): ILotteryState => ({
    selectedLotteryId: undefined,
    isLotteryUpdating: false,
  }),
})