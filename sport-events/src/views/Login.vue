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
                <p id="link">Don't have an account? Create one <a href="#">here</a></p>
            </b-form>
        </b-card>
    </div>
</template>

<script>
export default {
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
            alert(JSON.stringify(this.form));
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
</style>