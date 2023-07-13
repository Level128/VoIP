<template>
    <div class="py-1 px-2">
        <form @submit.prevent="handleSubmit" class="ml-2 mr-2">
          <div class="form-group mt-2">
            <label>A CALL COMES IN</label>
            <input class="form-control main-url-control" name="voice_main_url" v-model="state.form.voice_main_url" readonly />
          </div>
          <div class="form-group mt-2">
            <label>CALL HANDLER FAILS</label>
            <input class="form-control" name="url" v-model="state.form.voice_url" placeholder="Enter Twiml Fallback Url" :class="{ 'is-invalid': isFormSubmitted && v$.form.voice_url.$error }" />
            <div v-if="isFormSubmitted && v$.form.voice_url.$error" class="invalid-feedback">
                <span v-if="v$.form.voice_url.required.$error">URL is required</span>
                <span v-if="v$.form.voice_url.url.$invalid">Please enter valid Url</span>
                <!-- <span v-if="!v$.form.email.email">Please enter valid email</span> -->
            </div>
          </div>

          <div class="form-group mt-2">
            <label>A MESSAGE COMES IN</label>
            <input class="form-control main-url-control" name="sms_main_url" v-model="state.form.sms_main_url" readonly />
          </div>
          <div class="form-group mt-2">
            <label>MESSAGE HANDLER FAILS</label>
            <input class="form-control" name="sms_url" v-model="state.form.sms_url" placeholder="Enter Twiml Fallback Url" :class="{ 'is-invalid': isFormSubmitted && v$.form.sms_url.$error }" />
            <div v-if="isFormSubmitted && v$.form.sms_url.$error" class="invalid-feedback">
                <span v-if="v$.form.sms_url.required.$error">URL is required</span>
                <span v-if="v$.form.sms_url.url.$invalid">Please enter valid URL</span>
                <!-- <span v-if="v$.form.email.email.$invalid">Please enter valid email</span> -->
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
// eslint-disable-next-line no-useless-escape
const url = helpers.regex('phonenumber', /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

const state = reactive({
  form: {
    voice_url: '',
    voice_main_url: '',
    sms_url: '',
    sms_main_url: ''
  }
})
const rules = () => {
  return {
    form: {
      voice_url: { required, url },
      sms_url: { required, url }
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
      url: 'setting/twilio/number/get'
    }
    store
      .dispatch(post, request)
      .then((response) => {
        state.form.voice_main_url = response.data.voiceUrl
        state.form.sms_main_url = response.data.smsUrl
        if (response.data.voiceFallbackUrl) {
          state.form.voice_url = response.data.voiceFallbackUrl
        }
        if (response.data.smsFallbackUrl) {
          state.form.sms_url = response.data.smsFallbackUrl
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }
}

function handleSubmit (e) {
  isFormSubmitted.value = true
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  const formData = state.form
  formData.setting_id = setting
  const request = {
    data: formData,
    url: 'setting/twilio/number/fallback'
  }
  // eslint-disable-next-line no-undef
  store
    .dispatch(post, request)
    .then((data) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Number Setting updated successfully!'
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
