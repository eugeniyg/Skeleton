interface ILotteryState {
  lotteryDeclined: boolean;
  selectedLotteryId: string | null;
}

export const useLotteryStore = defineStore('lotteryStore', {
  state: (): ILotteryState => ({
    lotteryDeclined: false,
    selectedLotteryId: null,
  }),
})