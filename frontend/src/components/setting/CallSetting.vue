<template>
    <div>
      <div v-if="setting && setting.type === 'twilio'">
        <!-- <twilio-setting></twilio-setting> -->
        <twiml-setting></twiml-setting>
      </div>
      <div v-if="setting && setting.type === 'telnyx'">
        <message-setting></message-setting>
      </div>
    </div>
</template>

<script setup>
// import TwilioSetting from './call/twilio/TwilioSetting.vue'
// import TelnyxSetting from './call/telnyx/TelnyxSetting.vue'
import { EventBus } from '@/event-bus'
import MessageSetting from './call/telnyx/MessageSetting.vue'
import TwimlSetting from './call/twilio/TwimlSetting.vue'
import { onMounted, reactive } from 'vue'

// TODO: Test this component
const setting = reactive({})
// const activeMenu = ref('setting')

onMounted(() => {
  console.log('load data')
  EventBus.$on('changeProfile', getCallSetting)
  getCallSetting()
})

function getCallSetting () {
  // const profileLocal = localStorage.getItem('activeProfile')
  const profileLocal = JSON.parse(localStorage.getItem('activeProfile'))
  // console.log(profileLocal)
  if (profileLocal) {
    // const activeProfile = JSON.parse(profileLocal)
    setting.value = profileLocal
  }
}

// function enableMenu (menu) {
//   activeMenu.value = menu
// }
</script>
