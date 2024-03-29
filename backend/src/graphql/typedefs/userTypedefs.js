export const signUpUserTypeDefs = `
  type User {
    id: ID!
    firstName: String
    verified: Boolean
    message: String
  }

  input formInput {
    firstName: String!
    lastName:String!
    email: String!
    password: String!
    tac: Boolean!
  }

  type Mutation {
    signupUser(registerationForm: formInput!): User
  }

`

export const emailVerificationTypedefs = `
type user{
message:String!
verified:Boolean
}
type Mutation{
  emailVerification(token:String!):user
}`

export const loginTypedefs = `
type User{
message:String
firstName:String
lastName:String
_id:ID
token:String,
verififed:Boolean
}
input signInFormInput{
email:String
password:String
}

type Mutation{
  loginUser(signInForm:signInFormInput!):User
  }
`

export const forgetPasswordTypedefs = `
type ForgetPasswordResponse{
message:String!
}
type Mutation{
  forgetPassword(email:String!):ForgetPasswordResponse
}`

export const newPasswordTypeDefs = `
  input NewPasswordInput {
    token: String
    password: String
  }

  type NewPasswordResponse {
    message: String!
  }

  type Mutation {
    newPassword(token: String, password: String): NewPasswordResponse
  }
`
