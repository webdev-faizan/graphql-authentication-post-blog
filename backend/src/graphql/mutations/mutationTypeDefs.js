import {
  postTypeDefs,
  commentTypeDef,
  likeTypeDefs,
} from '../typedefs/postTypeDefs.js'
import { ProfileUploadTypeDefs } from '../typedefs/profileTypedefs.js'
import {
  signUpUserTypeDefs,
  emailVerificationTypedefs,
  loginTypedefs,
  forgetPasswordTypedefs,
  newPasswordTypeDefs,
} from '../typedefs/userTypedefs.js'

const mutationTypeDefs = `
${signUpUserTypeDefs}
${emailVerificationTypedefs}
${loginTypedefs}
${forgetPasswordTypedefs}
${newPasswordTypeDefs}
${postTypeDefs}
${commentTypeDef}
${likeTypeDefs}
${ProfileUploadTypeDefs}

`

export default mutationTypeDefs
