<template>
  <span class="icon" :class="{ inline }" aria-hidden="true">{{ String.fromCharCode(fontelloData[id]!) }}</span>
</template>
<script setup lang="ts">
import fontelloData from '@/assets/fontello/data';
defineProps({
  id: {
    required: true,
    type: String,
  },
  inline: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
@use '@/assets/fontello/fontello.scss';
:root span.icon {
  @include fontello.fontello;
  user-select: none;
  display: block;
  width: 1em;
  height: 1em;
  line-height: 1em;
  &.inline {
    display: inline;
  }
}
</style>
