<template>
    <div class="p-1">
        <form @submit.prevent="handleSubmitPasswordChange" class="ml-2 mr-2">
          <div class="form-group mb-2 mt-4">
            <input class="form-control" v-model="state.oldPassword" name="password" type="password" placeholder="Old Password" :class="{ 'is-invalid': submitted && v$.oldPassword.$error }">
            <div v-if="submitted && v$.oldPassword.$error" class="invalid-feedback">
                <span v-if="!v$.oldPassword.required.$invalid">old Password is required</span>
            </div>
          </div>

          <div class="form-group mb-2 mt-4">
            <input class="form-control" v-model="state.newPassword"  type="password" placeholder="New Password" id="login-input" :class="{ 'is-invalid': submitted && v$.newPassword.$error }">
            <div v-if="submitted && v$.newPassword.$error" class="invalid-feedback">
                <span v-if="!v$.newPassword.required.$invalid">Password is required</span>
                <span v-if="!v$.newPassword.minLength.$invalid">Please enter a valid password</span>
            </div>
          </div>
              <div class="form-group mb-2 mt-2">
                <input class="form-control" v-model="state.newPasswordConfirm"  type="password" placeholder="Confirm Password" id="clogin-input" :class="{ 'is-invalid': submitted && v$.newPasswordConfirm.$error }">
                <div v-if="submitted && v$.newPasswordConfirm.$error" class="invalid-feedback">
                    <span v-if="!v$.newPasswordConfirm.required.$invalid">Confirm Password is required<br></span>
                    <span v-if="!v$.newPasswordConfirm.sameAsPassword.$invalid">Password and confirm password are not match!</span>
                </div>
              </div>
            <div class="form-group">
                <button class="btn btn-success mt-2" type="submit">Change</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import useValidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { post } from '../../../core/module/common.module'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

const store = useStore()
const state = reactive({
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: ''
})
const rules = () => {
  return {
    oldPassword: { required },
    newPassword: { required, minLength: minLength(6) },
    newPasswordConfirm: { required, sameAsPassword: sameAs(state.newPassword), $autoDirty: true }
  }
}
const v$ = useValidate(rules, state)

const submitted = ref(false)

async function handleSubmitPasswordChange (e) {
  submitted.value = true
  console.log(v$.value.$touch())
  const request = {
    data: state,
    url: 'auth/password/update'
  }
  store
    .dispatch(post, request)
    .then((response) => {
      if (response) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password updated successfully'
        })
        submitted.value = false
        state.newPassword = ''
        state.newPasswordConfirm = ''
      }
      // cookies.set('userdata', JSON.stringify(response.data), 60*60*24)
    })
    .catch((e) => {
      console.error(e)
    })
}

</script>
