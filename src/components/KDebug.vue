<template>
  <div class="build-info" :class="{ show }">
    <div class="build-info-list">
      <component v-for="info in showBuildInfo" :key="info.title" :is="info.url ? 'a' : 'div'" :href="info.url"
        target="_blank" class="build-info-item" tabindex="-1">
        <div class="title">{{ info.title }}</div>
        <div class="content">{{ info.content }}</div>
        <k-icon v-if="info.url" id="link" class="link-icon" />
      </component>
    </div>
    <div class="close-button-box"><button class="close-button" @click="show = false" tabindex="-1"><k-icon
          id="cross" /></button></div>
  </div>
</template>
<script setup lang="ts">
import { show as showBuildInfo } from 'visual:k-build-info';
import KIcon from './KIcon.vue';
const show = defineModel<boolean>("show")
</script>
<style scoped lang="scss">
@use '@/styles/theme' as *;
@use 'sass:color';

.build-info {
  position: fixed;
  left: 1em;
  bottom: 1em;
  font-size: min(2vw, 1em);
  width: 40em;
  padding: 1em;
  pointer-events: none;
  border-radius: 2em;
  border: solid 0.1em transparent;
  display: none;

  &.show {
    display: block;
  }

  @include useTheme {
    background: rgba(getTheme("background"), 0.8);
    backdrop-filter: blur(0.2em);
    border-color: color.mix(getTheme("background"), getTheme("color"), 50%);
    pointer-events: all;

  }
}

.build-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  $size: 8em;
  grid-template-columns: repeat(auto-fit, $size);
  grid-auto-rows: $size;
  gap: 1em;
  padding: 1em;

  .build-info-item {
    text-decoration: none;
    border: 0.1em solid transparent;
    display: flex;
    border-radius: 1em;
    padding: 1em;
    flex-direction: column;
    row-gap: 1em;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;

    @include useTheme {
      background-color: color.mix(getTheme('active-color'), getTheme('background'), 10%);
      color: getTheme('color');

      @media print {
        border-color: getTheme('color');
      }
    }

    .title {
      text-align: center;
      font-size: 1.2em;
      font-weight: bold;
    }

    .content {
      flex: 1 0 auto;
      white-space: pre;
      text-align: center;
    }

    .link-icon {
      position: absolute;
      top: 0;
      right: 0;
      padding: 0.1em 0.5em;
      border-radius: 0.3em;

      @include useTheme {
        background: color.mix(getTheme('background'), getTheme('active-color'), 50%);
      }
    }

    &:hover,
    &:focus {
      @include useTheme {
        background: color.mix(getTheme('background'), getTheme('active-color'), 60%);
      }
    }
  }
}

.close-button-box {
  position: absolute;
  top: 0.8em;
  right: 0.8em;
  transition: color 0.3s;
  z-index: 1;

  button.close-button {
    background: transparent;
    outline: none;
    border: 0.1em solid transparent;
    padding: 0.15em;
    margin: 0;
    border-radius: 0.3em;
    cursor: pointer;

    @include useTheme {
      color: getTheme('color');
      border-color: getTheme('color');
    }

    &:hover,
    &:active,
    &:focus {
      @include useTheme {
        color: getTheme('active-color');
        border-color: getTheme('active-color');
      }
    }
  }
}
</style>
