<template>
  <div id="app">
    <span v-if="oldVersion" class="update_ribbon"><a
        href="https://github.com/0perationPrivacy/VoIP/blob/main/CHANGELOG.md" target="_blank"
        rel="noopener noreferrer">update</a></span>
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { get } from './core/module/common.module'
import { useStore } from 'vuex'

const store = useStore()
const oldVersion = ref(false)

onMounted(() => getVersion())

function getVersion () {
  const request = {
    url: 'auth/get-update-version'
  }
  store
    .dispatch(get, request)
    .then((response) => {
      oldVersion.value = response.update === 'true'
    })
    .catch((e) => {
      oldVersion.value = false
      console.error(e)
    })
}
</script>
