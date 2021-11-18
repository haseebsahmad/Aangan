var require = meteorInstall({"imports":{"api":{"accounts.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/accounts.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 1);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('Meteor.users.age', function (_ref) {
    let {
      userIds
    } = _ref;
    new SimpleSchema({
      userIds: {
        type: [String]
      }
    }).validate({
      userIds
    }); // Select only the users that match the array of IDs passed in

    const selector = {
      _id: {
        $in: userIds
      }
    }; // Only return one field

    const options = {
      fields: {
        age: 1
      }
    };
    return Meteor.users.find(selector, options, role);
  });
}

Meteor.methods({
  'user.addFields'(fields) {
    console.log('fields: ', fields);
    userId = Meteor.user()._id;

    if (Roles.userIsInRole(userId, 'company')) {
      Meteor.users.update(userId, {
        $set: {
          name: fields.name,
          phone: fields.phone,
          address: fields.address,
          cnic: fields.cnic,
          link: fields.link,
          company: fields.company,
          city: fields.city,
          license: fields.license,
          intro: fields.intro,
          userType: fields.userType
        }
      });
    }

    if (Roles.userIsInRole(userId, 'customer')) {
      Meteor.users.update(userId, {
        $set: {
          name: fields.name,
          phone: fields.phone,
          age: fields.age,
          cnic: fields.cnic,
          city: fields.city
        }
      });
    }

    if (Roles.userIsInRole(userId, 'guide')) {
      Meteor.users.update(userId, {
        $set: {
          name: fields.name,
          age: fields.age,
          phone: fields.phone,
          address: fields.address,
          cnic: fields.cnic,
          expertise: fields.expertise,
          city: fields.city,
          experience: fields.experience
        }
      });
    }
  },

  'user.role'(userId, role) {
    if (Meteor.isServer) {
      Roles.addUsersToRoles(userId, role, null);
    }
  },

  'user.checkrole'(userId, role) {
    const check = Roles.userIsInRole(userId, role);
    return check;
  },

  'users.companyData'(id) {
    console.log("ID: ", id);
    console.log("Return value ", Meteor.users.find({
      _id: id
    }, {
      phone: 1,
      address: 1,
      link: 1,
      license: 1,
      intro: 1
    }).fetch());
    return Meteor.users.find({
      _id: id
    }, {
      phone: 1,
      address: 1,
      link: 1,
      license: 1,
      intro: 1
    }).fetch();
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"home.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/home.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  HomeLinks: () => HomeLinks
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const HomeLinks = new Mongo.Collection('homeLinks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('homeLinks', () => {
    if (Roles.userIsInRole(Meteor.userId(), 'company')) {
      return HomeLinks.find({
        link: "PlotCompany"
      });
    }
  });
}

Meteor.methods({
  'homeLinks.addLink'() {
    console.log("Added");
    HomeLinks.insert({
      link: "PlotCompany",
      text: "Add Plots",
      user: "Company"
    });
  }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"plots.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/plots.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Plots: () => Plots
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 2);
const Plots = new Mongo.Collection('plots');

// export const UserPlotBookings = new Mongo.Collection('userPlotBookings');
if (Meteor.isServer) {
  // This code only runs on the server
  const today = new Date();
  Meteor.publish('plots', () => {
    return Plots.find({}); //{
    //   fields: {
    //     bookings: 0
    //   }
    // });
  }); // Meteor.publish('plotsBookings', () => {
  //   return Plots.find({
  //     owner: Meteor.userId()
  //   });
  //   });
  // Meteor.publish('userPlotBookings', () => {
  //   return UserPlotBookings.find({
  //     customer: Meteor.userId()
  //   });
  //   });
}

Meteor.methods({
  'plots.findOne'(plotId) {
    return Plots.findOne({
      _id: new Mongo.ObjectID(plotId)
    });
  },

  'plots.insert'(plot, image) {
    // check(plot.destination, String);
    // check(cost, Int);
    // check(startDate, Date);
    // check(endDate, Date);
    // check(plot.departure, String);
    // check(plot.destinationInformation, String);
    // Make sure the user is logged in before inserting a plot
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (!Roles.userIsInRole(this.userId, 'company')) {
      throw new Meteor.Error('not-authorized');
    } // console.log("company", Meteor.user({"_id":this.userId}))


    if (!plot.phone) {
      plot.phone = Meteor.users.findOne({
        _id: Meteor.userId()
      }).phone;
    }

    if (!plot.cnic) {
      plot.cnic = Meteor.users.findOne({
        _id: Meteor.userId()
      }).cnic;
    }

    console.log("imgaessss: ", plot.images.length);
    var imagesNames = [];

    var fs = require('fs');

    const startpath = "/Users/yusrakhalid/Desktop/Disk/Projects/Aangan/public/uploads/";

    for (var i = 0; i < plot.images.length; i++) {
      imagesNames.push(plot.images[i].name);
    }

    Plots.insert({
      size: plot.size,
      createdAt: new Date(),
      owner: this.userId,
      company: Meteor.user({
        "_id": this.userId
      }).company,
      phone: plot.phone,
      constructionDate: plot.constructionDate,
      // cnic: plot.cnic,
      city: plot.city,
      location: plot.location,
      image: image,
      type: plot.type,
      price: plot.price,
      detail: plot.detail,
      purpose: plot.purpose,
      images: imagesNames
    } // ,function (err,id){
    //   var dir = startpath+id;
    //   console.log("id", id, startpath, startpath+id);
    //     if (!fs.existsSync(dir)){
    //         fs.mkdirSync(dir);
    //     }
    //     async function savefile(i, arr){
    //       if (i>=plot.images.length){
    //         return arr;
    //       }
    //       console.log(i,plot.images[i].name);
    //       var imageBuffer = Buffer.from(plot.images[i].data.split(',')[1], 'base64'); //console = <Buffer 75 ab 5a 8a ...
    //       var path = dir+'/'+plot.images[i].name; // change path
    //       fs.writeFile(path, imageBuffer, (err) => { 
    //         // throws an error, you could also catch it here
    //         if (err) throw err;
    //         // success case, the file was saved
    //         arr.push(path);
    //         savefile(i+1,arr);
    //       });
    //     }
    //     savefile(0, []);
    // }
    );
  },

  'plots.remove'(plotId) {
    check(plotId, String);
    const plot = Plots.findOne(plotId);

    if (plot.owner !== this.userId) {
      // make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Plots.remove(plotId);
  },

  'plot.companyPhone'(id) {
    return Meteor.users.findOne({
      _id: id
    }).phone;
  },

  // 'plots.book'(plotId, seats){
  //   if (Roles.userIsInRole(Meteor.userId(), 'customer')){
  //     const customer = Meteor.users.findOne({_id: Meteor.userId()});
  //     const plot = Plots.findOne(plotId);
  //     var bookings = [];
  //     console.log("prev bookings: ", plot.bookings)
  //     if (plot.bookings){
  //       bookings = plot.bookings;
  //       totalSeats = seats + plot.seats;
  //     }
  //     const prev = UserPlotBookings.findOne({customer: Meteor.userId(), plot_id: plotId});
  //     if (prev){
  //       var index = 0;
  //       for (var i = 0; i < bookings.length; i++){
  //         if (bookings[i].customer_id == Meteor.userId()){
  //           index = i;
  //         }
  //       }
  //       const prev_booking = bookings.splice(index,1);
  //       seats = seats + parseInt(prev.seats);
  //       console.log("New seats: ", seats);
  //       UserPlotBookings.remove({_id:prev._id});
  //     }
  //     bookings.push({
  //       customer_id: customer._id,
  //       customer_name: customer.name,
  //       customer_phone: customer.phone,
  //       seats: seats,
  //     });
  //     console.log("Search booking: ", bookings);
  //     if (!customer.phone){
  //       throw new Meteor.Error('not-registered', "Phone not found");
  //       // this.props.history.push('/SignupCustomer');
  //     }
  //     console.log("Bookings", bookings);
  //     Plots.update(plotId, { $set: { bookings: bookings , seats: totalSeats} });
  //     UserPlotBookings.insert({
  //       customer: Meteor.userId(),
  //       plot_id: plotId,
  //       plot_name: plot.destination,
  //       plot_startDate: plot.startDate,
  //       seats: seats
  //     })
  //     console.log("booked: ", Plots.findOne(plotId));
  //     return ("Booked");
  //   }
  //   else{
  //     throw new Meteor.Error('not-authorized');
  //   }
  // },
  // 'plot.removeBooking'(bookingId){
  //   const booking = UserPlotBookings.findOne({_id:bookingId});
  //   const plot = Plots.findOne(booking.plot_id);
  //   var bookings = plot.bookings;
  //   var index = 0;
  //   for (var i = 0; i < bookings.length; i++){
  //     if (bookings[i].customer_id == Meteor.userId()){
  //       index = i;
  //     }
  //   }
  //   const prev_booking = bookings.splice(index,1);
  //   totalSeats = plot.seats - booking.seats;
  //   Plots.update(plot._id, { $set: { bookings: bookings , seats: totalSeats} });
  //   UserPlotBookings.remove({_id:bookingId});
  // }
  // ,
  'plots.search'(search) {
    // console.log('plotsearch: ', search);
    // if (!search.location){
    //   search.location = {$ne: ""};
    // }
    // var https = require('follow-redirects').https;
    // var options = {
    //   'method': 'POST',
    //   'hostname': 'api.sms.to',
    //   'path': '/sms/send',
    //   'headers': {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer <YOUR_API_KEY_OR_ACCESS_TOKEN>'
    //   },
    //   'maxRedirects': 20
    // };
    // var req = https.request(options, function (res) {
    //   var chunks = [];
    //   res.on("data", function (chunk) {
    //     chunks.push(chunk);
    //   });
    //   res.on("end", function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    //   });
    //   res.on("error", function (error) {
    //     console.error(error);
    //   });
    // });
    // var postData =  "{\n    \"messages\": [\n        {\n            \"message\": \"This is a test message\",\n            \"to\": \"+35799999999999\"\n        }\n    ],\n    \"sender_id\": \"SMSto\",\n    \"callback_url\": \"https://example.com/callback/handler\"\n}";
    // req.write(postData);
    // req.end();
    // const data = {
    //   username: "92339773430",
    //   sender:"AanganAPI",
    //   mobile: "923489773430",
    //   message: "Test"
    // }
    // https://secure.h3techs.com/sms/api/send?email=yusra.khalid@outlook.com&key=07becd247c2a4f4fe502f23cd5987624fe&mask=H3 TEST SMS&to=923151231015&message=Test Message
    // var response = HTTP.post("https://secure.h3techs.com/sms/api/send?email=yusra.khalid@outlook.com&key=07becd247c2a4f4fe502f23cd5987624fe&mask=H3 TEST SMS&to=923345005652&message=This is the test sms sent by aangan to Sir Abdullah Awan");
    // // var response = HTTP.post("https://sendpk.com/api/sms.php?api_key=923229773430-d6956b96-1790-4c9b-9354-3f5f0d895901&sender=8987&mobile=923229773430&message=5782");
    //   console.log(response);
    if (!search.sizeMin) {
      search.sizeMin = 0;
    }

    if (!search.sizeMax) {
      search.sizeMax = 999999999;
    }

    if (!search.city) {
      search.city = {
        $ne: ""
      };
    }

    if (!search.type) {
      search.type = {
        $ne: ""
      };
    }

    if (!search.purpose) {
      search.type = {
        $ne: ""
      };
    }

    console.log('plotsearch: ', search);

    if (!search.constructionDate) {
      // console.log("New search: ",Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }}).fetch());
      return Plots.find({
        purpose: search.purpose,
        size: {
          $lte: search.sizeMax
        },
        size: {
          $gte: search.sizeMin
        },
        city: search.city,
        type: search.type,
        price: {
          $lte: search.price
        }
      }).fetch();
    } else {
      // console.log("New search: ",  Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }, constructionDate: {$gte: search.constructionDate}}).fetch());
      return Plots.find({
        purpose: search.purpose,
        size: {
          $lte: search.sizeMax
        },
        size: {
          $gte: search.sizeMin
        },
        city: search.city,
        type: search.type,
        price: {
          $lte: search.price
        },
        constructionDate: {
          $gte: search.constructionDate
        }
      }).fetch();
    }
  } // 'plots.price'(){
  //   const plot = Plots.findOne({_id:"ktvtjYGj7frscoztP"});
  //   console.log("Hunza  : ", plot);
  //   console.log("Date: ", plot.startDate);
  //   plot.startDate = '2020-8-25';
  //   console.log("Date: ", plot.startDate);
  //   // const priceint = parseInt(Plots.findOne({_id:id}).price);
  //   // console.log("Price: ", priceint, typeof(priceint));
  //   Plots.update("ktvtjYGj7frscoztP", { $set: { startDate: '2020-08-25', endDate: '2020-08-30' } });
  // }


});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reviews.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/reviews.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';
// export const Reviews = new Mongo.Collection('reviews');
// if (Meteor.isServer) {
//     // This code only runs on the server
//   Meteor.publish('reviews', () => {
//         return Reviews.find({});
//     });
// }
// Meteor.methods({
//     'reviews.insert'(review){
//         if (Roles.userIsInRole(Meteor.userId(), 'customer')){
//             // console.log(Meteor.userId)
//             // console.log("inserting: ", review);
//             if (review.company){
//                 if (Reviews.find({company:review.company, reviewer: Meteor.userId()})){
//                     Reviews.remove({company:review.company, reviewer: Meteor.userId()})
//                 }
//                 Reviews.insert({
//                     company: review.company,
//                     rating: review.rating,
//                     reviewer: Meteor.userId(),
//                     remarks: review.remarks,
//                     username: Meteor.users.findOne({_id: Meteor.userId()}).username,
//                     reviewer_dp: review.reviewer_dp,
//                 });
//             }
//             if (review.guide) {
//                 Reviews.insert({
//                     company: review.company,
//                     rating: review.rating,
//                     reviewer: Meteor.userId,
//                     remarks: review.remarks,
//                     username: Meteor.users.findOne({_id: Meteor.userId()}).username
//                 });
//             }
//         }
//         else{
//             throw new Meteor.Error('not-authorized');
//         }
//     },
//     'reviews.delete'(id){
//         if (Meteor.userId == Reviews.findOne({_id:id}).reviewer){
//             Reviews.remove({_id:id});
//         }
//     },
//     'reviews.companyRate'(companyId){
//         rates = Reviews.find({company: companyId}).map((company) => { return parseFloat(company.rating); });
//         if (rates.length == 0){
//             return 0;
//         }
//         const sum = rates.reduce((total, value) => { return total + value; });
//         const avg = sum/(rates.length);
//         return (avg.toFixed(1));
//     }
//   });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"server":{"config":{"account.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/config/account.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let post, data;
module.link("jquery", {
  post(v) {
    post = v;
  },

  data(v) {
    data = v;
  }

}, 1);

//authentication of user fields
const addCustomerFields = (options, user) => {
  console.log(options);
  const customizedUser = {
    age: 0
  };
  Object.assign(customizedUser, user); // We still want the default hook's 'profile' behavior.

  if (options.profile) {
    customizedUser.profile = options.profile;
  }

  return customizedUser;
};

Accounts.onCreateUser(addCustomerFields); // process.env.MAIL_URL = "smtp://yusrakhalid.97@gmail.com"//removed for SO;

process.env.MAIL_URL = "smtps://yusrakhalid.97@gmail.com:hsfcvdsnjokkteec@smtp.gmail.com:465/"; //587
// process.env.MAIL_URL="smtps://support@aangan.pk:AangAn_pk@mail.aangan.pk:465";

Accounts.config({
  sendVerificationEmail: true // forbidClientAccountCreation: true 

}); // var sms_url = "";

Accounts.emailTemplates.siteName = "Aangan";
Accounts.emailTemplates.from = "Aangan<admin@aangan.io>";
Accounts.emailTemplates.verifyEmail = {
  subject() {
    return "Activate your Aangan account!";
  },

  text(user, url) {
    console.log("Verify url: ", url);
    const message = encodeURIComponent("Verify your Aangan profile at \n " + url);
    const contact = encodeURIComponent(user.profile.phone);
    console.log("message: ", message); // data = {
    //   email:"yusra.khalid@outlook.com",
    //   key:"07becd247c2a4f4fe502f23cd5987624fe",
    //   mask:"H# TEST SMS",
    //   to:"923489773430",
    //   message:url
    // };
    // HTTP.call(post, "https://secure.h3techs.com/sms/api/send", data, (res)=>{console.log("res",res)});
    // var response = HTTP.post("https://secure.h3techs.com/sms/api/send?email=yusra.khalid@outlook.com&key=07becd247c2a4f4fe502f23cd5987624fe&mask=Digi Alert&to="+contact+"&message="+message);

    console.log("user: ", user.profile.phone); // console.log("Verify response: ",response);

    return 'Hey ' + user.username + '! Verify your e-mail for Aanagan by following the link below:\n\n' + url;
  }

}; // Email.send({
//   from: "yusrakhalid.97@gmail.com",
//   cc: 'abdullah.bscs16seecs@seecs.edu.pk',
//   subject: "Aangan Email Verification",
//   text: "To complete the signup and enjoy Aangan services click the link below.",
//       });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"role.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/config/role.js                                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Roles.createRole('customer', {
  unlessExists: true
});
Roles.createRole('company', {
  unlessExists: true
});
Roles.createRole('guide', {
  unlessExists: true
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"api.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api.js                                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../imports/api/accounts");
module.link("../imports/api/plots");
module.link("../imports/api/reviews");
module.link("../imports/api/home");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("./api");
module.link("./config/account");
module.link("./config/role");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".ts",
    ".mjs",
    ".tsx"
  ]
});

var exports = require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvYWNjb3VudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2hvbWUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3Bsb3RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZXZpZXdzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvY29uZmlnL2FjY291bnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9jb25maWcvcm9sZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwibW9kdWxlIiwibGluayIsInYiLCJSb2xlcyIsImlzU2VydmVyIiwicHVibGlzaCIsInVzZXJJZHMiLCJTaW1wbGVTY2hlbWEiLCJ0eXBlIiwiU3RyaW5nIiwidmFsaWRhdGUiLCJzZWxlY3RvciIsIl9pZCIsIiRpbiIsIm9wdGlvbnMiLCJmaWVsZHMiLCJhZ2UiLCJ1c2VycyIsImZpbmQiLCJyb2xlIiwibWV0aG9kcyIsImNvbnNvbGUiLCJsb2ciLCJ1c2VySWQiLCJ1c2VyIiwidXNlcklzSW5Sb2xlIiwidXBkYXRlIiwiJHNldCIsIm5hbWUiLCJwaG9uZSIsImFkZHJlc3MiLCJjbmljIiwiY29tcGFueSIsImNpdHkiLCJsaWNlbnNlIiwiaW50cm8iLCJ1c2VyVHlwZSIsImV4cGVydGlzZSIsImV4cGVyaWVuY2UiLCJhZGRVc2Vyc1RvUm9sZXMiLCJjaGVjayIsImlkIiwiZmV0Y2giLCJleHBvcnQiLCJIb21lTGlua3MiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJpbnNlcnQiLCJ0ZXh0IiwiUGxvdHMiLCJ0b2RheSIsIkRhdGUiLCJwbG90SWQiLCJmaW5kT25lIiwiT2JqZWN0SUQiLCJwbG90IiwiaW1hZ2UiLCJFcnJvciIsImltYWdlcyIsImxlbmd0aCIsImltYWdlc05hbWVzIiwiZnMiLCJyZXF1aXJlIiwic3RhcnRwYXRoIiwiaSIsInB1c2giLCJzaXplIiwiY3JlYXRlZEF0Iiwib3duZXIiLCJjb25zdHJ1Y3Rpb25EYXRlIiwibG9jYXRpb24iLCJwcmljZSIsImRldGFpbCIsInB1cnBvc2UiLCJyZW1vdmUiLCJzZWFyY2giLCJzaXplTWluIiwic2l6ZU1heCIsIiRuZSIsIiRsdGUiLCIkZ3RlIiwiQWNjb3VudHMiLCJwb3N0IiwiZGF0YSIsImFkZEN1c3RvbWVyRmllbGRzIiwiY3VzdG9taXplZFVzZXIiLCJPYmplY3QiLCJhc3NpZ24iLCJwcm9maWxlIiwib25DcmVhdGVVc2VyIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwiY29uZmlnIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwiZW1haWxUZW1wbGF0ZXMiLCJzaXRlTmFtZSIsImZyb20iLCJ2ZXJpZnlFbWFpbCIsInN1YmplY3QiLCJ1cmwiLCJtZXNzYWdlIiwiZW5jb2RlVVJJQ29tcG9uZW50IiwiY29udGFjdCIsInVzZXJuYW1lIiwiY3JlYXRlUm9sZSIsInVubGVzc0V4aXN0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlDLEtBQUo7QUFBVUgsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQXBDLEVBQXdELENBQXhEOztBQUcxRSxJQUFJSCxNQUFNLENBQUNLLFFBQVgsRUFBcUI7QUFDckI7QUFDSUwsUUFBTSxDQUFDTSxPQUFQLENBQWUsa0JBQWYsRUFBbUMsZ0JBQXVCO0FBQUEsUUFBYjtBQUFFQztBQUFGLEtB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WSxPQUFaO0FBQXFCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQkFBWjtBQUFnQ0QsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuLy8gVGhpcyBjb2RlIG9ubHkgcnVucyBvbiB0aGUgc2VydmVyXG4gICAgTWV0ZW9yLnB1Ymxpc2goJ01ldGVvci51c2Vycy5hZ2UnLCBmdW5jdGlvbiAoeyB1c2VySWRzIH0pIHtcbiAgICAgICAgbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgICAgIHVzZXJJZHM6IHsgdHlwZTogW1N0cmluZ10gfVxuICAgICAgICB9KS52YWxpZGF0ZSh7IHVzZXJJZHMgfSk7XG4gICAgXG4gICAgICAgIC8vIFNlbGVjdCBvbmx5IHRoZSB1c2VycyB0aGF0IG1hdGNoIHRoZSBhcnJheSBvZiBJRHMgcGFzc2VkIGluXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgX2lkOiB7ICRpbjogdXNlcklkcyB9XG4gICAgICAgIH07XG4gICAgXG4gICAgICAgIC8vIE9ubHkgcmV0dXJuIG9uZSBmaWVsZFxuICAgICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICAgICAgZmllbGRzOiB7IGFnZTogMSB9XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBNZXRlb3IudXNlcnMuZmluZChzZWxlY3Rvciwgb3B0aW9ucywgcm9sZSk7XG4gICAgfSk7XG59XG5cbk1ldGVvci5tZXRob2RzKHtcblxuICAgICd1c2VyLmFkZEZpZWxkcycoZmllbGRzKXtcbiAgICAgICAgY29uc29sZS5sb2coJ2ZpZWxkczogJywgZmllbGRzKTtcbiAgICAgICAgdXNlcklkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUodXNlcklkLCAnY29tcGFueScpKXtcbiAgICAgICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodXNlcklkLCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGZpZWxkcy5uYW1lLFxuICAgICAgICAgICAgICAgIHBob25lOiBmaWVsZHMucGhvbmUsXG4gICAgICAgICAgICAgICAgYWRkcmVzczogZmllbGRzLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgY25pYzogZmllbGRzLmNuaWMsXG4gICAgICAgICAgICAgICAgbGluazogZmllbGRzLmxpbmssXG4gICAgICAgICAgICAgICAgY29tcGFueTogZmllbGRzLmNvbXBhbnksXG4gICAgICAgICAgICAgICAgY2l0eTogZmllbGRzLmNpdHksXG4gICAgICAgICAgICAgICAgbGljZW5zZTogZmllbGRzLmxpY2Vuc2UsXG4gICAgICAgICAgICAgICAgaW50cm86IGZpZWxkcy5pbnRybyxcbiAgICAgICAgICAgICAgICB1c2VyVHlwZTogZmllbGRzLnVzZXJUeXBlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZSh1c2VySWQsICdjdXN0b21lcicpKXtcbiAgICAgICAgICAgIE1ldGVvci51c2Vycy51cGRhdGUodXNlcklkLCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG5hbWU6IGZpZWxkcy5uYW1lLFxuICAgICAgICAgICAgICAgIHBob25lOiBmaWVsZHMucGhvbmUsXG4gICAgICAgICAgICAgICAgYWdlOiBmaWVsZHMuYWdlLFxuICAgICAgICAgICAgICAgIGNuaWM6IGZpZWxkcy5jbmljLFxuICAgICAgICAgICAgICAgIGNpdHk6IGZpZWxkcy5jaXR5LFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUodXNlcklkLCAnZ3VpZGUnKSl7XG4gICAgICAgICAgICBNZXRlb3IudXNlcnMudXBkYXRlKHVzZXJJZCwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiBmaWVsZHMubmFtZSxcbiAgICAgICAgICAgICAgICBhZ2U6IGZpZWxkcy5hZ2UsXG4gICAgICAgICAgICAgICAgcGhvbmU6IGZpZWxkcy5waG9uZSxcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBmaWVsZHMuYWRkcmVzcyxcbiAgICAgICAgICAgICAgICBjbmljOiBmaWVsZHMuY25pYyxcbiAgICAgICAgICAgICAgICBleHBlcnRpc2U6IGZpZWxkcy5leHBlcnRpc2UsXG4gICAgICAgICAgICAgICAgY2l0eTogZmllbGRzLmNpdHksXG4gICAgICAgICAgICAgICAgZXhwZXJpZW5jZTogZmllbGRzLmV4cGVyaWVuY2UsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3VzZXIucm9sZScodXNlcklkLCByb2xlKXtcbiAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKHVzZXJJZCwgcm9sZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgJ3VzZXIuY2hlY2tyb2xlJyh1c2VySWQsIHJvbGUpe1xuICAgICAgICBjb25zdCBjaGVjayA9IFJvbGVzLnVzZXJJc0luUm9sZSh1c2VySWQsIHJvbGUpO1xuICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgfSxcblxuICAgICd1c2Vycy5jb21wYW55RGF0YScoaWQpe1xuICAgICAgICBjb25zb2xlLmxvZyhcIklEOiBcIiwgaWQpO1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJldHVybiB2YWx1ZSBcIixNZXRlb3IudXNlcnMuZmluZCh7X2lkOmlkfSx7cGhvbmU6MSwgYWRkcmVzczoxLCBsaW5rOjEsIGxpY2Vuc2U6MSwgaW50cm86MX0pLmZldGNoKCkpO1xuICAgICAgICByZXR1cm4oXG4gICAgICAgICAgICBNZXRlb3IudXNlcnMuZmluZCh7X2lkOmlkfSx7cGhvbmU6MSwgYWRkcmVzczoxLCBsaW5rOjEsIGxpY2Vuc2U6MSwgaW50cm86MX0pLmZldGNoKClcbiAgICAgICAgKVxuICAgIH1cbn0pIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG4vLyBpbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cblxuZXhwb3J0IGNvbnN0IEhvbWVMaW5rcyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdob21lTGlua3MnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIC8vIFRoaXMgY29kZSBvbmx5IHJ1bnMgb24gdGhlIHNlcnZlclxuICBNZXRlb3IucHVibGlzaCgnaG9tZUxpbmtzJywgKCkgPT4ge1xuICAgIGlmIChSb2xlcy51c2VySXNJblJvbGUoTWV0ZW9yLnVzZXJJZCgpLCAnY29tcGFueScpKXtcbiAgICAgICAgcmV0dXJuIEhvbWVMaW5rcy5maW5kKHtsaW5rOlwiUGxvdENvbXBhbnlcIn0pO1xuICAgIH1cbiAgICB9KTtcblxuICAgIFxufVxuXG5NZXRlb3IubWV0aG9kcyh7XG4gICdob21lTGlua3MuYWRkTGluaycoKXtcbiAgICBjb25zb2xlLmxvZyhcIkFkZGVkXCIpO1xuICAgIEhvbWVMaW5rcy5pbnNlcnQoe2xpbms6XCJQbG90Q29tcGFueVwiLCB0ZXh0OlwiQWRkIFBsb3RzXCIsIHVzZXI6XCJDb21wYW55XCJ9KVxuICB9XG59KVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG4vLyBpbXBvcnQge0ZpbGVBUEl9IGZyb20gJ2ZpbGUtYXBpJztcblxuZXhwb3J0IGNvbnN0IFBsb3RzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3Bsb3RzJyk7XG4vLyBleHBvcnQgY29uc3QgVXNlclBsb3RCb29raW5ncyA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCd1c2VyUGxvdEJvb2tpbmdzJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAvLyBUaGlzIGNvZGUgb25seSBydW5zIG9uIHRoZSBzZXJ2ZXJcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XG4gIE1ldGVvci5wdWJsaXNoKCdwbG90cycsICgpID0+IHtcbiAgICByZXR1cm4gUGxvdHMuZmluZCh7fSk7XG4gICAgICAvL3tcbiAgICAvLyAgIGZpZWxkczoge1xuICAgIC8vICAgICBib29raW5nczogMFxuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuICB9KTtcbiAgICAvLyBNZXRlb3IucHVibGlzaCgncGxvdHNCb29raW5ncycsICgpID0+IHtcbiAgICAvLyAgIHJldHVybiBQbG90cy5maW5kKHtcbiAgICAvLyAgICAgb3duZXI6IE1ldGVvci51c2VySWQoKVxuICAgIC8vICAgfSk7XG4gICAgLy8gICB9KTtcbiAgICAvLyBNZXRlb3IucHVibGlzaCgndXNlclBsb3RCb29raW5ncycsICgpID0+IHtcbiAgICAvLyAgIHJldHVybiBVc2VyUGxvdEJvb2tpbmdzLmZpbmQoe1xuICAgIC8vICAgICBjdXN0b21lcjogTWV0ZW9yLnVzZXJJZCgpXG4gICAgLy8gICB9KTtcbiAgICAvLyAgIH0pO1xufVxuICAgXG5NZXRlb3IubWV0aG9kcyh7XG5cbiAgICAncGxvdHMuZmluZE9uZScocGxvdElkKXtcbiAgICAgIHJldHVybiAoUGxvdHMuZmluZE9uZSh7X2lkOiBuZXcgTW9uZ28uT2JqZWN0SUQocGxvdElkKX0pKTtcbiAgICB9LFxuICAgIFxuICAgICdwbG90cy5pbnNlcnQnKHBsb3QsIGltYWdlKSB7XG4gICAgICAvLyBjaGVjayhwbG90LmRlc3RpbmF0aW9uLCBTdHJpbmcpO1xuICAgICAgLy8gY2hlY2soY29zdCwgSW50KTtcbiAgICAgIC8vIGNoZWNrKHN0YXJ0RGF0ZSwgRGF0ZSk7XG4gICAgICAvLyBjaGVjayhlbmREYXRlLCBEYXRlKTtcbiAgICAgIC8vIGNoZWNrKHBsb3QuZGVwYXJ0dXJlLCBTdHJpbmcpO1xuICAgICAgLy8gY2hlY2socGxvdC5kZXN0aW5hdGlvbkluZm9ybWF0aW9uLCBTdHJpbmcpO1xuICAgICAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGlzIGxvZ2dlZCBpbiBiZWZvcmUgaW5zZXJ0aW5nIGEgcGxvdFxuICAgICAgaWYgKCEgdGhpcy51c2VySWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICAgIH1cbiAgICAgIGlmICghIFJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgJ2NvbXBhbnknKSl7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgICB9XG4gICAgICAvLyBjb25zb2xlLmxvZyhcImNvbXBhbnlcIiwgTWV0ZW9yLnVzZXIoe1wiX2lkXCI6dGhpcy51c2VySWR9KSlcbiAgICAgIGlmICghcGxvdC5waG9uZSl7XG4gICAgICAgIHBsb3QucGhvbmUgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiBNZXRlb3IudXNlcklkKCl9KS5waG9uZTtcbiAgICAgIH1cbiAgICAgIGlmICghcGxvdC5jbmljKXtcbiAgICAgICAgcGxvdC5jbmljID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogTWV0ZW9yLnVzZXJJZCgpfSkuY25pYztcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKFwiaW1nYWVzc3NzOiBcIiwgcGxvdC5pbWFnZXMubGVuZ3RoKTsgICAgXG4gICAgICB2YXIgaW1hZ2VzTmFtZXMgPSBbXTtcbiAgICAgIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG4gICAgICBjb25zdCBzdGFydHBhdGggPSBcIi9Vc2Vycy95dXNyYWtoYWxpZC9EZXNrdG9wL0Rpc2svUHJvamVjdHMvQWFuZ2FuL3B1YmxpYy91cGxvYWRzL1wiO1xuICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHBsb3QuaW1hZ2VzLmxlbmd0aDtpKyspe1xuICAgICAgICBpbWFnZXNOYW1lcy5wdXNoKHBsb3QuaW1hZ2VzW2ldLm5hbWUpO1xuICAgICAgfVxuICAgICAgUGxvdHMuaW5zZXJ0KHtcbiAgICAgICAgc2l6ZTogcGxvdC5zaXplLFxuICAgICAgICBjcmVhdGVkQXQ6IG5ldyBEYXRlKCksXG4gICAgICAgIG93bmVyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgY29tcGFueTogTWV0ZW9yLnVzZXIoe1wiX2lkXCI6dGhpcy51c2VySWR9KS5jb21wYW55LFxuICAgICAgICBwaG9uZTogcGxvdC5waG9uZSxcbiAgICAgICAgY29uc3RydWN0aW9uRGF0ZTogcGxvdC5jb25zdHJ1Y3Rpb25EYXRlLFxuICAgICAgICAvLyBjbmljOiBwbG90LmNuaWMsXG4gICAgICAgIGNpdHk6IHBsb3QuY2l0eSxcbiAgICAgICAgbG9jYXRpb246IHBsb3QubG9jYXRpb24sXG4gICAgICAgIGltYWdlOiBpbWFnZSxcbiAgICAgICAgdHlwZTogcGxvdC50eXBlLFxuICAgICAgICBwcmljZTogcGxvdC5wcmljZSxcbiAgICAgICAgZGV0YWlsOiBwbG90LmRldGFpbCxcbiAgICAgICAgcHVycG9zZTpwbG90LnB1cnBvc2UsXG4gICAgICAgIGltYWdlczppbWFnZXNOYW1lcyxcbiAgICAgIH1cbiAgICAgIC8vICxmdW5jdGlvbiAoZXJyLGlkKXtcbiAgICAgIC8vICAgdmFyIGRpciA9IHN0YXJ0cGF0aCtpZDtcbiAgICAgIC8vICAgY29uc29sZS5sb2coXCJpZFwiLCBpZCwgc3RhcnRwYXRoLCBzdGFydHBhdGgraWQpO1xuICAgICAgLy8gICAgIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKXtcbiAgICAgIC8vICAgICAgICAgZnMubWtkaXJTeW5jKGRpcik7XG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICAgIGFzeW5jIGZ1bmN0aW9uIHNhdmVmaWxlKGksIGFycil7XG4gICAgICAvLyAgICAgICBpZiAoaT49cGxvdC5pbWFnZXMubGVuZ3RoKXtcbiAgICAgIC8vICAgICAgICAgcmV0dXJuIGFycjtcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgICAgIGNvbnNvbGUubG9nKGkscGxvdC5pbWFnZXNbaV0ubmFtZSk7XG4gICAgICAvLyAgICAgICB2YXIgaW1hZ2VCdWZmZXIgPSBCdWZmZXIuZnJvbShwbG90LmltYWdlc1tpXS5kYXRhLnNwbGl0KCcsJylbMV0sICdiYXNlNjQnKTsgLy9jb25zb2xlID0gPEJ1ZmZlciA3NSBhYiA1YSA4YSAuLi5cbiAgICAgIC8vICAgICAgIHZhciBwYXRoID0gZGlyKycvJytwbG90LmltYWdlc1tpXS5uYW1lOyAvLyBjaGFuZ2UgcGF0aFxuICAgICAgLy8gICAgICAgZnMud3JpdGVGaWxlKHBhdGgsIGltYWdlQnVmZmVyLCAoZXJyKSA9PiB7IFxuICAgICAgLy8gICAgICAgICAvLyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBjb3VsZCBhbHNvIGNhdGNoIGl0IGhlcmVcbiAgICAgIC8vICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgLy8gICAgICAgICAvLyBzdWNjZXNzIGNhc2UsIHRoZSBmaWxlIHdhcyBzYXZlZFxuICAgICAgLy8gICAgICAgICBhcnIucHVzaChwYXRoKTtcbiAgICAgIC8vICAgICAgICAgc2F2ZWZpbGUoaSsxLGFycik7XG4gICAgICAvLyAgICAgICB9KTtcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgICAgc2F2ZWZpbGUoMCwgW10pO1xuICAgICAgLy8gfVxuICAgICAgKTtcbiAgICB9LFxuXG4gICAgJ3Bsb3RzLnJlbW92ZScocGxvdElkKSB7XG4gICAgICBjaGVjayhwbG90SWQsIFN0cmluZyk7XG4gICAgICBjb25zdCBwbG90ID0gUGxvdHMuZmluZE9uZShwbG90SWQpO1xuICAgICAgaWYgKHBsb3Qub3duZXIgIT09IHRoaXMudXNlcklkKSB7XG4gICAgICAgIC8vIG1ha2Ugc3VyZSBvbmx5IHRoZSBvd25lciBjYW4gZGVsZXRlIGl0XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgICB9XG4gICAgICBQbG90cy5yZW1vdmUocGxvdElkKTtcbiAgICB9LFxuXG4gICAgJ3Bsb3QuY29tcGFueVBob25lJyhpZCl7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiBpZH0pLnBob25lXG4gICAgICApXG4gICAgfSxcblxuXG4gICAgLy8gJ3Bsb3RzLmJvb2snKHBsb3RJZCwgc2VhdHMpe1xuICAgIC8vICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdjdXN0b21lcicpKXtcbiAgICAvLyAgICAgY29uc3QgY3VzdG9tZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7X2lkOiBNZXRlb3IudXNlcklkKCl9KTtcbiAgICAvLyAgICAgY29uc3QgcGxvdCA9IFBsb3RzLmZpbmRPbmUocGxvdElkKTtcbiAgICAvLyAgICAgdmFyIGJvb2tpbmdzID0gW107XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwicHJldiBib29raW5nczogXCIsIHBsb3QuYm9va2luZ3MpXG4gICAgLy8gICAgIGlmIChwbG90LmJvb2tpbmdzKXtcbiAgICAvLyAgICAgICBib29raW5ncyA9IHBsb3QuYm9va2luZ3M7XG4gICAgLy8gICAgICAgdG90YWxTZWF0cyA9IHNlYXRzICsgcGxvdC5zZWF0cztcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBjb25zdCBwcmV2ID0gVXNlclBsb3RCb29raW5ncy5maW5kT25lKHtjdXN0b21lcjogTWV0ZW9yLnVzZXJJZCgpLCBwbG90X2lkOiBwbG90SWR9KTtcbiAgICAvLyAgICAgaWYgKHByZXYpe1xuICAgIC8vICAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgLy8gICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib29raW5ncy5sZW5ndGg7IGkrKyl7XG4gICAgLy8gICAgICAgICBpZiAoYm9va2luZ3NbaV0uY3VzdG9tZXJfaWQgPT0gTWV0ZW9yLnVzZXJJZCgpKXtcbiAgICAvLyAgICAgICAgICAgaW5kZXggPSBpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgICBjb25zdCBwcmV2X2Jvb2tpbmcgPSBib29raW5ncy5zcGxpY2UoaW5kZXgsMSk7XG4gICAgLy8gICAgICAgc2VhdHMgPSBzZWF0cyArIHBhcnNlSW50KHByZXYuc2VhdHMpO1xuICAgIC8vICAgICAgIGNvbnNvbGUubG9nKFwiTmV3IHNlYXRzOiBcIiwgc2VhdHMpO1xuICAgIC8vICAgICAgIFVzZXJQbG90Qm9va2luZ3MucmVtb3ZlKHtfaWQ6cHJldi5faWR9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBib29raW5ncy5wdXNoKHtcbiAgICAvLyAgICAgICBjdXN0b21lcl9pZDogY3VzdG9tZXIuX2lkLFxuICAgIC8vICAgICAgIGN1c3RvbWVyX25hbWU6IGN1c3RvbWVyLm5hbWUsXG4gICAgLy8gICAgICAgY3VzdG9tZXJfcGhvbmU6IGN1c3RvbWVyLnBob25lLFxuICAgIC8vICAgICAgIHNlYXRzOiBzZWF0cyxcbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiU2VhcmNoIGJvb2tpbmc6IFwiLCBib29raW5ncyk7XG4gICAgLy8gICAgIGlmICghY3VzdG9tZXIucGhvbmUpe1xuICAgIC8vICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1yZWdpc3RlcmVkJywgXCJQaG9uZSBub3QgZm91bmRcIik7XG4gICAgLy8gICAgICAgLy8gdGhpcy5wcm9wcy5oaXN0b3J5LnB1c2goJy9TaWdudXBDdXN0b21lcicpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKFwiQm9va2luZ3NcIiwgYm9va2luZ3MpO1xuICAgIC8vICAgICBQbG90cy51cGRhdGUocGxvdElkLCB7ICRzZXQ6IHsgYm9va2luZ3M6IGJvb2tpbmdzICwgc2VhdHM6IHRvdGFsU2VhdHN9IH0pO1xuICAgIC8vICAgICBVc2VyUGxvdEJvb2tpbmdzLmluc2VydCh7XG4gICAgLy8gICAgICAgY3VzdG9tZXI6IE1ldGVvci51c2VySWQoKSxcbiAgICAvLyAgICAgICBwbG90X2lkOiBwbG90SWQsXG4gICAgLy8gICAgICAgcGxvdF9uYW1lOiBwbG90LmRlc3RpbmF0aW9uLFxuICAgIC8vICAgICAgIHBsb3Rfc3RhcnREYXRlOiBwbG90LnN0YXJ0RGF0ZSxcbiAgICAvLyAgICAgICBzZWF0czogc2VhdHNcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgICAgY29uc29sZS5sb2coXCJib29rZWQ6IFwiLCBQbG90cy5maW5kT25lKHBsb3RJZCkpO1xuICAgIC8vICAgICByZXR1cm4gKFwiQm9va2VkXCIpO1xuICAgIC8vICAgfVxuICAgIC8vICAgZWxzZXtcbiAgICAvLyAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICAvLyAgIH1cbiAgICAvLyB9LFxuXG4gICAgLy8gJ3Bsb3QucmVtb3ZlQm9va2luZycoYm9va2luZ0lkKXtcbiAgICAvLyAgIGNvbnN0IGJvb2tpbmcgPSBVc2VyUGxvdEJvb2tpbmdzLmZpbmRPbmUoe19pZDpib29raW5nSWR9KTtcbiAgICAvLyAgIGNvbnN0IHBsb3QgPSBQbG90cy5maW5kT25lKGJvb2tpbmcucGxvdF9pZCk7XG4gICAgLy8gICB2YXIgYm9va2luZ3MgPSBwbG90LmJvb2tpbmdzO1xuICAgIC8vICAgdmFyIGluZGV4ID0gMDtcbiAgICAvLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9va2luZ3MubGVuZ3RoOyBpKyspe1xuICAgIC8vICAgICBpZiAoYm9va2luZ3NbaV0uY3VzdG9tZXJfaWQgPT0gTWV0ZW9yLnVzZXJJZCgpKXtcbiAgICAvLyAgICAgICBpbmRleCA9IGk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyAgIGNvbnN0IHByZXZfYm9va2luZyA9IGJvb2tpbmdzLnNwbGljZShpbmRleCwxKTtcbiAgICAvLyAgIHRvdGFsU2VhdHMgPSBwbG90LnNlYXRzIC0gYm9va2luZy5zZWF0cztcbiAgICAvLyAgIFBsb3RzLnVwZGF0ZShwbG90Ll9pZCwgeyAkc2V0OiB7IGJvb2tpbmdzOiBib29raW5ncyAsIHNlYXRzOiB0b3RhbFNlYXRzfSB9KTtcbiAgICAvLyAgIFVzZXJQbG90Qm9va2luZ3MucmVtb3ZlKHtfaWQ6Ym9va2luZ0lkfSk7XG4gICAgLy8gfVxuICAgIC8vICxcblxuICAgICdwbG90cy5zZWFyY2gnKHNlYXJjaCl7XG4gICAgICAvLyBjb25zb2xlLmxvZygncGxvdHNlYXJjaDogJywgc2VhcmNoKTtcbiAgICAgIC8vIGlmICghc2VhcmNoLmxvY2F0aW9uKXtcbiAgICAgIC8vICAgc2VhcmNoLmxvY2F0aW9uID0geyRuZTogXCJcIn07XG4gICAgICAvLyB9XG4gICAgICAvLyB2YXIgaHR0cHMgPSByZXF1aXJlKCdmb2xsb3ctcmVkaXJlY3RzJykuaHR0cHM7XG4gICAgICAvLyB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIC8vICAgJ21ldGhvZCc6ICdQT1NUJyxcbiAgICAgIC8vICAgJ2hvc3RuYW1lJzogJ2FwaS5zbXMudG8nLFxuICAgICAgLy8gICAncGF0aCc6ICcvc21zL3NlbmQnLFxuICAgICAgLy8gICAnaGVhZGVycyc6IHtcbiAgICAgIC8vICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgLy8gICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciA8WU9VUl9BUElfS0VZX09SX0FDQ0VTU19UT0tFTj4nXG4gICAgICAvLyAgIH0sXG4gICAgICAvLyAgICdtYXhSZWRpcmVjdHMnOiAyMFxuICAgICAgLy8gfTtcblxuICAgICAgLy8gdmFyIHJlcSA9IGh0dHBzLnJlcXVlc3Qob3B0aW9ucywgZnVuY3Rpb24gKHJlcykge1xuICAgICAgLy8gICB2YXIgY2h1bmtzID0gW107XG5cbiAgICAgIC8vICAgcmVzLm9uKFwiZGF0YVwiLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgIC8vICAgICBjaHVua3MucHVzaChjaHVuayk7XG4gICAgICAvLyAgIH0pO1xuXG4gICAgICAvLyAgIHJlcy5vbihcImVuZFwiLCBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgIC8vICAgICB2YXIgYm9keSA9IEJ1ZmZlci5jb25jYXQoY2h1bmtzKTtcbiAgICAgIC8vICAgICBjb25zb2xlLmxvZyhib2R5LnRvU3RyaW5nKCkpO1xuICAgICAgLy8gICB9KTtcblxuICAgICAgLy8gICByZXMub24oXCJlcnJvclwiLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIC8vICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIC8vICAgfSk7XG4gICAgICAvLyB9KTtcblxuICAgICAgLy8gdmFyIHBvc3REYXRhID0gIFwie1xcbiAgICBcXFwibWVzc2FnZXNcXFwiOiBbXFxuICAgICAgICB7XFxuICAgICAgICAgICAgXFxcIm1lc3NhZ2VcXFwiOiBcXFwiVGhpcyBpcyBhIHRlc3QgbWVzc2FnZVxcXCIsXFxuICAgICAgICAgICAgXFxcInRvXFxcIjogXFxcIiszNTc5OTk5OTk5OTk5OVxcXCJcXG4gICAgICAgIH1cXG4gICAgXSxcXG4gICAgXFxcInNlbmRlcl9pZFxcXCI6IFxcXCJTTVN0b1xcXCIsXFxuICAgIFxcXCJjYWxsYmFja191cmxcXFwiOiBcXFwiaHR0cHM6Ly9leGFtcGxlLmNvbS9jYWxsYmFjay9oYW5kbGVyXFxcIlxcbn1cIjtcblxuICAgICAgLy8gcmVxLndyaXRlKHBvc3REYXRhKTtcblxuICAgICAgLy8gcmVxLmVuZCgpO1xuICAgICAgLy8gY29uc3QgZGF0YSA9IHtcbiAgICAgIC8vICAgdXNlcm5hbWU6IFwiOTIzMzk3NzM0MzBcIixcbiAgICAgIC8vICAgc2VuZGVyOlwiQWFuZ2FuQVBJXCIsXG4gICAgICAvLyAgIG1vYmlsZTogXCI5MjM0ODk3NzM0MzBcIixcbiAgICAgIC8vICAgbWVzc2FnZTogXCJUZXN0XCJcbiAgICAgIC8vIH1cbiAgICAgIC8vIGh0dHBzOi8vc2VjdXJlLmgzdGVjaHMuY29tL3Ntcy9hcGkvc2VuZD9lbWFpbD15dXNyYS5raGFsaWRAb3V0bG9vay5jb20ma2V5PTA3YmVjZDI0N2MyYTRmNGZlNTAyZjIzY2Q1OTg3NjI0ZmUmbWFzaz1IMyBURVNUIFNNUyZ0bz05MjMxNTEyMzEwMTUmbWVzc2FnZT1UZXN0IE1lc3NhZ2VcbiAgICAgIC8vIHZhciByZXNwb25zZSA9IEhUVFAucG9zdChcImh0dHBzOi8vc2VjdXJlLmgzdGVjaHMuY29tL3Ntcy9hcGkvc2VuZD9lbWFpbD15dXNyYS5raGFsaWRAb3V0bG9vay5jb20ma2V5PTA3YmVjZDI0N2MyYTRmNGZlNTAyZjIzY2Q1OTg3NjI0ZmUmbWFzaz1IMyBURVNUIFNNUyZ0bz05MjMzNDUwMDU2NTImbWVzc2FnZT1UaGlzIGlzIHRoZSB0ZXN0IHNtcyBzZW50IGJ5IGFhbmdhbiB0byBTaXIgQWJkdWxsYWggQXdhblwiKTtcbiAgICAgIC8vIC8vIHZhciByZXNwb25zZSA9IEhUVFAucG9zdChcImh0dHBzOi8vc2VuZHBrLmNvbS9hcGkvc21zLnBocD9hcGlfa2V5PTkyMzIyOTc3MzQzMC1kNjk1NmI5Ni0xNzkwLTRjOWItOTM1NC0zZjVmMGQ4OTU5MDEmc2VuZGVyPTg5ODcmbW9iaWxlPTkyMzIyOTc3MzQzMCZtZXNzYWdlPTU3ODJcIik7XG4gICAgICAvLyAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIGlmICghc2VhcmNoLnNpemVNaW4pe1xuICAgICAgICBzZWFyY2guc2l6ZU1pbiA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoIXNlYXJjaC5zaXplTWF4KXtcbiAgICAgICAgc2VhcmNoLnNpemVNYXggPSA5OTk5OTk5OTk7XG4gICAgICB9XG4gICAgICBpZiAoIXNlYXJjaC5jaXR5KXtcbiAgICAgICAgc2VhcmNoLmNpdHkgPSB7JG5lOiBcIlwifTtcbiAgICAgIH1cbiAgICAgIGlmICghc2VhcmNoLnR5cGUpe1xuICAgICAgICBzZWFyY2gudHlwZSA9IHskbmU6IFwiXCJ9O1xuICAgICAgfVxuICAgICAgaWYgKCFzZWFyY2gucHVycG9zZSl7XG4gICAgICAgIHNlYXJjaC50eXBlID0geyRuZTogXCJcIn07XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZygncGxvdHNlYXJjaDogJywgc2VhcmNoKTtcbiAgICAgIGlmICghc2VhcmNoLmNvbnN0cnVjdGlvbkRhdGUpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIk5ldyBzZWFyY2g6IFwiLFBsb3RzLmZpbmQoeyBwdXJwb3NlOnNlYXJjaC5wdXJwb3NlLCBzaXplOnsgJGx0ZTpzZWFyY2guc2l6ZU1heCB9LCBzaXplOnsgJGd0ZTpzZWFyY2guc2l6ZU1pbiB9LCBjaXR5OnNlYXJjaC5jaXR5LCB0eXBlOnNlYXJjaC50eXBlLCBwcmljZTogeyAkbHRlOiBzZWFyY2gucHJpY2UgfX0pLmZldGNoKCkpO1xuICAgICAgICByZXR1cm4gUGxvdHMuZmluZCh7IHB1cnBvc2U6c2VhcmNoLnB1cnBvc2UsIHNpemU6eyAkbHRlOnNlYXJjaC5zaXplTWF4IH0sIHNpemU6eyAkZ3RlOnNlYXJjaC5zaXplTWluIH0sIGNpdHk6c2VhcmNoLmNpdHksIHR5cGU6c2VhcmNoLnR5cGUsIHByaWNlOiB7ICRsdGU6IHNlYXJjaC5wcmljZSB9fSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiTmV3IHNlYXJjaDogXCIsICBQbG90cy5maW5kKHsgcHVycG9zZTpzZWFyY2gucHVycG9zZSwgc2l6ZTp7ICRsdGU6c2VhcmNoLnNpemVNYXggfSwgc2l6ZTp7ICRndGU6c2VhcmNoLnNpemVNaW4gfSwgY2l0eTpzZWFyY2guY2l0eSwgdHlwZTpzZWFyY2gudHlwZSwgcHJpY2U6IHsgJGx0ZTogc2VhcmNoLnByaWNlIH0sIGNvbnN0cnVjdGlvbkRhdGU6IHskZ3RlOiBzZWFyY2guY29uc3RydWN0aW9uRGF0ZX19KS5mZXRjaCgpKTtcbiAgICAgICAgcmV0dXJuIFBsb3RzLmZpbmQoeyBwdXJwb3NlOnNlYXJjaC5wdXJwb3NlLCBzaXplOnsgJGx0ZTpzZWFyY2guc2l6ZU1heCB9LCBzaXplOnsgJGd0ZTpzZWFyY2guc2l6ZU1pbiB9LCBjaXR5OnNlYXJjaC5jaXR5LCB0eXBlOnNlYXJjaC50eXBlLCBwcmljZTogeyAkbHRlOiBzZWFyY2gucHJpY2UgfSwgY29uc3RydWN0aW9uRGF0ZTogeyRndGU6IHNlYXJjaC5jb25zdHJ1Y3Rpb25EYXRlfX0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vICdwbG90cy5wcmljZScoKXtcbiAgICAvLyAgIGNvbnN0IHBsb3QgPSBQbG90cy5maW5kT25lKHtfaWQ6XCJrdHZ0allHajdmcnNjb3p0UFwifSk7XG4gICAgLy8gICBjb25zb2xlLmxvZyhcIkh1bnphICA6IFwiLCBwbG90KTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKFwiRGF0ZTogXCIsIHBsb3Quc3RhcnREYXRlKTtcbiAgICAvLyAgIHBsb3Quc3RhcnREYXRlID0gJzIwMjAtOC0yNSc7XG4gICAgLy8gICBjb25zb2xlLmxvZyhcIkRhdGU6IFwiLCBwbG90LnN0YXJ0RGF0ZSk7XG4gICAgLy8gICAvLyBjb25zdCBwcmljZWludCA9IHBhcnNlSW50KFBsb3RzLmZpbmRPbmUoe19pZDppZH0pLnByaWNlKTtcbiAgICAvLyAgIC8vIGNvbnNvbGUubG9nKFwiUHJpY2U6IFwiLCBwcmljZWludCwgdHlwZW9mKHByaWNlaW50KSk7XG5cbiAgICAvLyAgIFBsb3RzLnVwZGF0ZShcImt0dnRqWUdqN2Zyc2NvenRQXCIsIHsgJHNldDogeyBzdGFydERhdGU6ICcyMDIwLTA4LTI1JywgZW5kRGF0ZTogJzIwMjAtMDgtMzAnIH0gfSk7XG4gICAgLy8gfVxuXG5cbiAgfSk7IiwiLy8gaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG4vLyBpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG4vLyBpbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cblxuLy8gZXhwb3J0IGNvbnN0IFJldmlld3MgPSBuZXcgTW9uZ28uQ29sbGVjdGlvbigncmV2aWV3cycpO1xuXG4vLyBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4vLyAgICAgLy8gVGhpcyBjb2RlIG9ubHkgcnVucyBvbiB0aGUgc2VydmVyXG4vLyAgIE1ldGVvci5wdWJsaXNoKCdyZXZpZXdzJywgKCkgPT4ge1xuLy8gICAgICAgICByZXR1cm4gUmV2aWV3cy5maW5kKHt9KTtcbi8vICAgICB9KTtcbi8vIH1cbiAgIFxuLy8gTWV0ZW9yLm1ldGhvZHMoe1xuLy8gICAgICdyZXZpZXdzLmluc2VydCcocmV2aWV3KXtcbi8vICAgICAgICAgaWYgKFJvbGVzLnVzZXJJc0luUm9sZShNZXRlb3IudXNlcklkKCksICdjdXN0b21lcicpKXtcbi8vICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKE1ldGVvci51c2VySWQpXG4vLyAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluc2VydGluZzogXCIsIHJldmlldyk7XG4vLyAgICAgICAgICAgICBpZiAocmV2aWV3LmNvbXBhbnkpe1xuLy8gICAgICAgICAgICAgICAgIGlmIChSZXZpZXdzLmZpbmQoe2NvbXBhbnk6cmV2aWV3LmNvbXBhbnksIHJldmlld2VyOiBNZXRlb3IudXNlcklkKCl9KSl7XG4vLyAgICAgICAgICAgICAgICAgICAgIFJldmlld3MucmVtb3ZlKHtjb21wYW55OnJldmlldy5jb21wYW55LCByZXZpZXdlcjogTWV0ZW9yLnVzZXJJZCgpfSlcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICAgICAgUmV2aWV3cy5pbnNlcnQoe1xuLy8gICAgICAgICAgICAgICAgICAgICBjb21wYW55OiByZXZpZXcuY29tcGFueSxcbi8vICAgICAgICAgICAgICAgICAgICAgcmF0aW5nOiByZXZpZXcucmF0aW5nLFxuLy8gICAgICAgICAgICAgICAgICAgICByZXZpZXdlcjogTWV0ZW9yLnVzZXJJZCgpLFxuLy8gICAgICAgICAgICAgICAgICAgICByZW1hcmtzOiByZXZpZXcucmVtYXJrcyxcbi8vICAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IE1ldGVvci51c2Vycy5maW5kT25lKHtfaWQ6IE1ldGVvci51c2VySWQoKX0pLnVzZXJuYW1lLFxuLy8gICAgICAgICAgICAgICAgICAgICByZXZpZXdlcl9kcDogcmV2aWV3LnJldmlld2VyX2RwLFxuLy8gICAgICAgICAgICAgICAgIH0pO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICAgICAgaWYgKHJldmlldy5ndWlkZSkge1xuLy8gICAgICAgICAgICAgICAgIFJldmlld3MuaW5zZXJ0KHtcbi8vICAgICAgICAgICAgICAgICAgICAgY29tcGFueTogcmV2aWV3LmNvbXBhbnksXG4vLyAgICAgICAgICAgICAgICAgICAgIHJhdGluZzogcmV2aWV3LnJhdGluZyxcbi8vICAgICAgICAgICAgICAgICAgICAgcmV2aWV3ZXI6IE1ldGVvci51c2VySWQsXG4vLyAgICAgICAgICAgICAgICAgICAgIHJlbWFya3M6IHJldmlldy5yZW1hcmtzLFxuLy8gICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe19pZDogTWV0ZW9yLnVzZXJJZCgpfSkudXNlcm5hbWVcbi8vICAgICAgICAgICAgICAgICB9KTtcbi8vICAgICAgICAgICAgIH1cbi8vICAgICAgICAgfVxuLy8gICAgICAgICBlbHNle1xuLy8gICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbi8vICAgICAgICAgfVxuLy8gICAgIH0sXG5cbi8vICAgICAncmV2aWV3cy5kZWxldGUnKGlkKXtcbi8vICAgICAgICAgaWYgKE1ldGVvci51c2VySWQgPT0gUmV2aWV3cy5maW5kT25lKHtfaWQ6aWR9KS5yZXZpZXdlcil7XG4vLyAgICAgICAgICAgICBSZXZpZXdzLnJlbW92ZSh7X2lkOmlkfSk7XG4vLyAgICAgICAgIH1cbi8vICAgICB9LFxuXG4vLyAgICAgJ3Jldmlld3MuY29tcGFueVJhdGUnKGNvbXBhbnlJZCl7XG4vLyAgICAgICAgIHJhdGVzID0gUmV2aWV3cy5maW5kKHtjb21wYW55OiBjb21wYW55SWR9KS5tYXAoKGNvbXBhbnkpID0+IHsgcmV0dXJuIHBhcnNlRmxvYXQoY29tcGFueS5yYXRpbmcpOyB9KTtcbi8vICAgICAgICAgaWYgKHJhdGVzLmxlbmd0aCA9PSAwKXtcbi8vICAgICAgICAgICAgIHJldHVybiAwO1xuLy8gICAgICAgICB9XG4vLyAgICAgICAgIGNvbnN0IHN1bSA9IHJhdGVzLnJlZHVjZSgodG90YWwsIHZhbHVlKSA9PiB7IHJldHVybiB0b3RhbCArIHZhbHVlOyB9KTtcbi8vICAgICAgICAgY29uc3QgYXZnID0gc3VtLyhyYXRlcy5sZW5ndGgpO1xuLy8gICAgICAgICByZXR1cm4gKGF2Zy50b0ZpeGVkKDEpKTtcbiAgICAgICAgXG4vLyAgICAgfVxuLy8gICB9KTsiLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7IHBvc3QsIGRhdGEgfSBmcm9tICdqcXVlcnknO1xuXG4vL2F1dGhlbnRpY2F0aW9uIG9mIHVzZXIgZmllbGRzXG5cbmNvbnN0IGFkZEN1c3RvbWVyRmllbGRzID0gKG9wdGlvbnMsIHVzZXIpID0+IHtcbiAgICBjb25zb2xlLmxvZyhvcHRpb25zKTtcbiAgICBjb25zdCBjdXN0b21pemVkVXNlciA9IHtcbiAgICAgICAgYWdlOiAwXG4gICAgfTtcbiAgICBPYmplY3QuYXNzaWduKGN1c3RvbWl6ZWRVc2VyLCB1c2VyKTtcbiAgICBcbiAgICAgIC8vIFdlIHN0aWxsIHdhbnQgdGhlIGRlZmF1bHQgaG9vaydzICdwcm9maWxlJyBiZWhhdmlvci5cbiAgICAgIGlmIChvcHRpb25zLnByb2ZpbGUpIHtcbiAgICAgICAgY3VzdG9taXplZFVzZXIucHJvZmlsZSA9IG9wdGlvbnMucHJvZmlsZTtcbiAgICAgIH1cbiAgICBcbiAgICAgIHJldHVybiBjdXN0b21pemVkVXNlcjtcbn07XG5cbkFjY291bnRzLm9uQ3JlYXRlVXNlcihhZGRDdXN0b21lckZpZWxkcyk7XG5cbi8vIHByb2Nlc3MuZW52Lk1BSUxfVVJMID0gXCJzbXRwOi8veXVzcmFraGFsaWQuOTdAZ21haWwuY29tXCIvL3JlbW92ZWQgZm9yIFNPO1xuICBwcm9jZXNzLmVudi5NQUlMX1VSTD1cInNtdHBzOi8veXVzcmFraGFsaWQuOTdAZ21haWwuY29tOmhzZmN2ZHNuam9ra3RlZWNAc210cC5nbWFpbC5jb206NDY1L1wiOyAvLzU4N1xuICAvLyBwcm9jZXNzLmVudi5NQUlMX1VSTD1cInNtdHBzOi8vc3VwcG9ydEBhYW5nYW4ucGs6QWFuZ0FuX3BrQG1haWwuYWFuZ2FuLnBrOjQ2NVwiO1xuXG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDp0cnVlLFxuICAgIC8vIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbjogdHJ1ZSBcbn0pO1xuLy8gdmFyIHNtc191cmwgPSBcIlwiO1xuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWUgPSBcIkFhbmdhblwiO1xuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSA9IFwiQWFuZ2FuPGFkbWluQGFhbmdhbi5pbz5cIjtcbkFjY291bnRzLmVtYWlsVGVtcGxhdGVzLnZlcmlmeUVtYWlsID0ge1xuICBzdWJqZWN0KCkge1xuICAgICAgcmV0dXJuIFwiQWN0aXZhdGUgeW91ciBBYW5nYW4gYWNjb3VudCFcIjtcbiAgfSxcbiAgdGV4dCh1c2VyLCB1cmwpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVmVyaWZ5IHVybDogXCIsdXJsKTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlbmNvZGVVUklDb21wb25lbnQoXCJWZXJpZnkgeW91ciBBYW5nYW4gcHJvZmlsZSBhdCBcXG4gXCIrdXJsKTsgXG4gICAgICBjb25zdCBjb250YWN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHVzZXIucHJvZmlsZS5waG9uZSk7XG4gICAgICBjb25zb2xlLmxvZyhcIm1lc3NhZ2U6IFwiLCBtZXNzYWdlKTtcbiAgICAgIC8vIGRhdGEgPSB7XG4gICAgICAvLyAgIGVtYWlsOlwieXVzcmEua2hhbGlkQG91dGxvb2suY29tXCIsXG4gICAgICAvLyAgIGtleTpcIjA3YmVjZDI0N2MyYTRmNGZlNTAyZjIzY2Q1OTg3NjI0ZmVcIixcbiAgICAgIC8vICAgbWFzazpcIkgjIFRFU1QgU01TXCIsXG4gICAgICAvLyAgIHRvOlwiOTIzNDg5NzczNDMwXCIsXG4gICAgICAvLyAgIG1lc3NhZ2U6dXJsXG4gICAgICAvLyB9O1xuICAgICAgLy8gSFRUUC5jYWxsKHBvc3QsIFwiaHR0cHM6Ly9zZWN1cmUuaDN0ZWNocy5jb20vc21zL2FwaS9zZW5kXCIsIGRhdGEsIChyZXMpPT57Y29uc29sZS5sb2coXCJyZXNcIixyZXMpfSk7XG4gICAgICAvLyB2YXIgcmVzcG9uc2UgPSBIVFRQLnBvc3QoXCJodHRwczovL3NlY3VyZS5oM3RlY2hzLmNvbS9zbXMvYXBpL3NlbmQ/ZW1haWw9eXVzcmEua2hhbGlkQG91dGxvb2suY29tJmtleT0wN2JlY2QyNDdjMmE0ZjRmZTUwMmYyM2NkNTk4NzYyNGZlJm1hc2s9RGlnaSBBbGVydCZ0bz1cIitjb250YWN0K1wiJm1lc3NhZ2U9XCIrbWVzc2FnZSk7XG4gICAgICBjb25zb2xlLmxvZyhcInVzZXI6IFwiLHVzZXIucHJvZmlsZS5waG9uZSk7XG4gICAgICAvLyBjb25zb2xlLmxvZyhcIlZlcmlmeSByZXNwb25zZTogXCIscmVzcG9uc2UpO1xuICAgICAgcmV0dXJuICdIZXkgJyArIHVzZXIudXNlcm5hbWUgXG4gICAgICArICchIFZlcmlmeSB5b3VyIGUtbWFpbCBmb3IgQWFuYWdhbiBieSBmb2xsb3dpbmcgdGhlIGxpbmsgYmVsb3c6XFxuXFxuJ1xuICAgICAgKyB1cmw7XG4gIH1cbn07XG5cbi8vIEVtYWlsLnNlbmQoe1xuLy8gICBmcm9tOiBcInl1c3Jha2hhbGlkLjk3QGdtYWlsLmNvbVwiLFxuLy8gICBjYzogJ2FiZHVsbGFoLmJzY3MxNnNlZWNzQHNlZWNzLmVkdS5waycsXG4vLyAgIHN1YmplY3Q6IFwiQWFuZ2FuIEVtYWlsIFZlcmlmaWNhdGlvblwiLFxuLy8gICB0ZXh0OiBcIlRvIGNvbXBsZXRlIHRoZSBzaWdudXAgYW5kIGVuam95IEFhbmdhbiBzZXJ2aWNlcyBjbGljayB0aGUgbGluayBiZWxvdy5cIixcbi8vICAgICAgIH0pOyIsIlJvbGVzLmNyZWF0ZVJvbGUoJ2N1c3RvbWVyJywgeyB1bmxlc3NFeGlzdHM6IHRydWUgfSk7XG5Sb2xlcy5jcmVhdGVSb2xlKCdjb21wYW55JywgeyB1bmxlc3NFeGlzdHM6IHRydWUgfSk7XG5Sb2xlcy5jcmVhdGVSb2xlKCdndWlkZScsIHsgdW5sZXNzRXhpc3RzOiB0cnVlIH0pOyIsImltcG9ydCAnLi4vaW1wb3J0cy9hcGkvYWNjb3VudHMnO1xuaW1wb3J0ICcuLi9pbXBvcnRzL2FwaS9wbG90cyc7XG5pbXBvcnQgJy4uL2ltcG9ydHMvYXBpL3Jldmlld3MnO1xuaW1wb3J0ICcuLi9pbXBvcnRzL2FwaS9ob21lJztcbiIsIlxuaW1wb3J0ICcuL2FwaSc7XG5cbmltcG9ydCAnLi9jb25maWcvYWNjb3VudCc7XG5pbXBvcnQgJy4vY29uZmlnL3JvbGUnOyJdfQ==
