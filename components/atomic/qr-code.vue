<template>
  <div ref="qrContainer" class="qr-code" />
</template>

<script setup lang="ts">
  import QRCode from 'qrcode';

  const props = defineProps<{
    qrAddress: string;
    width: number;
  }>();

  const qrContainer = ref<HTMLElement|null>(null);

  const qrCallback = (err:any, canvas: HTMLElement) => {
    if (err || !qrContainer.value) return;
    qrContainer.value.replaceChildren(canvas);
  }

  const createQR = () => {
    QRCode.toCanvas(props.qrAddress, { width: props.width }, qrCallback);
  }

  watch(() => props.qrAddress, () => {
    if (qrContainer.value) {
      createQR()
    };
  });

  onMounted(() => {
    createQR();
  })
</script>