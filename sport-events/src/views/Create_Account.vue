<template>
    <div class="create_account">
        <b-card title="Create Account" style="width: 40%;" id="form-card">
            <b-form @submit="onSubmit">
                <b-form-input
                id="username"
                v-model="form.username"
                placeholder="Username"
                class="form-input"
                required>
                </b-form-input>

                <b-form-input
                id="password"
                type="password"
                v-model="form.password"
                placeholder="Password"
                class="form-input"
                required>
                </b-form-input>

                <b-form-input
                id="check_password"
                type="password"
                placeholder="Confirm password"
                v-model="form.confirm_password"

                class="form-input"
                required>
                </b-form-input>

                <b-form-input
                id="email"
                type="email"
                v-model="form.email"
                placeholder="Email"
                class="form-input"
                required>
                </b-form-input>

                <b-button
                variant="primary"
                id="btn"
                type="submit">
                    submit
                </b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: 'create_account',
    components: {
    },
    data() {
        return {
            valid: true,
            check_password: '',
            form: {
                username: '',
                password: '',
                confirm_password: '',
                email: ''
            },
            difficulty_options: [
                {value: null, text: 'Please select an option', disabled: true},
                {value: 'beginner', text: 'Beginner'},
                {value: 'intermediate', text: 'Intermediate'},
                {value: 'advanced', text: 'Advanced'}
            ]
        }
    },
    methods: {
        async onSubmit(event) {
            event.preventDefault();
            try {
              let response = await axios.post("/login", {
                username: this.form.username,
                password: this.form.password,
                email: this.form.email
               });

               this.$root.$data.userID = response.data.userID;
               this.$router.push("/");
            } catch(error) {
              console.log(error)
            }

      },
      checkPassword() {
          console.log("here");
            if (this.form['password'] != this.check_password) {
                this.valid = false;
            }
            console.log()
            return this.valid;
        }
    },
    computed: {
        isDisabled() {
            if (this.form.check_password === this.form.password) {
                return false;
            }
            return true;
        },
        isValid() {
            return this.checkPassword();
        }
    },
}
</script>

<style scoped>
    .create_account {
        display: flex;
        flex-direction: column;
        align-items: center;
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
</style>
