<template>
  <div class="lottery-tickets-types">
    <div class="lottery-tickets-types__title">{{ title }}</div>
    <div v-if="description" class="lottery-tickets-types__description" v-html="description"/>
    
    <div v-if="sortedTickets?.length" class="lottery-tickets-types__tickets">
      <lottery-ticket
        v-for="(ticket, index) in sortedTickets"
        v-bind="ticket"
        :index
        :type="index <= 2 ? 'vertical' : 'horizontal'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { ILotteryPage } from "~/types";
  import { getContent } from "#imports";
  import DOMPurify from "isomorphic-dompurify";
  import { marked } from "marked";
  
  const lotteryContent = ref<Maybe<ILotteryPage>>(inject('lotteryContent'));
  const defaultLocaleLotteryContent = ref<Maybe<ILotteryPage>>(inject('defaultLocaleLotteryContent'));
  
  const title = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'ticketsTypes.title'));
  
  const description = computed(() => {
    const contentText = getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'ticketsTypes.description');
    if (!contentText) return '';
    return DOMPurify.sanitize(marked.parseInline(contentText) as string, { FORBID_TAGS: ['style'] });
  });
  
  const tickets = computed(() => getContent(lotteryContent.value, defaultLocaleLotteryContent.value, 'ticketsTypes.items') || []);
  
  const sortByAmountDesc = (items: ILotteryPage['ticketsTypes']['items'] = []) =>
    [...items].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  
  const sortedTickets = ref<ILotteryPage['ticketsTypes']['items']>([]);
  
  watch(
    tickets,
    newValue => sortedTickets.value = sortByAmountDesc(newValue),
    { immediate: true }
  );


</script>

<style src="~/assets/styles/components/lottery/tickets-types.scss" lang="scss"/>
