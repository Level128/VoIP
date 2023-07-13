<template>
    <div class="py-1 px-2">
        <form @submit.prevent="handleSubmitSipSetting" class="ml-2 mr-2">
          <div class="form-group mt-2">
            <label>Webhook URL</label>
            <input class="form-control main-url-control" name="main_url" v-model="state.form.main_url" readonly />
          </div>
          <div class="form-group mt-2">
            <label>Webhook Fallback URL</label>
            <input class="form-control" name="url" v-model="state.form.url" placeholder="Enter Twiml Fallback Url" :class="{ 'is-invalid': isFormSubmitted && v$.form.url.$error }" />
            <div v-if="isFormSubmitted && v$.form.url.$error" class="invalid-feedback">
                <span v-if="v$.form.url.required.$invalid">Twiml Fallback Url Is Required</span>
                <span v-if="v$.form.url.url.$invalid">Please enter valid Twiml Fallback Url</span>
                <!-- <span v-if="!v$.form.email.email">Please enter valid email</span> -->
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-success mt-2" type="submit">Update</button>
          </div>
        </form>
    </div>
</template>

<script setup>
import useValidate from '@vuelidate/core'
import { post } from '../../../../core/module/common.module'
import { required, helpers } from '@vuelidate/validators'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

// TODO: Test this component
// eslint-disable-next-line no-useless-escape
const url = helpers.regex('phonenumber', /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

const state = reactive({
  form: {
    url: '',
    main_url: ''
  }
})
const rules = () => {
  return {
    form: {
      url: { required, url }
    }
  }
}
const v$ = useValidate(rules, state)
const isFormSubmitted = ref(false)
const setting = ref(null)
const store = useStore()

onMounted(() => getCallSetting())

function getCallSetting () {
  const profileLocal = localStorage.getItem('activeProfile')
  if (profileLocal) {
    const activeProfile = JSON.parse(profileLocal)
    setting.value = activeProfile._id
    const request = {
      data: { setting_id: setting },
      url: 'setting/telnyx/sip/get'
    }
    store
      .dispatch(post, request)
      .then((response) => {
        state.form.main_url = response.data.data.webhook_event_url
        if (response.data.data.webhook_event_failover_url) {
          state.form.url = response.data.data.webhook_event_failover_url
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
}

function handleSubmitSipSetting (e) {
  isFormSubmitted.value = true
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  const formData = state.form
  formData.setting_id = setting
  const request = {
    data: formData,
    url: 'setting/telnyx/sip/fallback'
  }
  // eslint-disable-next-line no-undef
  store
    .dispatch(post, request)
    .then((data) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'SIP Setting updated successfully!'
        })
        getCallSetting()
      }
    })
    .catch((e) => {
      console.error(e)
    })
}
</script>

<style scoped>
  .main-url-control[readonly]{
    background: white !important;
  }
</style>
