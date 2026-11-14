<template>
  <div class="app-root">
    <client-only>
      <k-theme-button @show-debug="showDebug = true" />
    </client-only>
    <main class="timeline-list">
      <ol class="activity-list">
        <li
          v-for="(activity, index) in activitys"
          :key="activity.name + '.' + activity.title + '.' + activity.dateStart.toISOString()"
          class="activity"
          :class="[activity.statue()]"
        >
          <div class="timeline" aria-hidden="true">
            <div
              class="time-tag"
              v-if="
                index &&
                activitys[index - 1] &&
                activityDate(activitys[index - 1].dateStart).getUTCMonth() !==
                  activityDate(activity.dateStart).getUTCMonth()
              "
              :class="{
                'show-year':
                  index &&
                  activitys[index - 1] &&
                  activityDate(activitys[index - 1].dateStart).getUTCFullYear() !==
                    activityDate(activity.dateStart).getUTCFullYear(),
              }"
            >
              <div class="month">{{ activityDate(activity.dateStart).getUTCMonth() + 1 }}月</div>
              <div class="time-tag-line"></div>
              <div class="year">{{ activityDate(activity.dateStart).getUTCFullYear() }}年</div>
            </div>
            <div class="activity-line"></div>
            <div class="before line"></div>
            <div class="ball"></div>
            <div class="after line"></div>
          </div>
          <article class="content" tabindex="0">
            <h2 class="title-box">
              <span class="name">{{ activity.name }}</span
              >·<span class="title">{{ activity.title }}</span>
            </h2>

            <div class="detail">
              <p class="date-city">
                <k-icon id="calendar" inline />
                <span class="gap"></span>
                <span class="date">
                  <time :datetime="dateToString(activity.dateStart)">{{
                    dateToString(activity.dateStart)
                  }}</time
                  ><span class="gap"></span>至<span class="gap"></span
                  ><time :datetime="dateToString(activity.dateEnd)">{{
                    dateToString(activity.dateEnd)
                  }}</time
                  ><span class="gap"></span>({{ activity.duration() }}天)</span
                >
              </p>
              <address class="address-box">
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
              </address>
            </div>

            <div
              v-if="activity.plan && activity.statue() === Statue.Plan"
              class="plan"
              aria-label="计划: {{ roomStatueText[activity.plan] }}"
            >
              {{ roomStatueText[activity.plan] }}
            </div>

            <div
              class="statue"
              :class="`statue-${activity.statue()}`"
              aria-label="状态: {{ statueText[activity.statue()] }}"
            >
              {{ statueText[activity.statue()] }}
            </div>
          </article>
        </li>
      </ol>
    </main>
    <client-only>
      <k-debug v-model:show="showDebug" />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import _activitys from './scripts/activitys';
import KIcon from './components/KIcon.vue';
import { Statue, statueText, roomStatueText } from './types/timeline';
import { defineAsyncComponent, inject, onMounted } from 'vue';
const KDebug = defineAsyncComponent(() => import('./components/KDebug.vue'));
const KThemeButton = defineAsyncComponent(() => import('./components/KThemeButton.vue'));
const showDebug = ref(false);
const renderTime = ref(inject<number>('renderTime') ?? Date.now());
onMounted(() => {
  renderTime.value = Date.now();
});

const activitys = ref(
  _activitys
    .toSorted((a, b) => b.dateStart.getTime() - a.dateStart.getTime())
    .map((activity) => ({
      ...activity,
      statue() {
        if (this.dateStart.getTime() > renderTime.value) {
          return Statue.Plan;
        }
        if (this.dateEnd.getTime() > renderTime.value) {
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
  const localDate = activityDate(date);
  return `${localDate.getUTCFullYear()}-${localDate.getUTCMonth() + 1}-${localDate.getUTCDate()}`;
}
function activityDate(date: Date) {
  return new Date(date.getTime() + 8 * 60 * 60 * 1000);
}
</script>
<style scoped lang="scss">
@use '@/styles/theme.scss' as *;

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
  .activity-list {
    padding: 0;
    margin: 0;
    .activity {
      position: relative;
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;

      $column-gap: 1em;
      column-gap: $column-gap;

      $timeline-width: 2em;

      .timeline {
        width: $timeline-width;
        position: relative;
        $size: 1em;
        $line-width: 0.3em;

        @include theme.use {
          $timeline-color: color.mix(theme.get('color'), theme.get('background'), 50%);

          filter: drop-shadow(0 0 0.2em rgba(theme.get('color'), 0.3));

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
          .year {
            opacity: 0;
          }
          &.show-year {
            .year {
              opacity: 1;
            }
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
        @include motion.transition(0.3s);

        @supports (corner-shape: squircle) {
          corner-shape: squircle;
          border-radius: 3em;
        }

        @include theme.use {
          background: color.mix(theme.get('background'), theme.get('active-color'), 85%);
          border-color: color.mix(theme.get('background'), theme.get('active-color'), 70%);
          filter: drop-shadow(
            0 0 0.3em rgba(color.mix(theme.get('background'), theme.get('active-color'), 70%), 0.5)
          );
        }

        &:hover,
        &:focus {
          @include theme.use {
            background: color.mix(theme.get('background'), theme.get('active-color'), 80%);
            border-color: color.mix(theme.get('background'), theme.get('active-color'), 60%);
            filter: drop-shadow(
              0 0 0.6em
                rgba(color.mix(theme.get('background'), theme.get('active-color'), 50%), 0.8)
            );
          }
        }
        address {
          font-style: normal;
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
            @include theme.use {
              background-color: color.mix(theme.get('active-color'), theme.get('background'), 50%);
            }
          }

          &.statue-ongoing {
            @include theme.use {
              background-color: color.mix(theme.get('strong-color'), theme.get('background'), 50%);
            }
          }

          &.statue-ended {
            @include theme.use {
              background-color: color.mix(theme.get('color'), theme.get('background'), 30%);
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

          @include theme.use {
            background-color: rgba(
              color.mix(theme.get('color'), theme.get('background'), 50%),
              0.3
            );
            box-shadow: 0 0 0.2em
              rgba(color.mix(theme.get('color'), theme.get('background'), 0%), 0.5);
          }
        }
      }
    }
  }
}
</style>
