<template>
  <div class="app-root">
    <button class="theme-button clear" @click="changeToNextTheme">
      <k-icon :id="{
        auto: 'os-follow',
        light: 'light',
        dark: 'night',
      }[themeValue]!
        " class="theme-button-icon" />
    </button>
    <div class="timeline-list">
      <div v-for="activity, index in activitys" :key="activity.name + '.' + activity.title" class="activity">

        <div class="timeline">
          <div class="time-tag"
            v-if="index && activitys[index - 1]?.dateStart.getMonth() !== activity.dateStart.getMonth()">
            <div class="month">{{ activity.dateStart.getMonth() + 1 }}月</div>
            <div class="time-tag-line"></div>
            <div class="year" :style="{
              opacity: index && activitys[index - 1]?.dateStart.getFullYear() !== activity.dateStart.getFullYear() ? 1 : 0
            }">{{ activity.dateStart.getFullYear() }}年</div>
          </div>
          <div class="before line"></div>
          <div class="ball"></div>
          <div class="after line"></div>
        </div>
        <div class="content">
          <p class="title-box"><span class="name">{{ activity.name }}</span>·<span class="title">{{ activity.title
              }}</span></p>
          <p class="date-city"><k-icon id="calendar" inline /> <span class="date">
              {{ dateToString(activity.dateStart) }} 至 {{ dateToString(activity.dateEnd) }} ({{ activity.duration()
              }}天)</span></p>
          <p class="address"><k-icon id="address" inline />{{ activity.address }}</p>
          <p v-if="activity.roomStatus" class="room-status">拼房：{{ roomStatueText[activity.roomStatus] }}</p>
          <div class="statue" :class="`statue-${activity.statue()}`">{{ statueText[activity.statue()] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import _activitys from './scripts/activitys';
import KIcon from './components/KIcon.vue';
import { Statue, statueText, roomStatueText } from './types/timeline';
import { themeValue, themeValueList } from './scripts/theme';
const activitys = ref(_activitys.toSorted((a, b) => b.dateStart.getTime() - a.dateStart.getTime()).map((activity) => ({
  ...activity,
  statue() {
    if (this.dateStart.getTime() > Date.now()) {
      return Statue.Plan;
    }
    if (this.dateEnd.getTime() > Date.now()) {
      return Statue.Ongoing;
    }
    return Statue.Ended;
  },
  duration() {
    return (this.dateEnd.getTime() - this.dateStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
  },
})));
function dateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
function changeToNextTheme() {
  themeValue.value =
    themeValueList[(themeValueList.indexOf(themeValue.value) + 1) % themeValueList.length]!;
}
</script>
<style scoped lang="scss">
@use '@/styles/theme.scss' as *;
@use 'sass:color';

button.theme-button {
  position: absolute;
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

.timeline-list {
  font-size: min(1rem, 2.5vmin);
  display: grid;

  grid-auto-columns: minmax(max-content, 30em);
  justify-content: center;


  .activity {

    position: relative;
    display: flex;

    column-gap: 1em;

    $timeline-width: 2em;



    .timeline {

      width: $timeline-width;
      position: relative;
      $size: 1em;
      $line-width: 0.3em;

      @include useTheme {
        $timeline-color: color.mix(getTheme('color'), getTheme('background'), 50%);

        .ball,
        .line,
        .time-tag-line {
          background-color: $timeline-color;
        }
      }

      .ball {
        width: $size;
        height: $size;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 9999999px;
        transform: translate(-50%, -50%);

      }

      .line {
        width: $line-width;
        height: 50%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);

      }

      .time-tag {
        position: absolute;

        transform: translate(-100%, -50%);

        left: 0.5 * $timeline-width;

        text-wrap: nowrap;
        white-space: nowrap;
        text-align: right;

        .time-tag-line {
          height: $line-width * 0.6;
          border-top-left-radius: 9999999px;
          border-bottom-left-radius: 9999999px;
        }

        .month,
        .year {
          padding-right: 0.5em;
        }
      }

      .before {
        top: 0;
      }

      .after {
        bottom: 0;
      }
    }

    .content {
      border-radius: 1em;
      margin: 1em 0;
      padding: 1em;
      flex: 1 1 auto;
      position: relative;

      @include useTheme {
        background: color.mix(getTheme('background'), getTheme('active-color'), 80%);
      }


      p {
        margin: 0.5em 0;

        &.title-box {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0;
        }

      }

      .statue {
        position: absolute;
        right: 0;
        bottom: 0;
        border-radius: 0.3em 0.3em 1em 0.3em;
        font-size: 0.8em;
        padding: 0.3em 1em;

        &.statue-plan {
          @include useTheme {
            background-color: color.mix(getTheme('active-color'), getTheme('background'), 50%);
          }
        }

        &.statue-ongoing {
          @include useTheme {
            background-color: color.mix(getTheme('strong-color'), getTheme('background'), 50%);
          }
        }

        &.statue-ended {
          @include useTheme {
            background-color: color.mix(getTheme('color'), getTheme('background'), 50%);
          }
        }
      }
    }
  }
}
</style>
