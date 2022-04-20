<template>
  <span class="input-auto">
    <span class="backing">{{(modelValue === "" ? $props.placeholder : modelValue).replaceAll(' ','|')}} </span>
    <input class="hidden-input" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
           :placeholder="$props.placeholder"/>
  </span>
</template>

<script>
export default {
  name: "AutoWidthInput",
  props: {
    placeholder: String,
    modelValue: String
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.input-auto {
  display: inline-block;
  position: relative;
}
.backing {
  display: inline-block;
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