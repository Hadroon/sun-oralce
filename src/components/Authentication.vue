<template>
  <div class="auth">
    <div class="reg">
      <h2>Regisztráció</h2>
      <p v-if="errors.length">
        <ul class="errorFormat">
          <li v-for="error in errors" :key="error.id">{{ error }}</li>
        </ul>
      </p>
      <p v-if="infos.length">
        <ul class="infoFormat">
          <li v-for="info in infos" :key="info.id">{{ info }}</li>
        </ul>
      </p>
      <form @submit="postRegistration" action="" method="post">
        <fieldset :disabled="formDisabled">
          <div class="formrow">
            <div class="float-20">
              <span class="form-label">Vezetéknév:</span>
            </div>
            <div class="float-30">
              <input class="authInput" v-model="newUser.lastName" type="text" name="lastname" required>
            </div>
            <div class="float-20">
              <span class="padding-left-10 form-label">Keresztnév:</span>
            </div>
            <div class="float-30">
              <input class="authInput" size type="text" v-model="newUser.firstName" name="firstName" required>
            </div>
          </div>
          <div class="formrow">
            <div class="float-20" style="width: 115px;">
              <span class="form-label">Irányítószám:</span>
            </div>
            <div class="float-30" style="width: 79px;">
              <input class="authInput" v-mask="'####'" type="text" v-model="newUser.zip" name="zip" required>
            </div>
            <div class="float-20" style="width: 117px;">
              <span class="padding-left-10 form-label">Születési év:</span>
            </div>
            <div class="float-30" style="width: 100px;">
              <input class="authInput" v-mask="'####'" type="text" v-model="newUser.bornYear" name="bornyear" required>
            </div>
            <div class="float-20" style="width: 69px;">
              <span class="padding-left-10 form-label">Neme:</span>
            </div>
            <div class="float-30" style="width: 100px;">
              <select class="authInput" name="gender" v-model="newUser.gender" required>
                <option value="female">Nő</option>
                <option value="male">Férfi</option>
              </select>
            </div>
          </div>
          <div class="formrow">
            <div class="float-20" style="width: 142px;">
              <span class="form-label">Telefonszám: +36</span>
            </div>
            <div class="float-30" style="width: 57px; padding-right: 10px">
              <select class="authInput" name="operator" v-model="newUser.operator" required>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="70">70</option>
              </select>
            </div>
            <div class="float-30" style="width: 70px;">
              <input class="authInput" v-mask="'###-##-##'" type="text" name="phonenumber" v-model="newUser.phonenumber" required>
            </div>
            <div class="float-20" style="width: 101px;">
              <span class="padding-left-10 form-label">Email cím:</span>
            </div>
            <div class="float-30" style="width: 210px;">
              <input class="authInput" size type="email" v-model="newUser.email" name="email" required>
            </div>
          </div>
          <div class="formrow">
            <div class="float-20" style="width: 57px">
              <span class="form-label">Jelszó:</span>
            </div>
            <div class="float-30" style="width: 174px">
              <input class="authInput" size type="password" v-model="newUser.password" name="password" required>
            </div>
            <div class="float-20" style="width: 174px">
              <span class="padding-left-10 form-label">Jelszó mégegyszer:</span>
            </div>
            <div class="float-30" style="width: 174px">
              <input class="authInput" size type="password" v-model="newUser.confirmpassword" name="confirmpassword" required>
            </div>
          </div>
          <!-- TODO: check what is required -->
          <div class="formrow">
            <label class="container">
              Adatvédelmi
              <input type="checkbox" v-model="newUser.data1" name="data1">
              <span class="checkmark"></span>
            </label>
            <label class="container">
              Adatvédelmi
              <input type="checkbox" v-model="newUser.data2" name="data2">
              <span class="checkmark"></span>
            </label>
            <label class="container">
              Adatvédelmi
              <input type="checkbox" v-model="newUser.data3" name="data3">
              <span class="checkmark"></span>
            </label>
          </div>
          <div class="formrow" style="text-align: center;">
            <input type="submit" :class="regSubmitStyle" value="Regisztrálok">
          </div>
        </fieldset>
      </form>
    </div>
    <div class="login">
      <h2>Belépés</h2>
      <p v-if="loginErrors.length">
        <ul class="errorFormat">
          <li v-for="error in loginErrors" :key="error.id">{{ error }}</li>
        </ul>
      </p>
      <p v-if="loginInfos.length">
        <ul class="infoFormat">
          <li v-for="info in loginInfos" :key="info.id">{{ info }}</li>
        </ul>
      </p>
      <form action v-if="!canShowForgotPassword && !resettoken" @submit="login" method="post">
        <div class="">
          <div class="float-20" style="width: 90px;">
            <span class="form-label">Email cím:</span>
          </div>
          <div class="float-30" style="width: 211px;">
            <input size type="email" class="authInput" v-model="userLoginData.email" name="email" required>
          </div>
          <div class="float-20" style="width: 67px;">
            <span class="padding-left-10 form-label">Jelszó:</span>
          </div>
          <div class="float-30" style="width: 211px;">
            <input size type="password" class="authInput" v-model="userLoginData.password" name="password" required>
          </div>
        </div>
        <div class="" style="text-align: center;">
          <input type="submit" :class="logSubmitStyle" value="Belépés" style="margin-top: 20px;">
        </div>
        <p class="pLink" @click="canShowForgotPassword = !canShowForgotPassword">Elfelejtett jelszó</p>
      </form>
      <form action v-if="canShowForgotPassword && !resettoken" @submit="startForgotPassword" method="post">
        <div class="formrow">
          <div class="float-20" style="width: 90px;">
            <span class="form-label">Email cím:</span>
          </div>
          <div class="float-30" style="width: 490px;">
            <input size type="email" class="authInput" v-model="userLoginData.email" name="email" required>
          </div>
        </div>
        <div class="formrow" style="text-align: center;">
          <input type="submit" :class="logSubmitStyle" value="Jelszó törlése">
        </div>
        <p class="pLink" @click="canShowForgotPassword = !canShowForgotPassword">Vissza a bejelentkezéshez</p>
      </form>
        <div>    
          <form action v-if="resettoken" @submit="resetpass" method="post">
            <div class="formrow">
              <div class="float-20" style="width: 180px;">
                <span class="form-label">Jelszó:</span>
              </div>
              <div class="float-30" style="width: 400px;">
                <input size type="password" class="authInput" v-model="userLoginData.password" name="email" required>
              </div>
            </div>
            <div class="formrow">
              <div class="float-20" style="width: 180px;">
                <span class="form-label">Jelszó megerősítése:</span>
              </div>
              <div class="float-30" style="width: 400px;">
                <input size type="password" class="authInput" v-model="userLoginData.passwordTwo" name="password" required>
              </div>
            </div>
            <div class="formrow" style="text-align: center;">
              <input type="submit" :class="logSubmitStyle" value="Jelszó megváltoztatása">
            </div>
          </form>
        </div>
      <div>
        <h2>Jelentkez be velük</h2>
        <google-sso />
      </div>
    </div>
  </div>
</template>

<script>
import GoogleSso from '@/components/GoogleSso.vue'

export default {
  name: 'AuthComponent',
  components: {
    GoogleSso
  },
  props: ['resettoken'],
  data () {
    return {
      errors: [],
      infos: [],
      loginErrors: [],
      loginInfos: [],
      formDisabled: false,
      regSubmitStyle: 'beforeLoading',
      logSubmitStyle: 'beforeLoading',
      canShowForgotPassword: false,
      newUser: {
        lastName: null,
        firstName: null,
        zip: null,
        bornYear: null,
        gender: null,
        operator: null,
        phonenumber: null,
        email: null,
        password: null,
        confirmpassword: null,
        data1: null,
        data2: null,
        data3: null
      },
      userLoginData: {
        email: null,
        password: null,
        passwordTwo: null
      }
    }
  },
  methods: {
    pushError: function (error) {
      this.errors.push(error)
    },
    postRegistration: async function (e) {
      e.preventDefault()

      this.errors = []
      this.infos = []

      if (Number(this.newUser.bornYear) < 1900) this.pushError('Kérlek, ellenőrizd a születési éved!')
      if (Number(this.newUser.bornYear) > 2000) this.pushError('Az oldal használatához legalább 18 évesnek kell lenned.')
      if (this.newUser.password.localeCompare(this.newUser.confirmpassword)) this.pushError('A két jelszónak meg kell egyeznie.')
      if (this.newUser.password.length < 7 ||
        this.newUser.confirmpassword.length < 7) {
        this.pushError('A jelszónak legalább 6 karakter hosszúnak kell lennie.')
      }

      // TODO: check adatvédelmi too

      if (this.errors.length !== 0) return
      this.newUser.phonenumber = this.newUser.phonenumber.replace(/-/g, '')
      this.formDisabled = true
      this.regSubmitStyle = 'loading'
      try {
        let response = await this.$http.post('/reg', { newUser: this.newUser })
        // console.log(response)
        if (response.data.succesMessage) {
          // TODO: what is succes?
          this.infos = response.data.succesMessage
          this.formDisabled = false
          this.regSubmitStyle = 'beforeLoading'
          return
        } else if (response.data.error) {
          this.errors = response.data.error
          this.formDisabled = false
          this.regSubmitStyle = 'beforeLoading'
          return
        }
        return
      } catch (err) {
        // console.log(err)
      }
    },
    login: async function (e) {
      e.preventDefault()
      this.loginErrors = []
      this.loginInfos = []
      if (!this.userLoginData.email || !this.userLoginData.password) return
      this.logSubmitStyle = 'loading'

      try {
        let response = await this.$http.post('/login', { user: this.userLoginData })
        if(response.data.error) {
          this.logSubmitStyle = 'beforeLoading'
          return this.loginErrors = response.data.error
        }
        if(response.data.info) {
          return this.loginInfos = response.data.info
        }
        if (response.data.auth) {
            this.logSubmitStyle = 'beforeLoading'
            localStorage.sunToken = response.data.token
            this.$store.commit('setAuthenticated', response.data)
        }
      } catch (err) {
        console.log(err)
      }
    },
    startForgotPassword: async function (e) {
      e.preventDefault()

      this.logSubmitStyle = 'loading'
      try {
        let response = await this.$http.post('/resetback', {
          email: this.userLoginData.email
        })
        console.log(response)
        if (response.data.error) {
          this.loginErrors = response.data.error
        }
        if (response.data.info) {
          this.loginInfos = response.data.info
        }
        this.logSubmitStyle = 'beforeLoading'
      } catch (err) {
        console.log(err)
      }
      this.logSubmitStyle = 'beforeLoading'
    },
    resetpass: async function (e) {
      e.preventDefault()

      this.logSubmitStyle = 'loading'
      try {
        let response = await this.$http.post('/resetpass', {
          passOne: this.userLoginData.password,
          passTwo: this.userLoginData.passwordTwo,
          token: this.resettoken
        })
        if (response.data.error) {
          this.loginErrors = response.data.error
          this.logSubmitStyle = 'beforeLoading'
        }
        if (response.data.auth) {
          // this.resettoken = null
          this.logSubmitStyle = 'beforeLoading'
          localStorage.sunToken = response.data.token
          this.$store.commit('setAuthenticated', response.data)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
