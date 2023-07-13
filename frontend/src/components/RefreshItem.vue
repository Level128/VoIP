<template>
  <div></div>
</template>

<script setup>
import PullToRefresh from 'pulltorefreshjs'
import { onMounted } from 'vue'

onMounted(() => PullToRefresh.init({
  mainElement: 'body',
  onRefresh () {
    window.location.reload()
  },
  distThreshold: 120,
  distMax: 140
}))

</script>
