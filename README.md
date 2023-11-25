# slack-api
Slack api to fetch data from mongodb and serve to slack-web

SignUp- via Email and Password
/users/signUpWithEmailNPassword:
  To Create a new user with entered email and password

SignIn- via Email Only:
/users/createSignInMagicalCode 
  To create a confirmation code to sign in via email only
/users/signInWithMagicalCode/:code
  To login via the confirmation code sent above from email

SignIn- via Email and Password
/users/signInWithEmailNPassword
  To Sign In via email and password entered by user

Forgot & Reset Password
/users/forgotPassword
  To send a resetlink to email to change the password
/users/resetPassword/:resetToken
  redirects to the above reset link sent and logs in to slack

