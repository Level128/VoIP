<template>
  <div>
      <b-icon font-scale="1" icon="gear-fill" aria-hidden="true" class="m-2" title="Settings" style="cursor:pointer;" v-b-toggle.sidebar-email-setting></b-icon>
      <b-sidebar id="sidebar-email-setting" title="Settings" shadow backdrop>
          <div class="px-3 py-2" v-if="activeMenu == 'setting'">
            <ul class="list-group">
              <li class="list-group-item" @click="enableMenu('email')" style="cursor: pointer">
                <b-icon icon="envelope" font-scale="1" aria-hidden="true" class="mx-2"></b-icon>Email Settings</li>
              <!--<li class="list-group-item" @click="enableMenu('call')" style="cursor: pointer">
                <b-icon icon="telephone-x" font-scale="1" aria-hidden="true" class="mx-2"></b-icon>Call Settings</li> -->
              <li class="list-group-item" v-b-modal.modal-settings style="cursor: pointer">
                <b-icon icon="person-badge" font-scale="1" aria-hidden="true" class="mx-2"></b-icon>Profile Settings
              </li>
              <li class="list-group-item" @click="enableMenu('account')" style="cursor: pointer">
                <b-icon icon="person" font-scale="1" aria-hidden="true" class="mx-2"></b-icon>Account Settings
              </li>
              <li class="list-group-item" @click="passwordEnable('mfa')" style="cursor: pointer">
                <b-icon icon="shield-lock" font-scale="1" aria-hidden="true" class="mx-2"></b-icon>MFA Settings
              </li>
            </ul>
            <div class="version">{{ versionOption }}</div>
          </div>
          <div v-if="activeMenu == 'email'">
            <div class="d-flex justify-content-between">
              <div>
                <h4>Email Settings</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            <email-setting></email-setting>
          </div>

          <div v-if="activeMenu == 'call'">
            <div class="d-flex justify-content-between">
              <div class="p-2 bd-highlight">
                <h4>Call Settings</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            <call-setting></call-setting>
          </div>
          <div v-if="activeMenu == 'profile'">
            <div class="d-flex justify-content-between">
              <div class="p-2 bd-highlight">
                <h4>Profile Settings</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            Profile settings
          </div>

          <div v-if="activeMenu == 'account'">
            <div class="d-flex justify-content-between">
              <div class="p-2 bd-highlight">
                <h4>Account Settings</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            <div>
              <account-setting></account-setting>
            </div>
          </div>

          <div v-if="activeMenu == 'mfa'">
            <div class="d-flex justify-content-between">
              <div class="p-2 bd-highlight">
                <h4>MFA Settings</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            <div>
              <mfa />
            </div>
          </div>

          <div v-if="activeMenu == 'password'">
            <div class="d-flex justify-content-between">
              <div class="p-2 bd-highlight">
                <h4>Password Verification</h4>
              </div>
              <div class="p-2 bd-highlight">
                <b-icon icon="arrow-left" style="cursor: pointer" font-scale="2" aria-hidden="true" @click="enableMenu('setting')"></b-icon>
              </div>
            </div>
            <div  class="m-2">
              <div class="form-group">
                <label>Password</label>
                <input type="password" class="form-control" v-model="password" placeholder="Enter Password" @keyup.enter="checkPassword()">
              </div>
              <div class="text-center">
              <button class="btn btn-success my-2 px-4" @click="checkPassword()">Verify</button>
              </div>
            </div>
          </div>
      </b-sidebar>
  </div>
</template>

<script setup>
import EmailSetting from './EmailSetting.vue'
import CallSetting from './CallSetting.vue'
import AccountSetting from './account/AccountSetting.vue'
import Mfa from './security/Mfa.vue'
import { post } from '../../core/module/common.module'
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import Swal from 'sweetalert2'

const store = useStore()

const activeMenu = ref('setting')
const versionOption = ref('v0')
const checkpasswordMenu = ref('')
const password = ref('')

onMounted(() => getVersion())

function enableMenu (menu) {
  activeMenu.value = menu
}

function getVersion () {
  const request = {
    data: {},
    url: 'auth/get-version'
  }
  store
    .dispatch(post, request)
    .then((response) => {
      if (response) {
        versionOption.value = response.data
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

function passwordEnable (menu) {
  checkpasswordMenu.value = menu
  enableMenu('password')
}

function checkPassword () {
  if (password.value === '') {
    Swal.fire('Please enter a password', '', 'error')
    return
  }
  const request = {
    data: { password: password.value },
    url: 'auth/password/verify'
  }
  store
    .dispatch(post, request)
    .then((response) => {
      if (response) {
        password.value = ''
        enableMenu(checkpasswordMenu.value)
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

</script>
