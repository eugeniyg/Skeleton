<template>
  <button
    ref="tooltip"
    class="tooltip"
    :class="{'is-show': isShow}"
    @click="show"
    @mouseover="show"
    @mouseleave="hide"
    @focusout="hide"
  >
    <slot/>
    <atomic-icon :id="props.icon" />

    <Teleport to="body">
      <div
        ref="tooltipMsg"
        class="tooltip__message"
        :class="[messageCustomClass, {'is-active': isShow}, `size-${props.size}`]"
        :style="`top: ${coords.top}px; left: ${coords.left}px`"
      >
        <div v-if="props.title" class="title">{{ props.title }}</div>
        <div v-if="props.text" class="text" v-html="DOMPurify.sanitize(props.text || '', { FORBID_TAGS: ['style'] })" />
      </div>
    </Teleport>
  </button>
</template>

<script setup lang="ts">
  import DOMPurify from "isomorphic-dompurify";

  const props = defineProps({
    icon: {
      type: String,
      default: 'info',
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    align: {
      validator: (val: string | null) => ['bottom', null].includes(val),
      default: null,
    },
    messageCustomClass: {
      type: String
    },
    size: {
      validator: (val: string) => ['small', 'large'].includes(val),
      default: 'large'
    }
  });

  const coords = reactive({
    top: 0,
    left: 0,
  });

  const tooltip = ref<HTMLElement>();
  const tooltipMsg = ref<HTMLElement>();
  const isShow = ref<boolean>(false);

  const getTooltipParent = () => tooltip.value?.closest('[data-tooltip-parent]');

  const setCoords = () => {
    const parent = getTooltipParent();
    const pRect = parent?.getBoundingClientRect();
    const tRect = tooltip.value?.getBoundingClientRect();
    const mRect = tooltipMsg.value?.getBoundingClientRect();

    if (parent && pRect && tRect && mRect) {
      const lockLeft = pRect.x - tRect.width / 2 >= tRect.x - mRect.width / 2;
      const lockRight = pRect.x - tRect.width / 2 + pRect.width - mRect.width / 2 <= tRect.x;

      if (lockLeft) {
        coords.left = pRect.x;
      } else if (lockRight) {
        coords.left = (pRect.x + pRect.width) - (mRect.width);
      } else {
        coords.left = (tRect.x + tRect.width) - mRect.width / 2;
      }

      if (props.align === 'bottom') {
        coords.top = tRect.top + tRect.height + (tRect.height / 2) + mRect.height;
      } else {
        coords.top = tRect.top;
      }
    }
  };

  const show = () => {
    setCoords();
    isShow.value = true;
  };

  const hide = () => {
    isShow.value = false;
  };

  onMounted(async () => {
    await nextTick();
    const scrollParent = getTooltipParent();
    if (scrollParent) scrollParent.addEventListener('scroll', hide);
    document.addEventListener('scroll', hide);
  });

  onBeforeUnmount(() => {
    const scrollParent = getTooltipParent();
    if (scrollParent) scrollParent.removeEventListener('scroll', hide);
    document.removeEventListener('scroll', hide);
  });
</script>

<style src="~/assets/styles/components/atomic/tooltip.scss" lang="scss" />
