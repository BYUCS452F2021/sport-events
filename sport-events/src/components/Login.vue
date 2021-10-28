<template>
    <div class="login">
        <b-card title="Login" style="width: 40%;" id="form-card">
            <b-form @submit="onSubmit">
                <b-form-input
                id="username"
                v-model="form.username"
                placeholder="username"
                class="form-input">
                </b-form-input>
                <b-form-input
                id="password"
                type="password"
                v-model="form.password"
                placeholder="password"
                class="form-input">
                </b-form-input>
                <b-button
                variant="primary"
                id="btn"
                type="submit">
                    submit
                </b-button>
                <div class="link-container">>
                  <p id="link">Don't have an account? Create one <a href="/create-account">here</a></p>
              </div>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "Login",
    data() {
        return {
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            try {
              let response = axios.post("/login", {
                username: this.form.username,
                password: this.form.password
               });

               this.$root.$data.user = response.data
               this.$router.push("/");
            } catch(error) {
              console.log(error)
            }

      },
    }
}
</script>

<style scoped>
    .login {
        display: flex;
        justify-content: center;
    }
    #form-card {
        margin-top: 10vw;
        box-shadow: 5px 10px 8px #888888;
    }
    .form-input {
        margin: 20px 0;
    }
    #btn {
        cursor: pointer;
        margin-bottom: 10px;
    }
    #link {
        position: absolute;
    }
    .link-container {
      display: flex;
      justify-content: center;
    }
</style>
