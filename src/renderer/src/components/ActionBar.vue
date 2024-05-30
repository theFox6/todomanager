<template>
  <span>
    <button class="action-button" @click="exportData"><font-awesome-icon icon="file-export" /> export data<a ref="dl" /></button>
  </span>
</template>

<script>
export default {
  name: "ActionBar",
  methods: {
    exportData() {
      const dataStr = JSON.stringify(this.$store.getters.dataString);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'ToDoManager_export_' + this.getDateString() + '.json';
      const linkElement = this.$refs.dl;
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      /* this could probably be done via ipc message
      const {dialog} = require('electron').remote;
      var fs = require('fs');
      dialog.showSaveDialog(null, options).then(({ filePath }) => {
        fs.writeFileSync(filePath, "hello world", 'utf-8');
      });
       */
    },
    getDateString() {
      const date = new Date(Date.now())
      const pad = (n) => n.toString().padStart(2, '0')
      return date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) +
          "_" + pad(date.getHours()) + pad(date.getMinutes())
    }
  }
}
</script>

<style scoped>
.action-button {
  border: ridge #B7B7A4;
  padding: 1pt 1em;
  margin-left: 0.5em;
  font-size: medium;
}
</style>