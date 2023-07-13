<template>
  <div id="app">
    <span v-if="oldVersion" class="update_ribbon"
      ><a
        href="https://github.com/0perationPrivacy/VoIP/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener noreferrer"
        >update</a
      ></span
    >
    <RouterView />
  </div>
</template>

<script setup>
import { get } from './core/module/common.module'

const oldVersion

export default {
  name: 'App',
  data () {
    return {
      oldVersion: false,
      dir: ''
    }
  },
  mounted () {
    this.getVersion()
    // this.checkDirectoryName()
  },
  methods: {
    getVersion () {
      const request = {
        url: 'auth/get-update-version'
      }
      this.$store
        .dispatch(get, request)
        .then((response) => {
          // console.log(response.update)
          if (response.update === 'true') {
            this.oldVersion = true
          } else {
            this.oldVersion = false
          }
        })
        .catch((e) => {
          this.oldVersion = false
          console.log(e)
          // resolve(false)
        })
    }
  }
}
</script>
