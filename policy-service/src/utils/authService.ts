import DescopeClient from '@descope/node-sdk';
import AuthzNode from '@descope/node-sdk';

const managementKey = "xxxx";

const descopeClient = DescopeClient({
    projectId: 'P2pTtkFbWsS6bjwJ8D3d4bIpmM7i',
    managementKey: managementKey
});


//Send Email: 
export const sendEmailOTP = async (email: string) => {
    try {
        if (!email) {
            return { message: "Email is required", data: null };
        }
        const response = await descopeClient.otp.signUpOrIn.email(email);
        console.log("Response ====", response)
        return { message: "OTP sent to email", data: response };
    } catch (error: any) {
        console.error("Error sending OTP:", error.message);
        return { message: "Failed to send OTP", error: error.message };
    }
};

export const verifyEmailOTP = async (email: string, code: string) => {
    try {
        if (!email || !code) {
            return { message: "Email and OTP code are required", data: null };
        }
        const response = await descopeClient.otp.verify.email(email, code);
        return { message: "OTP verified successfully", data: response };
    } catch (error: any) {
        console.error("Error verifying OTP:", error.message);
        return { message: "Invalid OTP", error: error.message };
    }
};

export const initiateSocialLogin = async (provider: string) => {
    try {
      if (!provider) {
        return { message: "Provider is required", data: null };
      }
  
      const loginUrl = await descopeClient.oauth.start(provider as string); 
      return { message: "Social login successful", data: loginUrl };
    } catch (error: any) {
      console.error("Error initiating social login:", error.message);
      return { message: "Failed to initiate social login", error: error.message };
    }
  };
  
export const verifySocialLogin = async (code: string) => {
    try {
      if (!code) {
        return { message: "Code is required" };
      }
      const response = await descopeClient.oauth.exchange(code as string);
      return { message: "Social login successful", data: response };
    } catch (error: any) {
      console.error("Error handling social login callback:", error.message);
      return { message: "Social login failed", error: error.message };
    }
  };

  export const sendPasswordResetEmail = async (email: string) => {
    try {
      let response = await descopeClient.magicLink.signUpOrIn.email(email) 
      return ({ message: 'Password reset email sent successfully', data: response });
    } catch (error: any) {
      console.error('Error in forgot password:', error.message);
      return ({ message: 'Failed to send password reset email', error: error.message });
    }
  };

  export const verifyPasswordResetEmail = async (token: string) => {
    try {
      const response = await descopeClient.magicLink.verify(token)
      return ({ message: 'Password reset email verified successfully', data: response });
    } catch (error: any) {
      console.error('Error in forgot password:', error.message);
      return ({ message: 'Failed to verify password reset email', error: error.message });
    }
  }



// console.log("Testing ====")
//   console.log(sendEmailOTP("saddam.shah@apptware.com"))
// console.log(verifyEmailOTP("saddam.shah@apptware.com", "919521"))
// console.log(initiateSocialLogin("google"))
// console.log(handleSocialLoginCallback("5ab5a49c0586966d3b1f8d54b7619c6031fd891077a8d4ed58677fb049ff9bbc"))
// console.log(sendPasswordResetEmail("saddam.shah@apptware.com"))
// console.log(verifyPasswordResetEmail("b03baaaa1c9400503727096f23f1b499f1936244cdc898bd90b56fea251b2391"))