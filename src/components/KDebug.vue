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
<script setup lang="ts" vapor>
import { show as showBuildInfo } from 'visual:k-build-info';
import KIcon from './KIcon.vue';
const show = defineModel<boolean>("show")
</script>
<style scoped lang="scss">
@use '@/styles/theme' as *;


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

  @include theme.use {
    background: rgba(theme.get("background"), 0.8);
    backdrop-filter: blur(0.2em);
    border-color: color.mix(theme.get("background"), theme.get("color"), 50%);
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

    @include theme.use {
      background-color: color.mix(theme.get('active-color'), theme.get('background'), 10%);
      color: theme.get('color');

      @media print {
        border-color: theme.get('color');
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

      @include theme.use {
        background: color.mix(theme.get('background'), theme.get('active-color'), 50%);
      }
    }

    &:hover,
    &:focus {
      @include theme.use {
        background: color.mix(theme.get('background'), theme.get('active-color'), 60%);
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

    @include theme.use {
      color: theme.get('color');
      border-color: theme.get('color');
    }

    &:hover,
    &:active,
    &:focus {
      @include theme.use {
        color: theme.get('active-color');
        border-color: theme.get('active-color');
      }
    }
  }
}
</style>
