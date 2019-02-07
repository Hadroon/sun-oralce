<template>
  <div class="auth">
    <div class="reg">
      <h2>Regisztráció</h2>
      <form action method="post">
        <div class="formrow">
          <div class="float-20">
            <span class="form-label">Vezetéknév:</span>
          </div>
          <div class="float-30">
            <input size type="text" name="lastname">
          </div>
          <div class="float-20">
            <span class="padding-left-10 form-label">Keresztnév:</span>
          </div>
          <div class="float-30">
            <input size type="text" name="firstname">
          </div>
        </div>
        <div class="formrow">
          <div class="float-20" style="width: 115px;">
            <span class="form-label">Irányítószám:</span>
          </div>
          <div class="float-30" style="width: 79px;">
            <input size type="text" name="lastname">
          </div>
          <div class="float-20" style="width: 117px;">
            <span class="padding-left-10 form-label">Születési év:</span>
          </div>
          <div class="float-30" style="width: 100px;">
            <input size type="text" name="firstname">
          </div>
          <div class="float-20" style="width: 69px;">
            <span class="padding-left-10 form-label">Neme:</span>
          </div>
          <div class="float-30" style="width: 100px;">
            <select>
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
            <select>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="70">70</option>
            </select>
          </div>
          <div class="float-30" style="width: 70px;">
            <input size type="text" name="firstname">
          </div>
          <div class="float-20" style="width: 101px;">
            <span class="padding-left-10 form-label">Email cím:</span>
          </div>
          <div class="float-30" style="width: 210px;">
            <input size type="text" name="firstname">
          </div>
        </div>
        <div class="formrow">
          <div class="float-20" style="width: 57px">
            <span class="form-label">Jelszó:</span>
          </div>
          <div class="float-30" style="width: 174px">
            <input size type="text" name="lastname">
          </div>
          <div class="float-20" style="width: 174px">
            <span class="padding-left-10 form-label">Jelszó mégegyszer:</span>
          </div>
          <div class="float-30" style="width: 174px">
            <input size type="text" name="firstname">
          </div>
        </div>
        <div class="formrow">
          <label class="container">
            One
            <input type="checkbox" checked="checked">
            <span class="checkmark"></span>
          </label>
          <label class="container">
            Two
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
          <label class="container">
            Three
            <input type="checkbox">
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
            <input size type="text" name="lastname">
          </div>
          <div class="float-20" style="width: 67px;">
            <span class="padding-left-10 form-label">Jelszó:</span>
          </div>
          <div class="float-30" style="width: 211px;">
            <input size type="text" name="firstname">
          </div>
        </div>
        <div class="formrow">
          <input type="submit" value="Belépés">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthComponent"
};
</script>
