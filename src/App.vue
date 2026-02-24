<template>
  <div class="app-root">
    <k-theme-button @show-debug="showDebug = true" />
    <div class="timeline-list">
      <div
        v-for="(activity, index) in activitys"
        :key="activity.name + '.' + activity.title"
        class="activity"
        :class="[activity.statue()]"
      >
        <div class="timeline">
          <div
            class="time-tag"
            v-if="
              index && activitys[index - 1]?.dateStart.getMonth() !== activity.dateStart.getMonth()
            "
          >
            <div class="month">{{ activity.dateStart.getMonth() + 1 }}月</div>
            <div class="time-tag-line"></div>
            <div
              class="year"
              :style="{
                opacity:
                  index &&
                  activitys[index - 1]?.dateStart.getFullYear() !== activity.dateStart.getFullYear()
                    ? 1
                    : 0,
              }"
            >
              {{ activity.dateStart.getFullYear() }}年
            </div>
          </div>
          <div class="activity-line"></div>
          <div class="before line"></div>
          <div class="ball"></div>
          <div class="after line"></div>
        </div>
        <div class="content" tabindex="0">
          <h2 class="title-box">
            <span class="name">{{ activity.name }}</span
            >·<span class="title">{{ activity.title }}</span>
          </h2>

          <div class="detail">
            <p class="date-city">
              <k-icon id="calendar" inline />
              <span class="gap"></span>
              <span class="date">
                {{ dateToString(activity.dateStart) }}<span class="gap"></span>至<span
                  class="gap"
                ></span
                >{{ dateToString(activity.dateEnd) }}<span class="gap"></span>({{
                  activity.duration()
                }}天)</span
              >
            </p>
            <div class="address-box">
              <p class="city">
                <k-icon id="city" inline />
                <span class="gap"></span>

                <span v-if="activity.province">{{ activity.province }}·</span
                ><span v-if="activity.city">{{ activity.city }}</span>
              </p>
              <p class="address">
                <k-icon id="address" inline />
                <span class="gap"></span><span>{{ activity.address }}</span>
              </p>
            </div>
          </div>

          <div v-if="activity.plan && activity.statue() === Statue.Plan" class="plan">
            {{ roomStatueText[activity.plan] }}
          </div>

          <div class="statue" :class="`statue-${activity.statue()}`">
            {{ statueText[activity.statue()] }}
          </div>
        </div>
      </div>
    </div>
    <k-debug v-model:show="showDebug" />
  </div>
</template>
<script setup lang="ts" vapor>
import _activitys from './scripts/activitys';
import KIcon from './components/KIcon.vue';
import { Statue, statueText, roomStatueText } from './types/timeline';
import KDebug from './components/KDebug.vue';
import KThemeButton from './components/KThemeButton.vue';
const showDebug = ref(false);

const activitys = ref(
  _activitys
    .toSorted((a, b) => b.dateStart.getTime() - a.dateStart.getTime())
    .map((activity) => ({
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
    }))
);
function dateToString(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
</script>
<style scoped lang="scss">
@use '@/styles/theme.scss' as *;
@use 'sass:color';

.timeline-list {
  font-size: min(1rem, 2.5vmin);
  display: grid;

  grid-auto-columns: minmax(max-content, 30em);
  justify-content: center;

  span.gap {
    display: inline-block;
    width: 0.3em;
  }
  h2.title-box {
    margin: 0;
    font-size: 1.5em;
    font-weight: 700;
  }

  .activity {
    position: relative;
    display: flex;

    $column-gap: 1em;
    column-gap: $column-gap;

    $timeline-width: 2em;

    .timeline {
      width: $timeline-width;
      position: relative;
      $size: 1em;
      $line-width: 0.3em;

      @include useTheme {
        $timeline-color: color.mix(getTheme('color'), getTheme('background'), 50%);

        filter: drop-shadow(0 0 0.2em rgba(getTheme('color'), 0.3));

        .ball,
        .line,
        .time-tag-line,
        .activity-line {
          background-color: $timeline-color;
          border-color: $timeline-color;
        }
      }

      .ball {
        border: $size * 0.5 solid;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 9999999px;
        transform: translate(-50%, -50%);
      }

      .time-tag {
        position: absolute;

        transform: translate(-100%, -50%);

        left: 0.5 * $timeline-width;

        text-wrap: nowrap;
        white-space: nowrap;
        text-align: right;

        user-select: none;

        .time-tag-line {
          border: $line-width * 0.3 solid;
          border-top-left-radius: 9999999px;
          border-bottom-left-radius: 9999999px;
        }

        .month,
        .year {
          padding-right: 0.5em;
        }
      }

      .activity-line {
        width: $size + $column-gap;
        top: 50%;
        border: $line-width * 0.3 solid;
        position: absolute;
        left: 50%;
      }

      .line {
        border: $line-width * 0.5 solid;
        height: 50%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }

      .before {
        top: 0;
      }

      .after {
        bottom: 0;
      }
    }

    .content {
      overflow: hidden;
      border-radius: 1.5em;
      margin: 1em 0;
      padding: 1em;
      flex: 1 1 auto;
      position: relative;
      border: 0.1em solid;
      transition: 0.3s;

      @supports (corner-shape: squircle) {
        corner-shape: squircle;
        border-radius: 3em;
      }

      @include useTheme {
        background: color.mix(getTheme('background'), getTheme('active-color'), 85%);
        border-color: color.mix(getTheme('background'), getTheme('active-color'), 70%);
        filter: drop-shadow(
          0 0 0.3em rgba(color.mix(getTheme('background'), getTheme('active-color'), 70%), 0.5)
        );
      }

      &:hover,
      &:focus {
        @include useTheme {
          background: color.mix(getTheme('background'), getTheme('active-color'), 80%);
          border-color: color.mix(getTheme('background'), getTheme('active-color'), 60%);
          filter: drop-shadow(
            0 0 0.6em rgba(color.mix(getTheme('background'), getTheme('active-color'), 50%), 0.8)
          );
        }
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
        border-radius: 0.4em 0.4em 0 0.4em;
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

      .plan {
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0.4em 0 0.4em 0.4em;
        font-size: 0.8em;
        padding: 0.3em 1em;

        @include useTheme {
          background-color: rgba(color.mix(getTheme('color'), getTheme('background'), 50%), 0.3);
          box-shadow: 0 0 0.2em rgba(color.mix(getTheme('color'), getTheme('background'), 0%), 0.5);
        }
      }
    }
  }
}
</style>
