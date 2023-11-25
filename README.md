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

GET /workspace/:id/users/:id
  To get one specific user of the workspace
GET /workspace/:id/users/ (Get only active users of a workspace)
  To get all users of the workspace
PATCH /users/:id
  To update a user detail
PATCH /users/:id 
  set isActive of a user to false, equivalent to deleting a user
DELETE /workspace/:id/users/:id
  Remove a user from a workspace => Remove user reference in Workspace object and workspace reference in user object. User can be part of multiple workspaces and leave a single workspace

DELETE /workspaces/:id
  Delete a workspace no longer needed
PATCH /workspaces/:id
  Update a workspace information
POST /workspaces/
  Create a new workspace
GET /workspaces/:id
  Get a particular workspace
GET /workspaces/
  Get all workspaces

GET /workspaces/:id/channels/:id
  Get a channel specific to workspace
GET /workspaces/:id/channels/
  Get all Public and private channels of a workspace
POST /workspaces/:id/channels/
  Create a new channel
PATCH /workspaces/:id/channels/:id
  Update a particular channel information
DELETE /workspaces/:id/channels/:id
  Delete a channel
