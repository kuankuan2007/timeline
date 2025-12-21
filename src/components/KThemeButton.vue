<template>
  <button class="theme-button clear" @click="changeToNextTheme">
    <k-icon :id="{
      auto: 'os-follow',
      light: 'light',
      dark: 'night',
    }[themeValue]!
      " class="theme-button-icon" />
  </button>
</template>
<script setup lang="ts">
import KIcon from './KIcon.vue';
import { themeValue, themeValueList } from '@/scripts/theme';
const DEBUG_CLICK_GAP = 3000;
const DEBUG_CLICK_NUM = 5;

const emit = defineEmits<{ showDebug: [] }>()
const clickHistory: number[] = []
function changeToNextTheme() {
  themeValue.value =
    themeValueList[(themeValueList.indexOf(themeValue.value) + 1) % themeValueList.length]!;
  while (clickHistory.length && clickHistory[0]! < Date.now() - DEBUG_CLICK_GAP) {
    clickHistory.shift()
  }
  clickHistory.push(Date.now())
  if (clickHistory.length >= DEBUG_CLICK_NUM) {
    emit('showDebug')
  }
}


</script>
<style scoped lang="scss">
@use '@/styles/theme' as *;
@use 'sass:color';

button.theme-button {
  position: fixed;
  top: 0;
  right: 0;
  appearance: none;
  all: unset;
  font-size: 2em;
  cursor: pointer;
  transition: 0.3s;
  padding: 0.1em;
  border: 0.1em solid transparent;
  border-radius: 0.3em;

  &:focus {
    @include useTheme {
      border-color: getTheme('active-color');
    }
  }

  &:hover {
    @include useTheme {
      color: getTheme('active-color');
    }
  }
}
</style>
