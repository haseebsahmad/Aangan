import { Accounts } from 'meteor/accounts-base';
import { post, data } from 'jquery';

//authentication of user fields

const addCustomerFields = (options, user) => {
    console.log(options);
    const customizedUser = {
        age: 0
    };
    Object.assign(customizedUser, user);
    
      // We still want the default hook's 'profile' behavior.
      if (options.profile) {
        customizedUser.profile = options.profile;
      }
    
      return customizedUser;
};

Accounts.onCreateUser(addCustomerFields);

// process.env.MAIL_URL = "smtp://yusrakhalid.97@gmail.com"//removed for SO;
  process.env.MAIL_URL="smtps://yusrakhalid.97@gmail.com:hsfcvdsnjokkteec@smtp.gmail.com:465/"; //587
  // process.env.MAIL_URL="smtps://support@aangan.pk:AangAn_pk@mail.aangan.pk:465";

Accounts.config({
    sendVerificationEmail:true,
    // forbidClientAccountCreation: true 
});
// var sms_url = "";
Accounts.emailTemplates.siteName = "Aangan";
Accounts.emailTemplates.from = "Aangan<admin@aangan.io>";
Accounts.emailTemplates.verifyEmail = {
  subject() {
      return "Activate your Aangan account!";
  },
  text(user, url) {
      console.log("Verify url: ",url);
      const message = encodeURIComponent("Verify your Aangan profile at \n "+url); 
      const contact = encodeURIComponent(user.profile.phone);
      console.log("message: ", message);
      // data = {
      //   email:"yusra.khalid@outlook.com",
      //   key:"07becd247c2a4f4fe502f23cd5987624fe",
      //   mask:"H# TEST SMS",
      //   to:"923489773430",
      //   message:url
      // };
      // HTTP.call(post, "https://secure.h3techs.com/sms/api/send", data, (res)=>{console.log("res",res)});
      // var response = HTTP.post("https://secure.h3techs.com/sms/api/send?email=yusra.khalid@outlook.com&key=07becd247c2a4f4fe502f23cd5987624fe&mask=Digi Alert&to="+contact+"&message="+message);
      console.log("user: ",user.profile.phone);
      // console.log("Verify response: ",response);
      return 'Hey ' + user.username 
      + '! Verify your e-mail for Aanagan by following the link below:\n\n'
      + url;
  }
};

// Email.send({
//   from: "yusrakhalid.97@gmail.com",
//   cc: 'abdullah.bscs16seecs@seecs.edu.pk',
//   subject: "Aangan Email Verification",
//   text: "To complete the signup and enjoy Aangan services click the link below.",
//       });