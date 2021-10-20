<template>
    <div class="login">
        <b-card title="Login" style="width: 40%;" id="form-card">
            <b-form>
                <b-form-input
                placeholder="username"
                class="form-input">
                </b-form-input>
                <b-form-input
                placeholder="password"
                class="form-input">
                </b-form-input>
            </b-form>
            <b-button
            variant="primary"
            id="btn">
                submit
            </b-button>
        </b-card>
    </div>
</template>

<script>
export default {
    
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
    }
</style>