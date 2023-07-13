<template>
    <div class="p-1">
        <form @submit.prevent="handleSubmitUsernameChange" class="ml-2 mr-2">
           <div class="form-group mt-2">
                <input class="form-control" name="email" v-model="state.form.email" placeholder="Enter Username" :class="{ 'is-invalid': submitted && v$.form.email.$error }" />
                <div v-if="submitted && v$.form.email.$error" class="invalid-feedback">
                    <span v-if="v$.form.email.required.$invalid">Email/Username is Required</span>
                    <!-- <span v-if="!v$.form.email.email">Please enter valid email</span> -->
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
import { required } from '@vuelidate/validators'
import { post } from '../../../core/module/common.module'
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useCookies } from 'vue3-cookies'
import Swal from 'sweetalert2'

const rules = () => {
  return {
    form: {
      email: { required }
    }
  }
}
const state = reactive({
  form: {
    email: ''
  }
})

const v$ = useValidate(rules, state)
const store = useStore()
const { cookies } = useCookies()
const submitted = ref(false)

onMounted(() => {
  // this.getContacts()
  const userData = cookies.get('userdata')
  if (userData.email !== undefined) {
    state.form.email = userData.email
  }
})

function handleSubmitUsernameChange (e) {
  submitted.value = true
  v$.value.$touch()
  if (v$.value.$invalid) {
    return
  }
  const request = {
    data: state.form,
    url: 'auth/username/update'
  }
  store
    .dispatch(post, request)
    .then((response) => {
      if (response) {
        cookies.set('userdata', JSON.stringify(response.data), 60 * 60 * 24)
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Username updated successfully'
        })
      }
    })
    .catch((e) => {
      console.error(e)
    })
}
</script>
