<template>
    <div class="py-1 px-2">
        <form @submit.prevent="handleSubmit" class="ml-2 mr-2">
          <div class="form-group mt-2">
            <label>Webhook URL</label>
            <input class="form-control main-url-control" name="main_url" v-model="state.form.main_url" readonly />
          </div>
          <div class="form-group mt-2">
            <label>Webhook Fallback URL</label>
            <input class="form-control" name="url" v-model="state.form.url" placeholder="Enter Webhook Fallback URL" :class="{ 'is-invalid': isFormSubmitted && v$.form.url.$error }" />
            <div v-if="isFormSubmitted && v$.form.url.$error" class="invalid-feedback">
                <span v-if="!v$.form.url.required.$invalid">URL is required</span>
                <span v-if="!v$.form.url.url.$invalid">Please enter valid URL</span>
                <!-- <span v-if="!v$.form.email.email.$invalid">Please enter valid email</span> -->
            </div>
          </div>
          <div class="form-group">
            <button class="btn btn-success mt-2" type="submit">Update</button>
          </div>
        </form>
    </div>
</template>

<script setup>
import { post } from '../../../../core/module/common.module'
import useValidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

// TODO: Test this component
// eslint-disable-next-line no-useless-escape
const url = helpers.regex('phonenumber', /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)

const rules = () => {
  return {
    form: {
      url: { required, url }
    }
  }
}
const state = reactive({
  form: {
    url: '',
    main_url: ''
  }
})
const v$ = useValidate(rules, state)
const store = useStore()

const isFormSubmitted = ref(false)
const setting = ref(false)

onMounted(() => getCallSetting)

function getCallSetting () {
  const profileLocal = localStorage.getItem('activeProfile')
  if (profileLocal) {
    const activeProfile = JSON.parse(profileLocal)
    setting.value = activeProfile._id
    const request = {
      data: { setting_id: setting },
      url: 'setting/telnyx/twiml/get'
    }
    store
      .dispatch(post, request)
      .then((response) => {
        state.form.main_url = response.data.data.voice_url
        if (response.data.data.voice_fallback_url) {
          state.form.url = response.data.data.voice_fallback_url
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
    url: 'setting/telnyx/twiml/fallback'
  }
  store
    .dispatch(post, request)
    .then((data) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'TeXML Setting updated successfully!'
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
