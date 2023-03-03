<template>
  <svg viewBox="0 0 120 120">
    <circle
        class="filler-bar circle-bar"
        cx="60"
        cy="60"
        r="50"
        fill="none"
    />

    <circle
        class="progress-bar circle-bar"
        cx="60"
        cy="60"
        r="50"
        fill="none"
        :stroke="progressBarColor"
        :pathLength="maxValue"
        :stroke-dasharray="maxValue"
        :stroke-dashoffset="fillerOffset"
    />

    <circle
        v-if="statusColor"
        cx="60"
        cy="60"
        r="30"
        :fill="statusColor"
        stroke="none"
    />
  </svg>
</template>

<script>
export default {
  name: "ProgressCircle",
  props: {
    progressBarColor: {
      type: String,
      default: "#1B75BC",
    },
    percent: {
      type: Number,
      default: 0,
    },
    maxValue: {
      type: Number,
      default: 100
    },
    statusColor: {
      type: String,
      required: false
    }
  },
  computed: {
    fillerOffset() {
      return this.maxValue - this.renderedPercent;
    },
    renderedPercent() {
      return this.percent > this.maxValue ? this.maxValue : this.percent < 0 ? 0 : this.percent;
    },
  }
}
</script>

<style scoped>
svg {
  vertical-align: middle;
  transform: rotate(-90deg);
  width: 1.3em;
  height: 1.3em;
}
.filler-bar {
  stroke: rgba(0, 0, 0, 0.1);
}

.circle-bar {
  stroke-width: 25;
}
</style>