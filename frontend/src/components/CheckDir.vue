<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { post } from '../core/module/common.module'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

onMounted(() => checkDirectoryName())

function checkDirectoryName () {
  const request = {
    url: 'auth/check-directoryname',
    data: { dirname: route.params.appdirectory }
  }
  store
    .dispatch(post, request)
    .then((response) => {
      // check against the backend to see if we are using the correct APPDIRECTORY
      // this is applied client-side, so could this be evaded manually changing it?
      if (response.data.status === 'false') {
        router.push('/404')
      } else {
        router.push(`/${route.params.appdirectory}/dashboard`)
      }
    })
    .catch((e) => {
      this.old_version = false
      console.error(e)
    })
}
</script>
