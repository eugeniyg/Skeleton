interface ILotteryState {
  lotteryDeclined: boolean;
  selectedLotteryId: string | undefined;
}

export const useLotteryStore = defineStore('lotteryStore', {
  state: (): ILotteryState => ({
    lotteryDeclined: false,
    selectedLotteryId: undefined,
  }),
})