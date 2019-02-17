<template>
  <div class="auth">
    <div class="reg">
      <h2>Regisztráció</h2>
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error.id">{{ error }}</li>
        </ul>
      </p>
      <form @submit="postRegistration" action="" method="post">
        <div class="formrow">
          <div class="float-20">
            <span class="form-label">Vezetéknév:</span>
          </div>
          <div class="float-30">
            <input v-model="newUser.lastName" type="text" name="lastname">
          </div>
          <div class="float-20">
            <span class="padding-left-10 form-label">Keresztnév:</span>
          </div>
          <div class="float-30">
            <input size type="text" v-model="newUser.firstname" name="firstname">
          </div>
        </div>
        <div class="formrow">
          <div class="float-20" style="width: 115px;">
            <span class="form-label">Irányítószám:</span>
          </div>
          <div class="float-30" style="width: 79px;">
            <input size type="text" v-model="newUser.zip" name="zip">
          </div>
          <div class="float-20" style="width: 117px;">
            <span class="padding-left-10 form-label">Születési év:</span>
          </div>
          <div class="float-30" style="width: 100px;">
            <input size type="text" v-model="newUser.bornYear" name="bornyear">
          </div>
          <div class="float-20" style="width: 69px;">
            <span class="padding-left-10 form-label">Neme:</span>
          </div>
          <div class="float-30" style="width: 100px;">
            <select name="gender" v-model="newUser.gender">
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
            <select name="operator" v-model="newUser.operator">
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="70">70</option>
            </select>
          </div>
          <div class="float-30" style="width: 70px;">
            <input size type="text" name="phonenumber" v-model="newUser.phonenumber">
          </div>
          <div class="float-20" style="width: 101px;">
            <span class="padding-left-10 form-label">Email cím:</span>
          </div>
          <div class="float-30" style="width: 210px;">
            <input size type="email" v-model="newUser.email" name="email">
          </div>
        </div>
        <div class="formrow">
          <div class="float-20" style="width: 57px">
            <span class="form-label">Jelszó:</span>
          </div>
          <div class="float-30" style="width: 174px">
            <input size type="password" v-model="newUser.password" name="password">
          </div>
          <div class="float-20" style="width: 174px">
            <span class="padding-left-10 form-label">Jelszó mégegyszer:</span>
          </div>
          <div class="float-30" style="width: 174px">
            <input size type="password" v-model="newUser.confirmpassword" name="confirmpassword">
          </div>
        </div>
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
        <div class="formrow">
          <input type="submit" value="Regisztrálok">
        </div>
      </form>
    </div>
    <div class="reg">
      <h2>Belépés</h2>
      <form action method="post">
        <div class="formrow">
          <div class="float-20" style="width: 90px;">
            <span class="form-label">Email cím:</span>
          </div>
          <div class="float-30" style="width: 211px;">
            <input size type="email" v-model="userLoginData.email" name="email">
          </div>
          <div class="float-20" style="width: 67px;">
            <span class="padding-left-10 form-label">Jelszó:</span>
          </div>
          <div class="float-30" style="width: 211px;">
            <input size type="password" v-model="userLoginData.password" name="password">
          </div>
        </div>
        <div class="formrow">
          <input type="submit" value="Belépés">
        </div>
      </form>
      <div>
        <h2>Jelentkez be velük</h2>
        <div class="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></div>
      </div>
    <!-- <script>
      function onSignIn(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Don't send this directly to your server!
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());

        // The ID token you need to pass to your backend:
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
      }
    </script> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthComponent",
  data() {
    return {
      errors: [],
      newUser: {
        lastName: null,
        firstname: null,
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
        password: null
      }
    }
  },
  methods: {
    postRegistration: function (e) {
      e.preventDefault();
      alert('haho')
    },
    handleSubmit: async function(e){
      e.preventDefault();
      this.spinner.loading = true;
      this.error = null;
      try {
        let response = await this.$http.post('/reg', {user: this.user});
        if(response.data.succesMessage) {
          this.succesMessage = response.data.succesMessage;
          this.spinner.loading = false;
          return;
        } else if (response.data.error) {
          this.error = response.data.error;
          this.spinner.loading = false;
          return;
        }
      } catch (err) {
        this.spinner.loading = false;
        console.log(err);
        return;
      }
    }
  }
}
</script>
