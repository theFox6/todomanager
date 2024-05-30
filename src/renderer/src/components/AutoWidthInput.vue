<template>
  <span class="input-auto">
    <span class="backing">{{ (modelValue === "" ? $props.placeholder : modelValue).replaceAll(' ','|') }} </span>
    <input class="hidden-input" :value="modelValue"
           :placeholder="$props.placeholder"
           @input="$emit('update:modelValue', $event.target.value)"/>
  </span>
</template>

<script>
export default {
  name: "AutoWidthInput",
  props: {
    placeholder: {
      type: String,
      default: ""
    },
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.input-auto {
  display: inline-block;
  position: relative;
  margin-left: 2pt;
  margin-right: 2pt;
}
.backing {
  display: inline-block;
  padding-left: 1pt;
  padding-right: .5pt;
  visibility: hidden;
}
.hidden-input {
  display: inline-block;
  position: absolute;
  width: 100%;
  left: 0;
  top: -1px;
  border: none;
  color: inherit;
  text-shadow: inherit;
  font: inherit;
  background: inherit;
}
.hidden-input:hover, .hidden-input:focus, .hidden-input[value=""] {
  outline: none;
  border-bottom: 2px solid;
  padding-bottom: -3px;
  margin-bottom: 3px;
}
</style>