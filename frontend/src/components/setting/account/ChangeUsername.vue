<template>
    <div class="p-1">
        <form @submit.prevent="handleSubmit" class="ml-2 mr-2">
           <div class="form-group mt-2">
                <input class="form-control" name="email" v-model="form.email" placeholder="Enter Username" :class="{ 'is-invalid': submitted3 && v$.form.email.$error }" />
                <div v-if="submitted3 && v$.form.email.$error" class="invalid-feedback">
                    <span v-if="!v$.form.email.required">Email Is Required</span>
                    <!-- <span v-if="!v$.form.email.email">Please enter valid email</span> -->
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-success mt-2" type="submit">Change</button>
            </div>
        </form>
    </div>
</template>
<script>
import useValidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { post } from '../../../core/module/common.module'
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
export default {
  data () {
    return {
      v$: useValidate(),
      cookie$: cookies,
      form: {
        email: ''
      },
      submitted3: false
    }
  },
  validations: {
    form: {
      email: {required}
    }
  },
  mounted: function () {
    // this.getContacts()
    var userdata = JSON.parse(this.cookie$.get('userdata'))
    if (userdata.email !== undefined) {
      this.form.email = userdata.email
    }
  },
  methods: {
    handleSubmit (e) {
      this.submitted3 = true
      this.v$.$touch()
      if (this.v$.$invalid) {
        return
      }
      var request = {
        data: this.form,
        url: 'auth/username/update'
      }
      this.$store
        .dispatch(post, request)
        .then((response) => {
          if (response) {
            this.cookie.set('userdata', JSON.stringify(response.data), 30)
            this.$swal({
              icon: 'success',
              title: 'Success',
              text: 'Username updated successfully'
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
