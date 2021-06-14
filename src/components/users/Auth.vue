<template>
    <div id="auth" class='auth'>
      <amplify-authenticator
        username-alias="email"
        v-if="authState !== 'signedin'"
      >
        <amplify-sign-up
          slot="sign-up"
          username-alias="email"
          :form-fields.prop="formFields"
          header-text="Sign Up With DegreeSee"
          submit-button-text="Sign Up"
        ></amplify-sign-up>
      </amplify-authenticator>
    </div>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

export default {
  name: 'Auth',
  data () {
    return {
      user: undefined,
      authState: undefined,
      formFields: [
        {
          type: 'email',
          label: 'Email Address',
          placeholder: 'Enter your email address',
          required: true
        },
        {
          type: 'password',
          label: 'Password',
          placeholder: 'Enter your password',
          required: true
        },
        {
          type: 'custom:dashboard',
          label: 'Invitation Code',
          placeholder: 'Enter your invitation code',
          required: true
        }
      ]
    };
  },
  beforeDestroy () {
    return onAuthUIStateChange;
  }
};
</script>

<style>
.auth {
  margin: 0 auto;
  width: 460px;
}

amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;
  z-index: 1;
}

</style>
