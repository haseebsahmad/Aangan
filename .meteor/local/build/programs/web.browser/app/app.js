var require = meteorInstall({"imports":{"api":{"accounts.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/accounts.js                                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"home.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/home.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"plots.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/plots.js                                                                                             //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reviews.js":function module(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/reviews.js                                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"startup":{"routes.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/startup/routes.js                                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  renderRoutes: () => renderRoutes
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Router, Route, Switch;
module.link("react-router", {
  Router(v) {
    Router = v;
  },

  Route(v) {
    Route = v;
  },

  Switch(v) {
    Switch = v;
  }

}, 1);
let createBrowserHistory;
module.link("history", {
  createBrowserHistory(v) {
    createBrowserHistory = v;
  }

}, 2);
let DisplayPlots;
module.link("../ui/DisplayPlots.js", {
  default(v) {
    DisplayPlots = v;
  }

}, 3);
let Home;
module.link("../ui/Home.js", {
  default(v) {
    Home = v;
  }

}, 4);
let IndividualPlot;
module.link("../ui/IndividualPlot.js", {
  default(v) {
    IndividualPlot = v;
  }

}, 5);
let PlotCompany;
module.link("../ui/PlotCompany", {
  default(v) {
    PlotCompany = v;
  }

}, 6);
let Company;
module.link("../ui/Company", {
  default(v) {
    Company = v;
  }

}, 7);
let Signup;
module.link("../ui/Signup", {
  default(v) {
    Signup = v;
  }

}, 8);
let Login;
module.link("../ui/Login", {
  default(v) {
    Login = v;
  }

}, 9);
let About;
module.link("../ui/About", {
  default(v) {
    About = v;
  }

}, 10);
let Contact;
module.link("../ui/Contact.js", {
  default(v) {
    Contact = v;
  }

}, 11);
const browserHistory = createBrowserHistory();

const renderRoutes = () => /*#__PURE__*/React.createElement(Router, {
  history: browserHistory
}, /*#__PURE__*/React.createElement("div", {
  className: "route-render"
}, /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "/",
  component: Home
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "*/DisplayPlots",
  component: DisplayPlots
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "/IndividualPlot*",
  component: IndividualPlot
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "*/PlotCompany",
  component: PlotCompany
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "*/Signup",
  component: Signup
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "*/Login",
  component: Login
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "/Company*",
  component: Company
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "/About",
  component: About
}), /*#__PURE__*/React.createElement(Route, {
  exact: true,
  path: "/Contact",
  component: Contact
}))));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"ui":{"About.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/About.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 3);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 4);

// import {HomeLinks} from '../api/home.js'
class About extends Component {
  render() {
    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      className: "section "
    }, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "half d-md-flex d-block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "image about",
      "data-aos": "fade-left"
    }), /*#__PURE__*/React.createElement("div", {
      className: "text",
      "data-aos": "fade-right",
      "data-aos-delay": "200"
    }, /*#__PURE__*/React.createElement("h2", null, "Vision"), /*#__PURE__*/React.createElement("p", null, "Aangan aap ki khushyun ka"))))), /*#__PURE__*/React.createElement("section", {
      className: "section bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "half d-md-flex d-block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text",
      "data-aos": "fade-right",
      "data-aos-delay": "200"
    }, /*#__PURE__*/React.createElement("h2", null, "Mission"), /*#__PURE__*/React.createElement("p", null, "The mission is to provide a save and accessible platform to local vendors and services providers for the needs of locals without boundaries. The above mission needs discussion. Because when we write mission statement we mean every part of it. Each action word is to be reflected in our model.")), /*#__PURE__*/React.createElement("div", {
      className: "image about2",
      "data-aos": "fade-left"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }));
  }

}

;
module.exportDefault(withTracker(() => {
  // Meteor.subscribe('homeLinks');
  return {
    // homeLink: HomeLinks.findOne({}),
    currentUser: Meteor.user()
  };
})(About));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Account.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Account.js                                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
module.link("../api/accounts.js");
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 2);
let HomeLinks;
module.link("../api/home.js", {
  HomeLinks(v) {
    HomeLinks = v;
  }

}, 3);
let Popover;
module.link("@varld/popover", {
  Popover(v) {
    Popover = v;
  }

}, 4);
let Login;
module.link("./Login", {
  default(v) {
    Login = v;
  }

}, 5);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 6);
let Signup;
module.link("./Signup", {
  default(v) {
    Signup = v;
  }

}, 7);

class Account extends Component {
  signout(event) {
    console.log("signout");
    Meteor.logout(); // document.getElementById('link').innerHTML = '';
    // this.addPropertiesPopup();

    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("a", {
      href: "../Login"
    }, /*#__PURE__*/React.createElement("button", null, "Sign In")));
  }

  addPropertiesPopup() {
    render( /*#__PURE__*/React.createElement(Popover, {
      popover: _ref => {
        let {
          visible,
          open,
          close
        } = _ref;
        return /*#__PURE__*/React.createElement(Login, null);
      }
    }, /*#__PURE__*/React.createElement("ul", {
      className: "navbar-nav ml-auto"
    }, /*#__PURE__*/React.createElement("li", {
      className: "nav-item active"
    }, /*#__PURE__*/React.createElement("button", {
      className: "nav-item nav-link nav-item-mobile sign-button"
    }, "Add Property")))), document.getElementById('link'));
  }

  render() {
    // const requiredLink = this.props.homeLink;
    // if (requiredLink){
    //     render(<a className='nav-link nav-item-mobile' href={'../'+requiredLink.link}>{requiredLink.text}</a>,
    //         document.getElementById('link')
    //         );
    // }        
    if (this.props.currentUser) {
      const user = this.props.currentUser.username;
      const profile = this.props.currentUser.profile; // document.getElementById("user-role").replaceWith(requiredLink.user);

      document.getElementById('nav-custom').classList.add('nav-custom'); // console.log("user", this.props.currentUser);

      return (
        /*#__PURE__*/
        // <div align='right' className='animated fadeInDownBig'>
        React.createElement("ul", {
          className: "navbar-nav ml-auto"
        }, /*#__PURE__*/React.createElement("li", {
          className: "nav-item active"
        }, /*#__PURE__*/React.createElement("a", {
          className: "nav-link nav-item-mobile",
          href: '/company/' + Meteor.userId()
        }, "My Properties")), /*#__PURE__*/React.createElement("li", {
          className: "nav-item active"
        }, /*#__PURE__*/React.createElement("button", {
          className: " nav-link nav-item-mobile sign-button",
          onClick: this.signout.bind(this)
        }, " Sign out ")), /*#__PURE__*/React.createElement("li", {
          className: "nav-item nav-item-mobile active"
        }, profile ? /*#__PURE__*/React.createElement("img", {
          className: "dp",
          src: profile.dp
        }) : /*#__PURE__*/React.createElement("img", {
          className: "dp",
          src: "images/a_sign.jpg"
        }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("div", {
          color: "black",
          className: "username"
        }, user))))
      );
    } else {
      const nav = document.getElementById('nav-custom');
      nav.classList.remove('nav-custom');
      nav.classList.add('not-loggin'); // this.addPropertiesPopup();

      return (
        /*#__PURE__*/
        // <div align='right'>
        React.createElement("ul", {
          className: "navbar-nav ml-auto"
        }, /*#__PURE__*/React.createElement(Popover, {
          popover: _ref2 => {
            let {
              visible,
              open,
              close
            } = _ref2;
            return /*#__PURE__*/React.createElement(Login, null);
          }
        }, /*#__PURE__*/React.createElement("li", {
          className: "nav-item active"
        }, /*#__PURE__*/React.createElement("button", {
          className: " nav-link nav-item-mobile sign-button"
        }, " Log In "))), /*#__PURE__*/React.createElement(Popover, {
          popover: _ref3 => {
            let {
              visible,
              open,
              close
            } = _ref3;
            return /*#__PURE__*/React.createElement(Signup, null);
          }
        }, /*#__PURE__*/React.createElement("li", {
          className: "nav-item active"
        }, /*#__PURE__*/React.createElement("button", {
          id: "signup-popup",
          className: " nav-link nav-item-mobile sign-button"
        }, " Sign Up ")))) // </div>

      );
    }
  }

}

;
module.exportDefault(withTracker(() => {
  Meteor.subscribe('homeLinks');
  return {
    currentUser: Meteor.user(),
    homeLink: HomeLinks.findOne({})
  };
})(Account));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Company.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Company.js                                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Plots;
module.link("../api/plots.js", {
  Plots(v) {
    Plots = v;
  }

}, 3);
let Plot;
module.link("./Plot.js", {
  default(v) {
    Plot = v;
  }

}, 4);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 5);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 6);

// import {HomeLinks} from '../api/home.js'
class Company extends Component {
  renderPlots() {
    let filteredPlots = this.props.plots;
    return filteredPlots.map(plot => {
      return /*#__PURE__*/React.createElement(Plot, {
        key: plot._id,
        plot: plot
      });
    });
  }

  renderCompanyData() {
    console.log("Windo id: ", window.location.pathname.match('[^/]*$')[0]);
    Meteor.call('users.companyData', window.location.pathname.match('[^/]*$')[0], (err, result) => {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log('Result Company: ', result);
        this.refs.phone.replaceWith(result[0].phone);

        if (result[0].intro) {
          this.refs.intro.replaceWith(result[0].intro);
        }

        if (result[0].link) {
          this.refs.link.replaceWith(result[0].link);
        }

        this.refs.address.replaceWith(result[0].address);
      }
    });
  }

  render() {
    this.renderCompanyData(); // console.log("comp: ", this.props.comp);

    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("h1", null, this.props.id, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("center", null, this.props.plots[0] ? this.props.plots[0].company : "")), /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      className: "company-intro"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "intro"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      className: "plot-data"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "address"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      ref: "link"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      ref: "phone"
    }), /*#__PURE__*/React.createElement("br", null))))), /*#__PURE__*/React.createElement("ul", {
      className: "plots"
    }, this.renderPlots()));
  }

}

module.exportDefault(withTracker(() => {
  Meteor.subscribe('plots'); // Meteor.subscribe('reviews');
  // Meteor.subscribe('homeLinks');

  return {
    // homeLink: HomeLinks.findOne({}),
    plots: Plots.find({
      owner: window.location.pathname.match('[^/]*$')[0]
    }, {
      sort: {
        createdAt: -1
      }
    }).fetch(),
    currentUser: Meteor.user(),
    // reviews: Reviews.find({company: (window.location.pathname).match('[^/]*$')[0]}).fetch(),
    // thisReviewer: Reviews.find({company: (window.location.pathname).match('[^/]*$')[0], reviewer: Meteor.userId()}).fetch(),
    comp: Meteor.users.findOne({
      _id: window.location.pathname.match('[^/]*$')[0]
    })
  };
})(Company));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Contact.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Contact.js                                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
module.link("../api/accounts.js");
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 3);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 4);

// import {HomeLinks} from '../api/home.js'
class Contact extends Component {
  render() {
    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
      className: "section contact-section"
    }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("h1", {
      className: "title",
      "data-aos": "fade-up"
    }, "Contact Us"), /*#__PURE__*/React.createElement("div", {
      className: "contact"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "fields-left"
    }, "Email Address:"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "info@aangan.pk")), /*#__PURE__*/React.createElement("h5", {
      className: "fields-left"
    }, "Phone Number:"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "03229773786")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "03345005652")), /*#__PURE__*/React.createElement("h5", {
      className: "fields-left"
    }, "Address:"), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "NSTP, NUST, H-12 ", /*#__PURE__*/React.createElement("br", null), " Islamabad"))))));
  }

}

;
module.exportDefault(withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(Contact));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"DisplayPlots.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/DisplayPlots.js                                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Plots;
module.link("../api/plots.js", {
  Plots(v) {
    Plots = v;
  }

}, 3);
let Plot;
module.link("./Plot.js", {
  default(v) {
    Plot = v;
  }

}, 4);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 5);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 6);

// import {HomeLinks} from '../api/home.js'
class App extends Component {
  city() {
    const locations = {
      'Punjab': {
        $in: ["Abdul Hakīm", "Ahmadabad", "Ahmadpur East", "Ahmadpur Siāl", "Ahmedpur Lumma", "Alīpur", "Alīpur Chatha", "Allahabad", "Arifwāla", "Attock", "Bahāwalnagar", "Bahāwalpur", "Basīrpur", "Bhakkar", "Bhalwāl", "Bhawana", "Bhera", "Bhopalwala", "Būrewāla", "Chak Jhumra", "Chakwāl", "Chaubara", "Chawinda", "Chenāb Nagar (Rabwāh)", "Chīchāwatni", "Chinīot", "Chishtiān", "Choa Saidanshah", "Chowk Āzam", "Chowk Sarwar Shahid", "Chūniān", "Dajal", "Daryā Khān", "Daska", "Dāūd Khel", "Daultala", "Dera Din Panah", "Dera Ghāzi Khān", "Khanpur", "Dhanote", "Dijkot", "Dīna", "Dinga", "Dīpālpur", "Dullewala", "Dūnga Būnga", "Dunyāpur", "Eminabad", "Faisalābād", "Faqīrwāli", "Farooqa", "Fārūqābād", "Fatehjang", "Fatehpur", "Fāzilpur", "Fīrozwāla", "Fort Abbās", "Garh Mahārāja", "Ghakhar", "Gogera", "Gojra", "Gūjar Khān", "Gujrānwāla", "Gujrānwāla Cantonment", "Gujrāt", "Hadāli", "Hāfizābād", "Hārūnābād", "Hasan Abdāl", "Hāsilpur", "Haveli Lakha", "Hazro", "Hujra Shāh Muqīm", "Isa Khel", "Jalālpur Bhattiān", "Jalālpur Jattan", "Jalālpur Pīrwāla", "Jāmke Chīma", "Jāmpur", "Jand", "Jandanwala", "Jarānwāla", "Jatoi", "Jauharābād", "Jehānian", "Jhang", "Jhawāriān", "Jhelum", "Kabīrwāla", "Kahror Pakka", "Kahuta", "Kalabagh", "Kallar Kahar", "Kallar Sayaddan", "Kalūr Kot", "Kamālia", "Kamar Mashani", "Kamīr", "Kāmoki", "Kāmra Cantonment", "Kanganpur", "Karampur", "Karor Lal Esan", "Kasūr", "Khairpur Tamewāli", "Khānewāl", "Khangarh", "Khānpur", "Khānqāh Dogrān", "Khāriān", "Khewra", "Khudiān", "Khuriānwāla", "Khushāb", "Kot Abdul Malik", "Kot Addu", "Kot Chutta", "Kotli Loharan", "Kotli Sattian", "Kot Mithan", "Kot Mūmin", "Kot Rādha Kishan", "Kot Samāba", "Kundiān", "Kunjāh", "Lāhore", "Lāla Mūsa", "Lāliān", "Layyah", "Liāquatābād", "Liāquatpur", "Lodhrān", "Ludhewāla Warrāich", "Mailsi", "Makhdoom Pur Pahuran", "Malakwāl", "Māmu Kānjan", "Mānānwāla Jodh Singh", "Mandi Bahāuddīn", "Miān Channū", "Miani", "Miānwāli", "Minchinābād", "Mitha Tiwāna", "Multān", "Murīdke", "Murree", "Mustafābād", "Muzaffargarh", "Nankāna Sahib", "Nārang", "Nārowāl", "Noorpur Thal", "Nowshera Virkān", "Okāra", "Okāra Cantonment", "Pākpattan", "Pasrūr", "Pattoki", "Phālia", "Phularwan", "Phūlnagar", "Pind Dadan Khan", "Pindi Bhattiān", "Pindi Gheb", "Pīr Mahal", "Qadirpur Ran", "Qila Dīdār Singh", "Quaidabad", "Rahīmyār Khān", "Rāja Jang", "Rājanpur", "Rāwalpindi", "Renāla Khurd", "Sādiqābād", "Safdarābād", "Sāhīwal", "Samasata", "Sambriāl", "Samundri", "Sanawan", "Sāngla Hill", "Sarāi Ālamgīr", "Sargodha", "Shadiwal", "Shāhkot", "Shahpur Sadar", "Shakargarh", "Sharqpur", "Shehr Sultan", "Sheikhūpura", "Shorkot", "Shorkot Cantonment", "Shujāābād", "Siālkot", "Sillānwāli", "Sohawa", "Sukheke", "Talagang", "Tāndliānwāla", "Taunsa", "Taxila", "Toba Tek Singh", "Trinda Sawai Khan", "Tulamba", "Uch", "Vehāri", "Wāh Cantonment", "Warburton", "Wazīrābād", "Yazmān", "Zafarwal", "Zāhir Pīr"]
      },
      'Sindh': {
        $in: ["Ahmedpur", "Arija", "Bādāh", "Badīn", "Bandhi", "Behram", "Bhan", "Bhiria Road", "Bhitshah", "Chachro", "Choondiko", "Chore Old", "Dādu", "Daharki", "Daur", "Dhoronaro", "Digri", "Dokri", "Faqirabad", "Gambat", "Gharo", "Ghauspur", "Ghotki", "Golarchi", "Guddu", "Hāla", "Halani", "Hingorja", "Husri", "Hyderābād", "Jacobābād", "Jam Nawaz Ali", "Jamshoro", "Jatia", "Jhol", "Jhudo", "Johi", "Kambar Ali Khān", "Kandhkot", "Kandiāro", "Karāchi", "Kario Ghanwer", "Kashmor", "Kazi Ahmed", "Khaīrpur", "Khairpur Nathan Shāh", "Khangarh", "Khipro", "Khoski", "Khuhra", "Kot Diji", "Kot Ghulam Muhammad", "Kotri", "Kunri", "Lakhi", "Lārkāna", "Madeji", "Makli", "Matiari", "Mātli", "Mehar", "Mehrābpur", "Mirokhan", "Mīrpur Khās", "Mīrpur Māthelo", "Mithi", "Mithiani", "Moro", "Nasīrābād", "Nasirpur", "Naudero", "Naukot", "Naushahro Feroze", "Nawābshāh", "New Saeedabad", "Pacca Chang", "Padidan", "Pano Āqil", "Pāno Āqil Cantonment", "Pīrjo Goth", "Piryaloi", "Qubo Saeed Khan", "Radhan", "Rajo Khanani", "Ranipur", "Ratodero", "Rohri", "Sakrand", "Salehpat", "Sānghar", "Sehwān", "Sethārja", "Shāhdādkot", "Shāhdādpur", "Shahpur Chakar", "Shikārpur", "Sinjhoro", "Sīta Road", "Sobhodero", "Sujāwal", "Sukkur", "Talhar", "Tando Ādam", "Tando Allāhyār", "Tando Ghulam Ali", "Tando Ghulam Hyder", "Tando Jām", "Tando Jan Muhammad", "Tando Mir Ali", "Tando Muhammad Khān", "Thari Mirwah", "Tharushah", "Thatta", "Therhi", "Thul", "Ubāuro", "Umerkot", "Warah"]
      },
      'KPK': {
        $in: ["Abbottābad", "Akora Khattak", "Amāngarh", "Bannu", "Barikot", "Bat Khela", "Behrain", "Chārsadda", "Chitrāl", "Dera Ismāil Khān", "Dīr", "Doaba", "Hangu", "Harīpur", "Havelian Cantonment", "Jehāngīra", "Kabal", "Karak", "Khalābat", "Khwazakhela", "Kohāt", "Kulachi", "Lachi", "Lakki Marwat", "Mānsehra", "Mardān", "Matta", "Mingawara", "Nawan Killi", "Nawanshehr", "Nowshera", "Pabbi", "Paharpur", "Paroa", "Peshāwar", "Risālpur Cantonment", "Serai Naurang", "Shabqadar", "Swābi", "Swat", "Takht Bhāi", "Tangi", "Tānk", "Thall", "Timargara", "Topi", "Tordher", "Utmānzai", "Zaida"]
      },
      'Balochistan': {
        $in: ["Awaran", "Bela", "Buleda", "Chaman", "Chitkān", "Dera Allāh Yār", "Dera Bugti", "Dera Murād Jamāli", "Gwādar", "Hub", "Huramzai", "Kalāt", "Khanozai", "Khārān", "Khuzdār", "Killa Abdullah", "Killa Saifullah", "Lorālāi", "Mastung", "Muslim Bagh", "Nal", "Nūshki", "Pasni", "Pishīn", "Quetta", "Saranan", "Sibi", "Sui", "Surab", "Tasp", "Tump", "Turbat", "Usta Muhammad", "Uthal", "Wadh", "Washuk", "Winder", "Zehri", "Zhob"]
      },
      'FATA': {
        $in: ["Jamrūd", "Landi Kotal", "Mīran Shāh", "Pārāchinār", "Sadda"]
      }
    };
    console.log("The value is: ", locations[this.refs.search.value]);

    if (locations[this.refs.search.value]) {
      // console.log("The value is: ", locations[this.refs.search.value]);
      return locations[this.refs.search.value];
    } else {
      return this.refs.search.value; // return {'q':'destination: ','l': this.refs.search.value};
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("this.refs.search.value: ", this.refs.search.value); // const loc = this.location();

    const search = {
      constructionDate: this.refs.constructionDate.value,
      //location: this.location(), //this.refs.search.value,
      // location: this.refs.location.value,
      price: parseInt(this.refs.priceRange.value),
      // size: this.refs.size.value,
      city: this.city(),
      type: this.refs.type.value,
      purpose: this.refs.purpose.value // destinationQuery: loc.q

    };

    if (this.refs.sizeMin.value > 0 && this.refs.sizeMax.value > 0) {
      search.sizeMin = parseFloat(this.refs.unit.value) * this.refs.sizeMin.value;
      search.sizeMax = parseFloat(this.refs.unit.value) * this.refs.sizeMax.value;
    }

    console.log("search: ", search);
    Meteor.call('plots.search', search, (error, result) => {
      console.log('error: ', error);

      if (error) {
        document.getElementsById('render-plots').replaceWith('No plot found');
      }

      console.log('result: ', result, result[0]);

      if (result.length == 0) {
        render( /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("h4", null, "No Plots found")), document.getElementById('render-plots'));
      } else {
        // console.log("Price: ", result[0].price-this.refs.priceRange.value);
        render(this.renderPlots(result), document.getElementById('render-plots'));
      }

      result = []; // this.refs.search.value = '';
      // this.refs.date.value = '';
      // this.refs.departure.value = ''
    });
  }

  renderPlots(filteredPlots) {
    return filteredPlots.map(plot => {
      return /*#__PURE__*/React.createElement(Plot, {
        key: plot._id,
        plot: plot
      });
    });
  }

  render() {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");

    if (slider) {
      output.innerHTML = slider.value;

      slider.oninput = function () {
        output.innerHTML = this.value;
      };
    }

    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      className: " translate"
    }, /*#__PURE__*/React.createElement("h1", null, "Plots"), /*#__PURE__*/React.createElement("div", {
      className: "search-form-div"
    }, /*#__PURE__*/React.createElement("form", {
      className: "search-form",
      onSubmit: this.handleSubmit.bind(this)
    }, /*#__PURE__*/React.createElement("div", {
      className: "slidecontainer search-fields"
    }, "Price Range:", /*#__PURE__*/React.createElement("input", {
      type: "range",
      min: "100000",
      max: "100000000",
      defaultValue: "100000",
      ref: "priceRange",
      className: "slider",
      id: "myRange"
    }), /*#__PURE__*/React.createElement("p", null, "Rs. ", /*#__PURE__*/React.createElement("span", {
      id: "demo"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "form-group search-fields"
    }, "City: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Location or Province",
      ref: "search",
      list: "cities"
    }), /*#__PURE__*/React.createElement("datalist", {
      id: "cities"
    }, /*#__PURE__*/React.createElement("option", null, "  Punjab   "), /*#__PURE__*/React.createElement("option", null, " KPK  "), /*#__PURE__*/React.createElement("option", null, " Sindh  "), /*#__PURE__*/React.createElement("option", null, " Balochistan "), /*#__PURE__*/React.createElement("option", null, " FATA "), /*#__PURE__*/React.createElement("option", null, "  Abbott\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Al\u012B\u0101bad  "), /*#__PURE__*/React.createElement("option", null, " Alp\u016Brai  "), /*#__PURE__*/React.createElement("option", null, " Altit "), /*#__PURE__*/React.createElement("option", null, " Askole "), /*#__PURE__*/React.createElement("option", null, " Astore "), /*#__PURE__*/React.createElement("option", null, " Athmuqam     "), /*#__PURE__*/React.createElement("option", null, " Attock City "), /*#__PURE__*/React.createElement("option", null, " Aw\u0101r\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Ayubia   "), /*#__PURE__*/React.createElement("option", null, " Babusar  "), /*#__PURE__*/React.createElement("option", null, " Bad\u012Bn    "), /*#__PURE__*/React.createElement("option", null, " B\u0101gh     "), /*#__PURE__*/React.createElement("option", null, " Bah\u0101walnagar    "), /*#__PURE__*/React.createElement("option", null, " Bah\u0101walpur  "), /*#__PURE__*/React.createElement("option", null, " Balghar "), /*#__PURE__*/React.createElement("option", null, " Bannu    "), /*#__PURE__*/React.createElement("option", null, " Barah Valley "), /*#__PURE__*/React.createElement("option", null, " Bard\u0101r   "), /*#__PURE__*/React.createElement("option", null, " B\u0101rkh\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Batgr\u0101m  "), /*#__PURE__*/React.createElement("option", null, " Bhakkar  "), /*#__PURE__*/React.createElement("option", null, " Bunji "), /*#__PURE__*/React.createElement("option", null, " Chakw\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Chalunka "), /*#__PURE__*/React.createElement("option", null, " Chaman   "), /*#__PURE__*/React.createElement("option", null, " Ch\u0101rsadda   "), /*#__PURE__*/React.createElement("option", null, " Chilas "), /*#__PURE__*/React.createElement("option", null, " Chil\u0101s   "), /*#__PURE__*/React.createElement("option", null, " Chiniot  "), /*#__PURE__*/React.createElement("option", null, " Chitr\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Chitral. "), /*#__PURE__*/React.createElement("option", null, " D\u0101du     "), /*#__PURE__*/React.createElement("option", null, " Daggar   "), /*#__PURE__*/React.createElement("option", null, " D\u0101lband\u012Bn   "), /*#__PURE__*/React.createElement("option", null, " Danyor "), /*#__PURE__*/React.createElement("option", null, " Dasu     "), /*#__PURE__*/React.createElement("option", null, " Dera All \u0101hy\u0101r   "), /*#__PURE__*/React.createElement("option", null, " Dera Bugti  "), /*#__PURE__*/React.createElement("option", null, " Dera Gh\u0101zi Kh\u0101n "), /*#__PURE__*/React.createElement("option", null, " Dera Ism\u0101\u012Bl Kh\u0101n    "), /*#__PURE__*/React.createElement("option", null, " Dera Mur\u0101d Jam\u0101li   "), /*#__PURE__*/React.createElement("option", null, " Eidg\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Fairy Meadows "), /*#__PURE__*/React.createElement("option", null, " Faisal\u0101b\u0101d  "), /*#__PURE__*/React.createElement("option", null, " G\u0101kuch   "), /*#__PURE__*/React.createElement("option", null, " Gand\u0101v\u0101  "), /*#__PURE__*/React.createElement("option", null, " Ghotki   "), /*#__PURE__*/React.createElement("option", null, " Gilgit   "), /*#__PURE__*/React.createElement("option", null, " Gorikot "), /*#__PURE__*/React.createElement("option", null, " Gujr\u0101nw\u0101la  "), /*#__PURE__*/React.createElement("option", null, " Gujr\u0101t   "), /*#__PURE__*/React.createElement("option", null, " Gulmit "), /*#__PURE__*/React.createElement("option", null, " Gw\u0101dar   "), /*#__PURE__*/React.createElement("option", null, " H\u0101fiz\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Haji Gham "), /*#__PURE__*/React.createElement("option", null, " Haldi "), /*#__PURE__*/React.createElement("option", null, " Hangu    "), /*#__PURE__*/React.createElement("option", null, " Har\u012Bpur  "), /*#__PURE__*/React.createElement("option", null, " Hassanabad Chorbat "), /*#__PURE__*/React.createElement("option", null, " Hunza "), /*#__PURE__*/React.createElement("option", null, " Hushe "), /*#__PURE__*/React.createElement("option", null, " Hussainabad "), /*#__PURE__*/React.createElement("option", null, " Hyder\u0101b\u0101d City  "), /*#__PURE__*/React.createElement("option", null, " Islamabad   "), /*#__PURE__*/React.createElement("option", null, " Jacob\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Jaglot "), /*#__PURE__*/React.createElement("option", null, " Jalal Abad "), /*#__PURE__*/React.createElement("option", null, " J\u0101mshoro     "), /*#__PURE__*/React.createElement("option", null, " Jhang City  "), /*#__PURE__*/React.createElement("option", null, " Jhang Sadr  "), /*#__PURE__*/React.createElement("option", null, " Jhelum   "), /*#__PURE__*/React.createElement("option", null, " Jutal "), /*#__PURE__*/React.createElement("option", null, " Kalam "), /*#__PURE__*/React.createElement("option", null, " Kal\u0101t    "), /*#__PURE__*/React.createElement("option", null, " Kandhkot     "), /*#__PURE__*/React.createElement("option", null, " Karachi  "), /*#__PURE__*/React.createElement("option", null, " Karak    "), /*#__PURE__*/React.createElement("option", null, " Karimabad "), /*#__PURE__*/React.createElement("option", null, " Kashmir  "), /*#__PURE__*/React.createElement("option", null, " Kas\u016Br    "), /*#__PURE__*/React.createElement("option", null, " Keris Valley "), /*#__PURE__*/React.createElement("option", null, " Khairpur     "), /*#__PURE__*/React.createElement("option", null, " Kh\u0101new\u0101l     "), /*#__PURE__*/React.createElement("option", null, " Khaplu "), /*#__PURE__*/React.createElement("option", null, " Kh\u0101r\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Kharfaq "), /*#__PURE__*/React.createElement("option", null, " Khush\u0101b  "), /*#__PURE__*/React.createElement("option", null, " Khuzd\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Koh\u0101t    "), /*#__PURE__*/React.createElement("option", null, " Kohlu    "), /*#__PURE__*/React.createElement("option", null, " Kotli    "), /*#__PURE__*/React.createElement("option", null, " Kumrat "), /*#__PURE__*/React.createElement("option", null, " Kumrat   "), /*#__PURE__*/React.createElement("option", null, " Kundi\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Lahore   "), /*#__PURE__*/React.createElement("option", null, " Lakki Marwat    "), /*#__PURE__*/React.createElement("option", null, " L\u0101rk\u0101na  "), /*#__PURE__*/React.createElement("option", null, " Leiah    "), /*#__PURE__*/React.createElement("option", null, " Lodhr\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Loralai  "), /*#__PURE__*/React.createElement("option", null, " Maiun "), /*#__PURE__*/React.createElement("option", null, " Malakand     "), /*#__PURE__*/React.createElement("option", null, " Mandi Bah\u0101udd\u012Bn "), /*#__PURE__*/React.createElement("option", null, " M\u0101nsehra     "), /*#__PURE__*/React.createElement("option", null, " Mardan   "), /*#__PURE__*/React.createElement("option", null, " Mas\u012Bw\u0101la     "), /*#__PURE__*/React.createElement("option", null, " Mastung  "), /*#__PURE__*/React.createElement("option", null, " Mati\u0101ri  "), /*#__PURE__*/React.createElement("option", null, " Mehra    "), /*#__PURE__*/React.createElement("option", null, " Mi\u0101nw\u0101li     "), /*#__PURE__*/React.createElement("option", null, " Minimarg "), /*#__PURE__*/React.createElement("option", null, " M\u012Brpur Kh\u0101s "), /*#__PURE__*/React.createElement("option", null, " Misgar "), /*#__PURE__*/React.createElement("option", null, " Mult\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Murree   "), /*#__PURE__*/React.createElement("option", null, " M\u016Bsa Khel B\u0101z\u0101r "), /*#__PURE__*/React.createElement("option", null, " Muzaffar garh    "), /*#__PURE__*/React.createElement("option", null, " Nagar Khas "), /*#__PURE__*/React.createElement("option", null, " Naltar Valley "), /*#__PURE__*/React.createElement("option", null, " Nank\u0101na  S\u0101hib   "), /*#__PURE__*/React.createElement("option", null, " Naran Kaghan. "), /*#__PURE__*/React.createElement("option", null, " N\u0101row\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Nasirabad "), /*#__PURE__*/React.createElement("option", null, " Nathia Gali "), /*#__PURE__*/React.createElement("option", null, " Naushahro F\u012Broz "), /*#__PURE__*/React.createElement("option", null, " Naw\u0101bsh\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Neelam "), /*#__PURE__*/React.createElement("option", null, " Neelam   "), /*#__PURE__*/React.createElement("option", null, " New M\u012Brpur  "), /*#__PURE__*/React.createElement("option", null, " Nowshera     "), /*#__PURE__*/React.createElement("option", null, " Ok\u0101ra    "), /*#__PURE__*/React.createElement("option", null, " Oshikhandass "), /*#__PURE__*/React.createElement("option", null, " P\u0101kpattan   "), /*#__PURE__*/React.createElement("option", null, " Palas "), /*#__PURE__*/React.createElement("option", null, " Panjg\u016Br  "), /*#__PURE__*/React.createElement("option", null, " Parachin\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Pasu "), /*#__PURE__*/React.createElement("option", null, " Pesh\u0101war     "), /*#__PURE__*/React.createElement("option", null, " Pishin   "), /*#__PURE__*/React.createElement("option", null, " Qila Abdull\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Qila Saifull\u0101h  "), /*#__PURE__*/React.createElement("option", null, " Quetta   "), /*#__PURE__*/React.createElement("option", null, " Rah\u012Bmy\u0101r  Kh\u0101n   "), /*#__PURE__*/React.createElement("option", null, " R\u0101janpur     "), /*#__PURE__*/React.createElement("option", null, " R\u0101wala Kot  "), /*#__PURE__*/React.createElement("option", null, " R\u0101walpindi  "), /*#__PURE__*/React.createElement("option", null, " Rawlakot     "), /*#__PURE__*/React.createElement("option", null, " S\u0101diq\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " S\u0101h\u012Bw\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Saidu Sharif    "), /*#__PURE__*/React.createElement("option", null, " S\u0101nghar  "), /*#__PURE__*/React.createElement("option", null, " Sargodha     "), /*#__PURE__*/React.createElement("option", null, " Serai    "), /*#__PURE__*/React.createElement("option", null, " Shahd\u0101d Kot "), /*#__PURE__*/React.createElement("option", null, " Sheikhupura "), /*#__PURE__*/React.createElement("option", null, " Shigar "), /*#__PURE__*/React.createElement("option", null, " Shik\u0101rpur   "), /*#__PURE__*/React.createElement("option", null, " Shimshal "), /*#__PURE__*/React.createElement("option", null, " Si\u0101lkot City    "), /*#__PURE__*/React.createElement("option", null, " Sibi    "), /*#__PURE__*/React.createElement("option", null, " Skardu "), /*#__PURE__*/React.createElement("option", null, " Sost "), /*#__PURE__*/React.createElement("option", null, " Sukkur   "), /*#__PURE__*/React.createElement("option", null, " Sultan Abad "), /*#__PURE__*/React.createElement("option", null, " Sw\u0101bi    "), /*#__PURE__*/React.createElement("option", null, "  Swat    "), /*#__PURE__*/React.createElement("option", null, " Taghafari "), /*#__PURE__*/React.createElement("option", null, " Tando All\u0101hy\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Tando Muhammad Kh\u0101n "), /*#__PURE__*/React.createElement("option", null, " T\u0101nk     "), /*#__PURE__*/React.createElement("option", null, " Taxila     "), /*#__PURE__*/React.createElement("option", null, " Thatta   "), /*#__PURE__*/React.createElement("option", null, " Timargara   "), /*#__PURE__*/React.createElement("option", null, " Toba Tek Singh  "), /*#__PURE__*/React.createElement("option", null, " Tolipeer     "), /*#__PURE__*/React.createElement("option", null, " Tolti Kharmang "), /*#__PURE__*/React.createElement("option", null, " Turbat   "), /*#__PURE__*/React.createElement("option", null, " Umarkot  "), /*#__PURE__*/React.createElement("option", null, " Upper Dir   "), /*#__PURE__*/React.createElement("option", null, " Uthal    "), /*#__PURE__*/React.createElement("option", null, " Vih\u0101ri   "), /*#__PURE__*/React.createElement("option", null, " Yugo "), /*#__PURE__*/React.createElement("option", null, " Zhob     "), /*#__PURE__*/React.createElement("option", null, " Zi\u0101rat   "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Size: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      ref: "sizeMin",
      placeholder: "Minimum size"
    }), /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "0",
      ref: "sizeMax",
      placeholder: "Maximum size"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      ref: "unit",
      id: "sel1"
    }, " ", /*#__PURE__*/React.createElement("br", null), " ", /*#__PURE__*/React.createElement("br", null), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("option", {
      value: "0.003673"
    }, "  Square Feet   "), /*#__PURE__*/React.createElement("option", {
      value: "0.033057"
    }, "  Square Yard   "), /*#__PURE__*/React.createElement("option", {
      value: "1"
    }, " Marla  "), /*#__PURE__*/React.createElement("option", {
      value: "20"
    }, " Kanal  "), /*#__PURE__*/React.createElement("option", {
      value: "160"
    }, " Acre  "), /*#__PURE__*/React.createElement("option", {
      value: "4000"
    }, " Marabba  "))), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Type: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      ref: "type",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", null, "  House   "), /*#__PURE__*/React.createElement("option", null, " Plot  "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Purpose: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      ref: "purpose",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Sell"
    }, "  Purchase   "), /*#__PURE__*/React.createElement("option", {
      value: "Rent"
    }, " Rent  "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Construction Date: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "date",
      ref: "constructionDate"
    })), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
      type: "submit"
    }, "Search"))))), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }))), /*#__PURE__*/React.createElement("ul", {
      className: "plots",
      id: "render-plots"
    }, this.renderPlots(this.props.plots)), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }));
  }

}

module.exportDefault(withTracker(() => {
  Meteor.subscribe('plots'); // Meteor.subscribe('userPlotBookings');
  // Meteor.subscribe('homeLinks');

  return {
    // homeLink: HomeLinks.findOne({}),
    plots: Plots.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch(),
    currentUser: Meteor.user() // userBookings: UserPlotBookings.find({}).fetch()

  };
})(App));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Home.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Home.js                                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let HomeLinks;
module.link("../api/home.js", {
  HomeLinks(v) {
    HomeLinks = v;
  }

}, 2);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 3);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 4);
let Reviews;
module.link("../api/reviews.js", {
  Reviews(v) {
    Reviews = v;
  }

}, 5);
let Review;
module.link("./Review.js", {
  default(v) {
    Review = v;
  }

}, 6);
let ReactDom;
module.link("react-dom", {
  default(v) {
    ReactDom = v;
  }

}, 7);
let Plots, UserPlotBookings;
module.link("../api/plots.js", {
  Plots(v) {
    Plots = v;
  },

  UserPlotBookings(v) {
    UserPlotBookings = v;
  }

}, 8);
let Plot;
module.link("./Plot.js", {
  default(v) {
    Plot = v;
  }

}, 9);
module.link("aos/dist/aos.css");
module.link("owl.carousel/dist/assets/owl.carousel.css");
module.link("owl.carousel");

class Home extends Component {
  city() {
    const locations = {
      'Punjab': {
        $in: ["Abdul Hakim", "Ahmadabad", "Ahmadpur East", "Ahmadpur Sial", "Ahmedpur Lumma", "Alipur", "Alipur Chatha", "Allahabad", "Arifwala", "Attock", "Bahawalnagar", "Bahawalpur", "Basirpur", "Bhakkar", "Bhalwal", "Bhawana", "Bhera", "Bhopalwala", "Burewala", "Chak Jhumra", "Chakwal", "Chaubara", "Chawinda", "Chenab Nagar (Rabwah)", "Chichawatni", "Chiniot", "Chishtian", "Choa Saidanshah", "Chowk azam", "Chowk Sarwar Shahid", "Chunian", "Dajal", "Darya Khan", "Daska", "Daud Khel", "Daultala", "Dera Din Panah", "Dera Ghazi Khan", "Khanpur", "Dhanote", "Dijkot", "Dina", "Dinga", "Dipalpur", "Dullewala", "Dunga Bunga", "Dunyapur", "Eminabad", "Faisalabad", "Faqirwali", "Farooqa", "Faruqabad", "Fatehjang", "Fatehpur", "Fazilpur", "Firozwala", "Fort Abbas", "Garh Maharaja", "Ghakhar", "Gogera", "Gojra", "Gujar Khan", "Gujranwala", "Gujranwala Cantonment", "Gujrat", "Hadali", "Hafizabad", "Harunabad", "Hasan Abdal", "Hasilpur", "Haveli Lakha", "Hazro", "Hujra Shah Muqim", "Isa Khel", "Jalalpur Bhattian", "Jalalpur Jattan", "Jalalpur Pirwala", "Jamke Chima", "Jampur", "Jand", "Jandanwala", "Jaranwala", "Jatoi", "Jauharabad", "Jehanian", "Jhang", "Jhawarian", "Jhelum", "Kabirwala", "Kahror Pakka", "Kahuta", "Kalabagh", "Kallar Kahar", "Kallar Sayaddan", "Kalur Kot", "Kamalia", "Kamar Mashani", "Kamir", "Kamoki", "Kamra Cantonment", "Kanganpur", "Karampur", "Karor Lal Esan", "Kasur", "Khairpur Tamewali", "Khanewal", "Khangarh", "Khanpur", "Khanqah Dogran", "Kharian", "Khewra", "Khudian", "Khurianwala", "Khushab", "Kot Abdul Malik", "Kot Addu", "Kot Chutta", "Kotli Loharan", "Kotli Sattian", "Kot Mithan", "Kot Mumin", "Kot Radha Kishan", "Kot Samaba", "Kundian", "Kunjah", "Lahore", "Lala Musa", "Lalian", "Layyah", "Liaquatabad", "Liaquatpur", "Lodhran", "Ludhewala Warraich", "Mailsi", "Makhdoom Pur Pahuran", "Malakwal", "Mamu Kanjan", "Mananwala Jodh Singh", "Mandi Bahauddin", "Mian Channu", "Miani", "Mianwali", "Minchinabad", "Mitha Tiwana", "Multan", "Muridke", "Murree", "Mustafabad", "Muzaffargarh", "Nankana Sahib", "Narang", "Narowal", "Noorpur Thal", "Nowshera Virkan", "Okara", "Okara Cantonment", "Pakpattan", "Pasrur", "Pattoki", "Phalia", "Phularwan", "Phulnagar", "Pind Dadan Khan", "Pindi Bhattian", "Pindi Gheb", "Pir Mahal", "Qadirpur Ran", "Qila Didar Singh", "Quaidabad", "Rahimyar Khan", "Raja Jang", "Rajanpur", "Rawalpindi", "Renala Khurd", "Sadiqabad", "Safdarabad", "Sahiwal", "Samasata", "Sambrial", "Samundri", "Sanawan", "Sangla Hill", "Sarai alamgir", "Sargodha", "Shadiwal", "Shahkot", "Shahpur Sadar", "Shakargarh", "Sharqpur", "Shehr Sultan", "Sheikhupura", "Shorkot", "Shorkot Cantonment", "Shujaabad", "Sialkot", "Sillanwali", "Sohawa", "Sukheke", "Talagang", "Tandlianwala", "Taunsa", "Taxila", "Toba Tek Singh", "Trinda Sawai Khan", "Tulamba", "Uch", "Vehari", "Wah Cantonment", "Warburton", "Wazirabad", "Yazman", "Zafarwal", "Zahir Pir"]
      },
      'Sindh': {
        $in: ["Ahmedpur", "Arija", "Badah", "Badin", "Bandhi", "Behram", "Bhan", "Bhiria Road", "Bhitshah", "Chachro", "Choondiko", "Chore Old", "Dadu", "Daharki", "Daur", "Dhoronaro", "Digri", "Dokri", "Faqirabad", "Gambat", "Gharo", "Ghauspur", "Ghotki", "Golarchi", "Guddu", "Hala", "Halani", "Hingorja", "Husri", "Hyderabad", "Jacobabad", "Jam Nawaz Ali", "Jamshoro", "Jatia", "Jhol", "Jhudo", "Johi", "Kambar Ali Khan", "Kandhkot", "Kandiaro", "Karachi", "Kario Ghanwer", "Kashmor", "Kazi Ahmed", "Khairpur", "Khairpur Nathan Shah", "Khangarh", "Khipro", "Khoski", "Khuhra", "Kot Diji", "Kot Ghulam Muhammad", "Kotri", "Kunri", "Lakhi", "Larkana", "Madeji", "Makli", "Matiari", "Matli", "Mehar", "Mehrabpur", "Mirokhan", "Mirpur Khas", "Mirpur Mathelo", "Mithi", "Mithiani", "Moro", "Nasirabad", "Nasirpur", "Naudero", "Naukot", "Naushahro Feroze", "Nawabshah", "New Saeedabad", "Pacca Chang", "Padidan", "Pano aqil", "Pano aqil Cantonment", "Pirjo Goth", "Piryaloi", "Qubo Saeed Khan", "Radhan", "Rajo Khanani", "Ranipur", "Ratodero", "Rohri", "Sakrand", "Salehpat", "Sanghar", "Sehwan", "Setharja", "Shahdadkot", "Shahdadpur", "Shahpur Chakar", "Shikarpur", "Sinjhoro", "Sita Road", "Sobhodero", "Sujawal", "Sukkur", "Talhar", "Tando adam", "Tando Allahyar", "Tando Ghulam Ali", "Tando Ghulam Hyder", "Tando Jam", "Tando Jan Muhammad", "Tando Mir Ali", "Tando Muhammad Khan", "Thari Mirwah", "Tharushah", "Thatta", "Therhi", "Thul", "Ubauro", "Umerkot", "Warah"]
      },
      'KPK': {
        $in: ["Abbottabad", "Akora Khattak", "Amangarh", "Bannu", "Barikot", "Bat Khela", "Behrain", "Charsadda", "Chitral", "Dera Ismail Khan", "Dir", "Doaba", "Hangu", "Haripur", "Havelian Cantonment", "Jehangira", "Kabal", "Karak", "Khalabat", "Khwazakhela", "Kohat", "Kulachi", "Lachi", "Lakki Marwat", "Mansehra", "Mardan", "Matta", "Mingawara", "Nawan Killi", "Nawanshehr", "Nowshera", "Pabbi", "Paharpur", "Paroa", "Peshawar", "Risalpur Cantonment", "Serai Naurang", "Shabqadar", "Swabi", "Swat", "Takht Bhai", "Tangi", "Tank", "Thall", "Timargara", "Topi", "Tordher", "Utmanzai", "Zaida"]
      },
      'Balochistan': {
        $in: ["Awaran", "Bela", "Buleda", "Chaman", "Chitkan", "Dera Allah Yar", "Dera Bugti", "Dera Murad Jamali", "Gwadar", "Hub", "Huramzai", "Kalat", "Khanozai", "Kharan", "Khuzdar", "Killa Abdullah", "Killa Saifullah", "Loralai", "Mastung", "Muslim Bagh", "Nal", "Nushki", "Pasni", "Pishin", "Quetta", "Saranan", "Sibi", "Sui", "Surab", "Tasp", "Tump", "Turbat", "Usta Muhammad", "Uthal", "Wadh", "Washuk", "Winder", "Zehri", "Zhob"]
      },
      'FATA': {
        $in: ["Jamrud", "Landi Kotal", "Miran Shah", "Parachinar", "Sadda"]
      }
    };
    console.log("The value is: ", locations[this.refs.search.value]);

    if (locations[this.refs.search.value]) {
      // console.log("The value is: ", locations[this.refs.search.value]);
      return locations[this.refs.search.value];
    } else {
      return this.refs.search.value; // return {'q':'destination: ','l': this.refs.search.value};
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("this.refs.search.value: ", this.refs.search.value); // const loc = this.location();

    const search = {
      constructionDate: this.refs.constructionDate.value,
      //location: this.location(), //this.refs.search.value,
      // location: this.refs.location.value,
      price: parseInt(this.refs.priceRange.value),
      // size: this.refs.size.value,
      city: this.city(),
      type: this.refs.type.value,
      purpose: this.refs.purpose.value // destinationQuery: loc.q

    };

    if (this.refs.sizeMin.value > 0 && this.refs.sizeMax.value > 0) {
      search.sizeMin = parseFloat(this.refs.unit.value) * this.refs.sizeMin.value;
      search.sizeMax = parseFloat(this.refs.unit.value) * this.refs.sizeMax.value;
    }

    if (search.type == 'null') {
      search.type = {
        $ne: ""
      };
    }

    if (search.purpose == 'null') {
      search.purpose = {
        $ne: ""
      };
    }

    console.log("search: ", search);
    Meteor.call('plots.search', search, (error, result) => {
      console.log('error: ', error);

      if (error) {
        document.getElementsById('render-plots').replaceWith('No plot found');
      }

      console.log('result: ', result, result[0]);

      if (result.length == 0) {
        render( /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("h4", null, "No Plots found")), document.getElementById('render-plots'));
      } else {
        // console.log("Price: ", result[0].price-this.refs.priceRange.value);
        render(this.renderPlots(result), document.getElementById('render-plots'));
        document.getElementById('home').innerText = "";
      }

      result = []; // this.refs.search.value = '';
      // this.refs.date.value = '';
      // this.refs.departure.value = ''
    });
  }

  renderPlots(filteredPlots) {
    return filteredPlots.map(plot => {
      return /*#__PURE__*/React.createElement(Plot, {
        key: plot._id,
        plot: plot
      });
    });
  }

  displayProperty() {
    if (this.props.plots) {
      console.log(this.props.plots);
      render(this.renderPlots(this.props.plots), document.getElementById('render-plots'));
      document.getElementById('home').innerText = "";
    }
  }

  renderAccounts() {
    ReactDom.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
  }

  render() {
    window.onload = function () {
      var sliderSections = document.getElementsByClassName("range-slider");

      for (var x = 0; x < sliderSections.length; x++) {
        var sliders = sliderSections[x].getElementsByTagName("input");

        for (var y = 0; y < sliders.length; y++) {
          if (sliders[y].type === "range") {
            sliders[y].oninput = getVals; // Manually trigger event first time to display values

            sliders[y].oninput();
          }
        }
      }
    };

    function getVals() {
      // Get slider values
      var parent = this.parentNode;
      var slides = parent.getElementsByTagName("input");
      var slide1 = parseFloat(slides[0].value);
      var slide2 = parseFloat(slides[1].value); // Neither slider will clip the other, so make sure we determine which is larger

      if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
      }

      var displayElement = document.getElementsByClassName("rangeValues")[0];
      displayElement.innerHTML = "Size: " + slide1 + "-" + slide2;
    } // window.onload()= function(){
    //     document.getElementById('top-section')='10px'
    // }
    // window.onload = function() {
    //     document.getElementById('top-section').height='10px';
    // };


    $(".owl-carousel").owlCarousel({
      items: 1,
      autoplay: true,
      // autoWidth: true,
      // heigth: 80,
      autoPlay: 1500 //Set AutoPlay to 3 seconds

    });
    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");

    if (slider) {
      output.innerHTML = slider.value;

      slider.oninput = function () {
        output.innerHTML = this.value;
      };
    }

    return /*#__PURE__*/React.createElement("div", null, this.renderAccounts(), /*#__PURE__*/React.createElement("section", {
      id: "top-section",
      className: "site-hero overlay page-outside"
    }, /*#__PURE__*/React.createElement("div", {
      className: "home-search"
    }, /*#__PURE__*/React.createElement("div", {
      className: "site-hero-inner"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      className: "name-quote"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "heading mb-4 animated swing"
    }, " Aangan "), /*#__PURE__*/React.createElement("p", {
      id: "home-description",
      className: "sub-heading mb-5  animated fadeInUpBig slower"
    }, "Aap ki khushion ka!"))), /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("div", {
      className: " translate"
    }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      id: "home-search-form",
      className: "search-form-div animated fadeInUpBig"
    }, /*#__PURE__*/React.createElement("form", {
      className: "search-form fadeInUpBig slower",
      onSubmit: this.handleSubmit.bind(this)
    }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      className: "input-type-fields"
    }, /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Unit: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "home-input",
      ref: "unit",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      value: "0.003673"
    }, "  Sq Feet   "), /*#__PURE__*/React.createElement("option", {
      value: "0.033057"
    }, "  Sq Yard   "), /*#__PURE__*/React.createElement("option", {
      selected: true,
      value: "1"
    }, " Marla  "), /*#__PURE__*/React.createElement("option", {
      value: "20"
    }, " Kanal  "), /*#__PURE__*/React.createElement("option", {
      value: "160"
    }, " Acre  "), /*#__PURE__*/React.createElement("option", {
      value: "4000"
    }, " Marabba  "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Type: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "home-input",
      ref: "type",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      value: "null",
      defaultValue: true
    }, "  Select   "), /*#__PURE__*/React.createElement("option", null, "  House   "), /*#__PURE__*/React.createElement("option", null, " Plot  "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Purpose: ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
      className: "home-input",
      ref: "purpose",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      value: "null",
      defaultValue: true
    }, "  Select   "), /*#__PURE__*/React.createElement("option", {
      value: "Sell"
    }, "  Purchase   "), /*#__PURE__*/React.createElement("option", {
      value: "Rent"
    }, " Rent  "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "City:", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      className: "home-input",
      type: "text",
      placeholder: "City",
      ref: "search",
      list: "cities"
    }), /*#__PURE__*/React.createElement("datalist", {
      id: "cities"
    }, /*#__PURE__*/React.createElement("option", null, "  Punjab   "), /*#__PURE__*/React.createElement("option", null, " KPK  "), /*#__PURE__*/React.createElement("option", null, " Sindh  "), /*#__PURE__*/React.createElement("option", null, " Balochistan "), /*#__PURE__*/React.createElement("option", null, " FATA "), /*#__PURE__*/React.createElement("option", null, "  Abbottabad   "), /*#__PURE__*/React.createElement("option", null, " Aliabad  "), /*#__PURE__*/React.createElement("option", null, " Alpurai  "), /*#__PURE__*/React.createElement("option", null, " Altit "), /*#__PURE__*/React.createElement("option", null, " Askole "), /*#__PURE__*/React.createElement("option", null, " Astore "), /*#__PURE__*/React.createElement("option", null, " Athmuqam     "), /*#__PURE__*/React.createElement("option", null, " Attock City "), /*#__PURE__*/React.createElement("option", null, " Awaran   "), /*#__PURE__*/React.createElement("option", null, " Ayubia   "), /*#__PURE__*/React.createElement("option", null, " Babusar  "), /*#__PURE__*/React.createElement("option", null, " Badin    "), /*#__PURE__*/React.createElement("option", null, " Bagh     "), /*#__PURE__*/React.createElement("option", null, " Bahawalnagar    "), /*#__PURE__*/React.createElement("option", null, " Bahawalpur  "), /*#__PURE__*/React.createElement("option", null, " Balghar "), /*#__PURE__*/React.createElement("option", null, " Bannu    "), /*#__PURE__*/React.createElement("option", null, " Barah Valley "), /*#__PURE__*/React.createElement("option", null, " Bardar   "), /*#__PURE__*/React.createElement("option", null, " Barkhan  "), /*#__PURE__*/React.createElement("option", null, " Batgram  "), /*#__PURE__*/React.createElement("option", null, " Bhakkar  "), /*#__PURE__*/React.createElement("option", null, " Bunji "), /*#__PURE__*/React.createElement("option", null, " Chakwal  "), /*#__PURE__*/React.createElement("option", null, " Chalunka "), /*#__PURE__*/React.createElement("option", null, " Chaman   "), /*#__PURE__*/React.createElement("option", null, " Charsadda   "), /*#__PURE__*/React.createElement("option", null, " Chilas "), /*#__PURE__*/React.createElement("option", null, " Chilas   "), /*#__PURE__*/React.createElement("option", null, " Chiniot  "), /*#__PURE__*/React.createElement("option", null, " Chitral  "), /*#__PURE__*/React.createElement("option", null, " Chitral. "), /*#__PURE__*/React.createElement("option", null, " Dadu     "), /*#__PURE__*/React.createElement("option", null, " Daggar   "), /*#__PURE__*/React.createElement("option", null, " Dalbandin   "), /*#__PURE__*/React.createElement("option", null, " Danyor "), /*#__PURE__*/React.createElement("option", null, " Dasu     "), /*#__PURE__*/React.createElement("option", null, " Dera All ahyar   "), /*#__PURE__*/React.createElement("option", null, " Dera Bugti  "), /*#__PURE__*/React.createElement("option", null, " Dera Ghazi Khan "), /*#__PURE__*/React.createElement("option", null, " Dera Ismail Khan    "), /*#__PURE__*/React.createElement("option", null, " Dera Murad Jamali   "), /*#__PURE__*/React.createElement("option", null, " Eidgah   "), /*#__PURE__*/React.createElement("option", null, " Fairy Meadows "), /*#__PURE__*/React.createElement("option", null, " Faisalabad  "), /*#__PURE__*/React.createElement("option", null, " Gakuch   "), /*#__PURE__*/React.createElement("option", null, " Gandava  "), /*#__PURE__*/React.createElement("option", null, " Ghotki   "), /*#__PURE__*/React.createElement("option", null, " Gilgit   "), /*#__PURE__*/React.createElement("option", null, " Gorikot "), /*#__PURE__*/React.createElement("option", null, " Gujranwala  "), /*#__PURE__*/React.createElement("option", null, " Gujrat   "), /*#__PURE__*/React.createElement("option", null, " Gulmit "), /*#__PURE__*/React.createElement("option", null, " Gwadar   "), /*#__PURE__*/React.createElement("option", null, " Hafizabad   "), /*#__PURE__*/React.createElement("option", null, " Haji Gham "), /*#__PURE__*/React.createElement("option", null, " Haldi "), /*#__PURE__*/React.createElement("option", null, " Hangu    "), /*#__PURE__*/React.createElement("option", null, " Haripur  "), /*#__PURE__*/React.createElement("option", null, " Hassanabad Chorbat "), /*#__PURE__*/React.createElement("option", null, " Hunza "), /*#__PURE__*/React.createElement("option", null, " Hushe "), /*#__PURE__*/React.createElement("option", null, " Hussainabad "), /*#__PURE__*/React.createElement("option", null, " Hyderabad City  "), /*#__PURE__*/React.createElement("option", null, " Islamabad   "), /*#__PURE__*/React.createElement("option", null, " Jacobabad   "), /*#__PURE__*/React.createElement("option", null, " Jaglot "), /*#__PURE__*/React.createElement("option", null, " Jalal Abad "), /*#__PURE__*/React.createElement("option", null, " Jamshoro     "), /*#__PURE__*/React.createElement("option", null, " Jhang City  "), /*#__PURE__*/React.createElement("option", null, " Jhang Sadr  "), /*#__PURE__*/React.createElement("option", null, " Jhelum   "), /*#__PURE__*/React.createElement("option", null, " Jutal "), /*#__PURE__*/React.createElement("option", null, " Kalam "), /*#__PURE__*/React.createElement("option", null, " Kalat    "), /*#__PURE__*/React.createElement("option", null, " Kandhkot     "), /*#__PURE__*/React.createElement("option", null, " Karachi  "), /*#__PURE__*/React.createElement("option", null, " Karak    "), /*#__PURE__*/React.createElement("option", null, " Karimabad "), /*#__PURE__*/React.createElement("option", null, " Kashmir  "), /*#__PURE__*/React.createElement("option", null, " Kasur    "), /*#__PURE__*/React.createElement("option", null, " Keris Valley "), /*#__PURE__*/React.createElement("option", null, " Khairpur     "), /*#__PURE__*/React.createElement("option", null, " Khanewal     "), /*#__PURE__*/React.createElement("option", null, " Khaplu "), /*#__PURE__*/React.createElement("option", null, " Kharan   "), /*#__PURE__*/React.createElement("option", null, " Kharfaq "), /*#__PURE__*/React.createElement("option", null, " Khushab  "), /*#__PURE__*/React.createElement("option", null, " Khuzdar  "), /*#__PURE__*/React.createElement("option", null, " Kohat    "), /*#__PURE__*/React.createElement("option", null, " Kohlu    "), /*#__PURE__*/React.createElement("option", null, " Kotli    "), /*#__PURE__*/React.createElement("option", null, " Kumrat "), /*#__PURE__*/React.createElement("option", null, " Kumrat   "), /*#__PURE__*/React.createElement("option", null, " Kundian  "), /*#__PURE__*/React.createElement("option", null, " Lahore   "), /*#__PURE__*/React.createElement("option", null, " Lakki Marwat    "), /*#__PURE__*/React.createElement("option", null, " Larkana  "), /*#__PURE__*/React.createElement("option", null, " Leiah    "), /*#__PURE__*/React.createElement("option", null, " Lodhran  "), /*#__PURE__*/React.createElement("option", null, " Loralai  "), /*#__PURE__*/React.createElement("option", null, " Maiun "), /*#__PURE__*/React.createElement("option", null, " Malakand     "), /*#__PURE__*/React.createElement("option", null, " Mandi Bahauddin "), /*#__PURE__*/React.createElement("option", null, " Mansehra     "), /*#__PURE__*/React.createElement("option", null, " Mardan   "), /*#__PURE__*/React.createElement("option", null, " Masiwala     "), /*#__PURE__*/React.createElement("option", null, " Mastung  "), /*#__PURE__*/React.createElement("option", null, " Matiari  "), /*#__PURE__*/React.createElement("option", null, " Mehra    "), /*#__PURE__*/React.createElement("option", null, " Mianwali     "), /*#__PURE__*/React.createElement("option", null, " Minimarg "), /*#__PURE__*/React.createElement("option", null, " Mirpur Khas "), /*#__PURE__*/React.createElement("option", null, " Misgar "), /*#__PURE__*/React.createElement("option", null, " Multan   "), /*#__PURE__*/React.createElement("option", null, " Murree   "), /*#__PURE__*/React.createElement("option", null, " Musa Khel Bazar "), /*#__PURE__*/React.createElement("option", null, " Muzaffar garh    "), /*#__PURE__*/React.createElement("option", null, " Nagar Khas "), /*#__PURE__*/React.createElement("option", null, " Naltar Valley "), /*#__PURE__*/React.createElement("option", null, " Nankana  Sahib   "), /*#__PURE__*/React.createElement("option", null, " Naran Kaghan. "), /*#__PURE__*/React.createElement("option", null, " Narowal  "), /*#__PURE__*/React.createElement("option", null, " Nasirabad "), /*#__PURE__*/React.createElement("option", null, " Nathia Gali "), /*#__PURE__*/React.createElement("option", null, " Naushahro Firoz "), /*#__PURE__*/React.createElement("option", null, " Nawabshah   "), /*#__PURE__*/React.createElement("option", null, " Neelam "), /*#__PURE__*/React.createElement("option", null, " Neelam   "), /*#__PURE__*/React.createElement("option", null, " New Mirpur  "), /*#__PURE__*/React.createElement("option", null, " Nowshera     "), /*#__PURE__*/React.createElement("option", null, " Okara    "), /*#__PURE__*/React.createElement("option", null, " Oshikhandass "), /*#__PURE__*/React.createElement("option", null, " Pakpattan   "), /*#__PURE__*/React.createElement("option", null, " Palas "), /*#__PURE__*/React.createElement("option", null, " Panjgur  "), /*#__PURE__*/React.createElement("option", null, " Parachinar  "), /*#__PURE__*/React.createElement("option", null, " Pasu "), /*#__PURE__*/React.createElement("option", null, " Peshawar     "), /*#__PURE__*/React.createElement("option", null, " Pishin   "), /*#__PURE__*/React.createElement("option", null, " Qila Abdullah   "), /*#__PURE__*/React.createElement("option", null, " Qila Saifullah  "), /*#__PURE__*/React.createElement("option", null, " Quetta   "), /*#__PURE__*/React.createElement("option", null, " Rahimyar  Khan   "), /*#__PURE__*/React.createElement("option", null, " Rajanpur     "), /*#__PURE__*/React.createElement("option", null, " Rawala Kot  "), /*#__PURE__*/React.createElement("option", null, " Rawalpindi  "), /*#__PURE__*/React.createElement("option", null, " Rawlakot     "), /*#__PURE__*/React.createElement("option", null, " Sadiqabad   "), /*#__PURE__*/React.createElement("option", null, " Sahiwal  "), /*#__PURE__*/React.createElement("option", null, " Saidu Sharif    "), /*#__PURE__*/React.createElement("option", null, " Sanghar  "), /*#__PURE__*/React.createElement("option", null, " Sargodha     "), /*#__PURE__*/React.createElement("option", null, " Serai    "), /*#__PURE__*/React.createElement("option", null, " Shahdad Kot "), /*#__PURE__*/React.createElement("option", null, " Sheikhupura "), /*#__PURE__*/React.createElement("option", null, " Shigar "), /*#__PURE__*/React.createElement("option", null, " Shikarpur   "), /*#__PURE__*/React.createElement("option", null, " Shimshal "), /*#__PURE__*/React.createElement("option", null, " Sialkot City    "), /*#__PURE__*/React.createElement("option", null, " Sibi    "), /*#__PURE__*/React.createElement("option", null, " Skardu "), /*#__PURE__*/React.createElement("option", null, " Sost "), /*#__PURE__*/React.createElement("option", null, " Sukkur   "), /*#__PURE__*/React.createElement("option", null, " Sultan Abad "), /*#__PURE__*/React.createElement("option", null, " Swabi    "), /*#__PURE__*/React.createElement("option", null, "  Swat    "), /*#__PURE__*/React.createElement("option", null, " Taghafari "), /*#__PURE__*/React.createElement("option", null, " Tando Allahyar  "), /*#__PURE__*/React.createElement("option", null, " Tando Muhammad Khan "), /*#__PURE__*/React.createElement("option", null, " Tank     "), /*#__PURE__*/React.createElement("option", null, " Taxila     "), /*#__PURE__*/React.createElement("option", null, " Thatta   "), /*#__PURE__*/React.createElement("option", null, " Timargara   "), /*#__PURE__*/React.createElement("option", null, " Toba Tek Singh  "), /*#__PURE__*/React.createElement("option", null, " Tolipeer     "), /*#__PURE__*/React.createElement("option", null, " Tolti Kharmang "), /*#__PURE__*/React.createElement("option", null, " Turbat   "), /*#__PURE__*/React.createElement("option", null, " Umarkot  "), /*#__PURE__*/React.createElement("option", null, " Upper Dir   "), /*#__PURE__*/React.createElement("option", null, " Uthal    "), /*#__PURE__*/React.createElement("option", null, " Vihari   "), /*#__PURE__*/React.createElement("option", null, " Yugo "), /*#__PURE__*/React.createElement("option", null, " Zhob     "), /*#__PURE__*/React.createElement("option", null, " Ziarat   "))), /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, "Date:", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      className: "home-input",
      type: "date",
      ref: "constructionDate"
    }))), screen.width > 600 ? /*#__PURE__*/React.createElement("div", {
      className: "search-button"
    }, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
      className: "pt-4 animated fadeInUpBig",
      id: "home-plots"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn uppercase btn-outline-light d-sm-inline d-block py-3 ",
      id: "find-button",
      type: "submit"
    }, "Find"))) : "", /*#__PURE__*/React.createElement("div", {
      className: "sliders"
    }, /*#__PURE__*/React.createElement("div", {
      className: "slider-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "search-fields"
    }, /*#__PURE__*/React.createElement("section", {
      className: "range-slider"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rangeValues",
      id: "size-range"
    }), /*#__PURE__*/React.createElement("input", {
      defaultValue: "00",
      min: "0",
      max: "500",
      ref: "sizeMin",
      type: "range"
    }), /*#__PURE__*/React.createElement("input", {
      defaultValue: "500",
      min: "0",
      max: "500",
      ref: "sizeMax",
      type: "range"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "slider-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "slidecontainer search-fields"
    }, "Rs. ", /*#__PURE__*/React.createElement("span", {
      id: "demo"
    }), /*#__PURE__*/React.createElement("input", {
      className: "home-input",
      type: "range",
      min: "100000",
      max: "1000000000",
      defaultValue: "1000000000",
      ref: "priceRange",
      className: "slider",
      id: "myRange"
    })))), screen.width < 600 ? /*#__PURE__*/React.createElement("div", {
      className: "search-button"
    }, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", {
      className: "pt-4 animated fadeInUpBig",
      id: "home-plots"
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn uppercase btn-outline-light d-sm-inline d-block py-3 ",
      id: "find-button",
      type: "submit"
    }, "Find"))) : "")))))), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }))))), /*#__PURE__*/React.createElement("div", {
      id: "home"
    }, /*#__PURE__*/React.createElement("section", {
      className: "section visit-section bg-light-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row justify-content-center text-center mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-8 "
    }, /*#__PURE__*/React.createElement("h2", {
      className: "heading",
      "data-aos": "fade-up"
    }, "Platinum Agencies"), /*#__PURE__*/React.createElement("p", {
      className: "lead",
      "data-aos": "fade-up"
    }, "Find the best Real Estate agencies here"))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-lg-3 col-md-6 visit mb-3",
      "data-aos": "fade-right"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/img_8.jpg",
      alt: "Image placeholder",
      className: "img-fluid"
    }), " "), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "Emaraat"))), /*#__PURE__*/React.createElement("div", {
      className: "col-lg-3 col-md-6 visit mb-3",
      "data-aos": "fade-right",
      "data-aos-delay": "100"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/img_7.jpg",
      alt: "Image placeholder",
      className: "img-fluid"
    }), " "), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "E-Build Pakistan"))), /*#__PURE__*/React.createElement("div", {
      className: "col-lg-3 col-md-6 visit mb-3",
      "data-aos": "fade-right",
      "data-aos-delay": "200"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/img_4.jpg",
      alt: "Image placeholder",
      className: "img-fluid"
    }), " "), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "Agency 21"))), /*#__PURE__*/React.createElement("div", {
      className: "col-lg-3 col-md-6 visit mb-3",
      "data-aos": "fade-right",
      "data-aos-delay": "300"
    }, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/images/img_5.jpg",
      alt: "Image placeholder",
      className: "img-fluid"
    }), " "), /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("a", {
      href: "/"
    }, "Irfan Real Estate")))), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      className: "row justify-content-center text-center mb-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-8 "
    }, /*#__PURE__*/React.createElement("h2", {
      className: "heading",
      "data-aos": "fade-up"
    }, "Featured Properties"))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, /*#__PURE__*/React.createElement("img", {
      class: "card-img-top scale-on-hover",
      src: "https://aanganpull.b-cdn.net/featured/featured%20(3).jpg",
      alt: "Card Image"
    })), /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("a", {
      href: "https://www.aangan.pk"
    }, /*#__PURE__*/React.createElement("b", null, "Florence Galleria"))), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "Islamabad"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "60%",
        float: "left",
        borderRight: "1px solid black"
      }
    }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("b", null, " Starting from")), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "25 Crores")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "40%",
        float: "left"
      }
    }, /*#__PURE__*/React.createElement("h5", null, "Contact")))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, /*#__PURE__*/React.createElement("img", {
      class: "card-img-top scale-on-hover",
      src: "https://aanganpull.b-cdn.net/featured/featured%20(2).jpg",
      alt: "Card Image"
    })), /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("a", {
      href: "https://www.aangan.pk"
    }, /*#__PURE__*/React.createElement("b", null, "Florence Galleria"))), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "Islamabad"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "60%",
        float: "left",
        borderRight: "1px solid black"
      }
    }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("b", null, " Starting from")), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "25 Crores")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "40%",
        float: "left"
      }
    }, /*#__PURE__*/React.createElement("h5", null, "Contact")))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card border-0"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, /*#__PURE__*/React.createElement("img", {
      class: "card-img-top scale-on-hover",
      src: "https://aanganpull.b-cdn.net/featured/featured%20(3).jpg",
      alt: "Card Image"
    })), /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("a", {
      href: "https://www.aangan.pk"
    }, /*#__PURE__*/React.createElement("b", null, "Florence Galleria"))), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "Islamabad"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "60%",
        float: "left",
        borderRight: "1px solid black"
      }
    }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("b", null, " Starting from")), /*#__PURE__*/React.createElement("h6", {
      className: "text-muted card-text"
    }, "25 Crores")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "40%",
        float: "left"
      }
    }, /*#__PURE__*/React.createElement("h5", null, "Contact")))))))))), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }), /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("ul", {
      className: "plots",
      id: "render-plots"
    }), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    })), /*#__PURE__*/React.createElement("div", {
      className: "ending"
    }));
  }

}

;
module.exportDefault(withTracker(() => {
  Meteor.subscribe('homeLinks');
  Meteor.subscribe('plots');
  return {
    homeLink: HomeLinks.findOne({}),
    plots: Plots.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch()
  };
})(Home));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"IndividualPlot.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/IndividualPlot.js                                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 2);
let Plots, UserPlotBookings;
module.link("../api/plots.js", {
  Plots(v) {
    Plots = v;
  },

  UserPlotBookings(v) {
    UserPlotBookings = v;
  }

}, 3);
let Plot;
module.link("./Plot.js", {
  default(v) {
    Plot = v;
  }

}, 4);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 5);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 6);
module.link("aos/dist/aos.css");
module.link("owl.carousel/dist/assets/owl.carousel.css");
module.link("owl.carousel");

class IndividualPlot extends Component {
  constructor(props) {
    super(props);
  }

  renderPlots() {
    let filteredPlots = this.props.plots;
    return filteredPlots.map(plot => {
      return /*#__PURE__*/React.createElement(Plot, {
        key: plot._id,
        plot: plot
      });
    });
  }

  renderImages() {
    let images = this.props.plots[0].images;
    console.log("In renderimages", this.props.plots);
    return images.map(image => {
      console.log(image);
      return /*#__PURE__*/React.createElement("div", {
        className: "extra-images"
      }, /*#__PURE__*/React.createElement("img", {
        className: "multiple-images",
        src: '/uploads/' + this.props.plots[0]._id + '/' + image,
        alt: "Image placeholder",
        className: "img-fluid"
      }));
    });
  }

  render() {
    $(".owl-carousel").owlCarousel({
      items: 1,
      autoplay: true,
      autoPlay: 1500 //Set AutoPlay to 3 seconds

    });
    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin'));
    const plot = this.props.plots[0];
    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("h1", null, "Plot"))), /*#__PURE__*/React.createElement("ul", {
      className: "plots"
    }, this.renderPlots(), plot ? /*#__PURE__*/React.createElement("div", {
      className: "plot-detail"
    }, /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }), plot.detail, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null)) : ""), plot ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12"
    }, this.renderImages())))) : "", /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }));
  }

}

;
module.exportDefault(withTracker(() => {
  Meteor.subscribe('plots');
  Meteor.subscribe('Meteor.users');
  console.log("userid: ", Meteor.userId());
  return {
    plots: Plots.find({
      _id: window.location.pathname.match('[^/]*$')[0]
    }).fetch(),
    currentUser: Meteor.user()
  };
})(IndividualPlot));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Login.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Login.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let HomeLinks;
module.link("../api/home.js", {
  HomeLinks(v) {
    HomeLinks = v;
  }

}, 1);

class Login extends Component {
  onSubmit(event) {
    event.preventDefault();
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        console.log("Got error: ", error);
        this.refs.invaliddata.replaceWith(error);
      } else {
        console.log("successful"); // window.location.pathname = '/';
      }
    });
    fetch("https://sendpk.com/api/sms.php?api_key=923229773430-d6956b96-1790-4c9b-9354-3f5f0d895901&sender=Aangan&mobile=923489773430&message=HelloWorld").then(result => {
      console.log("Result: ", result);
    });
  }

  signinFacebook() {
    console.log("in signin facebook");
    Meteor.loginWithFacebook(error => {
      console.log(error);
    });
  }

  render() {
    console.log("history: ", history);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("form", {
      action: "#",
      method: "post",
      className: "bg-white p-md-5 p-4 mb-5 border-primary",
      onSubmit: this.onSubmit.bind(this)
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group"
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      ref: "username",
      className: "form-control ",
      placeholder: "Username"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group"
    }, /*#__PURE__*/React.createElement("input", {
      type: "password",
      ref: "password",
      className: "form-control ",
      placeholder: "Password"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group"
    }, /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn btn-primary"
    }, "Log In"))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 form-group error"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "invaliddata"
    })), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group"
    }, /*#__PURE__*/React.createElement("p", null, "Not a User?"))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group"
    }, /*#__PURE__*/React.createElement("a", {
      className: "btn btn-primary",
      href: "../signup"
    }, "Sign Up")))), /*#__PURE__*/React.createElement("button", {
      onClick: this.signinFacebook,
      className: "btn btn-primary"
    }, "Log In Facebook")), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }));
  }

}

;
module.exportDefault(Login);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Plot.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Plot.js                                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  default: () => Plot
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 1);
let classnames;
module.link("classnames", {
  default(v) {
    classnames = v;
  }

}, 2);

class Plot extends Component {
  handleRemove() {
    var remove = confirm("Sure you want to delete this?");

    if (remove == true) {
      Meteor.call('plots.remove', this.props.plot._id);
    }
  }

  getPhone(id) {
    Meteor.call('plot.companyPhone', id, (err, result) => {
      if (result) {
        // console.log("Phone result:", result)
        this.refs.phone.replaceWith(result);
        return result;
      }
    });
  }

  render() {
    const plotClassName = classnames({
      checked: this.props.plot.checked,
      private: this.props.plot.private
    });
    console.log("plot", this.props.plot);

    if (!this.props.plot.phone) {
      const phone = this.getPhone(this.props.plot.company);
    }

    return /*#__PURE__*/React.createElement("li", {
      className: plotClassName
    }, /*#__PURE__*/React.createElement("div", {
      className: "plot-box"
    }, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("span", {
      className: "text"
    }, Meteor.userId() == this.props.plot.owner ? /*#__PURE__*/React.createElement("div", {
      className: "delete"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: this.handleRemove.bind(this)
    }, "x")) : "", /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement("h2", {
      className: "plot-name"
    }, /*#__PURE__*/React.createElement("center", null, /*#__PURE__*/React.createElement("a", {
      href: "../IndividualPlot/" + this.props.plot._id
    }, this.props.plot.city + " " + (this.props.plot.size | 0), " ")))), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      className: "plot-basic-info",
      "data-aos": "fade-right"
    }, /*#__PURE__*/React.createElement("b", null, "Company:"), " ", /*#__PURE__*/React.createElement("a", {
      className: "plot-name",
      href: '../Company/' + this.props.plot.owner
    }, this.props.plot.company), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Size:"), " ", /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, " ", this.props.plot.size), " Marlas ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Cost:"), /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, "  Rs. ", this.props.plot.price, " "), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "City:"), /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, " ", this.props.plot.city, " "), " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "Location:"), /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, " ", this.props.plot.location, " "), " ", /*#__PURE__*/React.createElement("br", null), this.props.plot.phone ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Phone:"), " ", /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, this.props.plot.phone, " "), /*#__PURE__*/React.createElement("br", null)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Phone:"), " ", /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "phone"
    }), " "), /*#__PURE__*/React.createElement("br", null), this.getPhone(this.props.plot.owner)), this.props.plot.type == "House" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, "Construction Date:"), " ", /*#__PURE__*/React.createElement("span", {
      className: "plot-data"
    }, this.props.plot.constructionDate, " "), /*#__PURE__*/React.createElement("br", null)) : "", /*#__PURE__*/React.createElement("div", {
      className: "plot-destination"
    }, /*#__PURE__*/React.createElement("b", null, "Type:"), " ", this.props.plot.type, " ", /*#__PURE__*/React.createElement("br", null))), /*#__PURE__*/React.createElement("div", {
      className: "plot-img",
      "data-aos": "fade-left"
    }, /*#__PURE__*/React.createElement("img", {
      className: "img-fluid",
      src: this.props.plot.image,
      alt: "image",
      width: "100%",
      height: "100%"
    })), /*#__PURE__*/React.createElement("br", null), this.props.plot.multipleImages ? /*#__PURE__*/React.createElement("img", {
      className: "img-fluid",
      src: this.props.plot.multipleImages,
      alt: "images",
      width: "100%",
      height: "100%"
    }) : "", /*#__PURE__*/React.createElement("br", null))));
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PlotCompany.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/PlotCompany.js                                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Plots;
module.link("../api/plots.js", {
  Plots(v) {
    Plots = v;
  }

}, 3);
let Plot;
module.link("./Plot.js", {
  default(v) {
    Plot = v;
  }

}, 4);
let Account;
module.link("./Account", {
  default(v) {
    Account = v;
  }

}, 5);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 6);
let HomeLinks;
module.link("../api/home.js", {
  HomeLinks(v) {
    HomeLinks = v;
  }

}, 7);
let post, data;
module.link("jquery", {
  post(v) {
    post = v;
  },

  data(v) {
    data = v;
  }

}, 8);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false
    };
  }

  uploadImages() {
    console.log("Upload images called");
    var arr = [];
    var files = document.getElementById("images").files; //FileList object

    console.log(files);

    function readfile(i) {
      var file = files[i]; //Only pics

      if (!file.type.match('image')) {
        if (i + 1 < files.length) readfile(i + 1);
      }

      ;
      console.log('ImageFIles: ', file);
      var picReader = new FileReader();
      picReader.addEventListener("load", function (event) {
        console.log("target", event.target);
        arr.push({
          name: file.name,
          data: event.target.result
        });
      }); //Read the image

      picReader.readAsDataURL(file);

      if (i + 1 < files.length) {
        readfile(i + 1);
      }
    }

    if (files.length > 0) {
      readfile(0);
    }

    return arr;
  }

  createProperty() {
    const today = new Date();
    const constructionDate = new Date(this.refs.constructionDate.value); //make it optional. Tbc

    var uploadedImage = this.uploadImages();
    const plot = {
      userId: Meteor.userId(),
      // size : this.refs.size.value, //add units. tbc
      phone: this.refs.phone.value,
      purpose: this.refs.purpose.value,
      // cnic : this.refs.cnic.value,
      constructionDate: this.refs.constructionDate.value,
      city: this.refs.city.value,
      location: this.refs.location.value,
      price: parseInt(this.refs.price.value),
      detail: this.refs.detail.value,
      images: uploadedImage,
      type: this.refs.type.value
    };
    var flag = true;

    if (this.refs.size.value > 0) {
      plot.size = parseFloat(this.refs.unit.value) * this.refs.size.value;
    } else {
      flag = false;
      this.refs.incorrectSize.replaceWith('Enter valid size');
    }

    if (today < constructionDate) {
      flag = false;
      this.refs.incorrectDate.replaceWith("Enter the past date");
    } // if (plot.size < 0){
    //   flag = false
    //   this.refs.incorrectSize.replaceWith('Enter valid size');
    // }


    if (plot.price < 0) {
      flag = false;
      this.refs.incorrectPrice.replaceWith('Enter valid price');
    }

    if (!(plot.type != "House" | plot.type != "Plot")) {
      flag = false;
      this.refs.incorrectType.replaceWith('Enter type');
    }

    if (flag == true) {
      var input = document.getElementById("image");
      console.log("Input1: ", input);
      var fReader = new FileReader();

      fReader.onload = function (event) {
        console.log("image 1: ", event.target.result);

        for (var i = 0; i < uploadedImage.length; i++) {
          //var cdnURL= 'https://storage.bunnycdn.com/aangan1storage/%2Faangan1storage%2F/'+uploadedImage[i].name;
          var cdnURL = 'https://storage.bunnycdn.com/aangan1storage/featured/' + uploadedImage[i].name;
          console.log("ImageID: ", cdnURL);
          fetch(cdnURL, {
            method: 'PUT',
            headers: {
              "AccessKey": "07da9b11-9aa3-4b18-9a7695d9c2d8-3982-4a87",
              "Content-Type": "image/jpeg"
            },
            body: document.getElementById("images").files[i]
          }).then(response => response.json()).then(response => console.log("Upload Response: ", response)).catch(err => console.error(err));
        } // HTTP.call(post, "https://secure.h3techs.com/sms/api/send", data,  (res)=>{console.log("res",res)});


        Meteor.call('plots.insert', plot, event.target.result, (error, result) => {
          console.log('error: ', error);

          if (error) {
            console.log('error: ', error);
          } else {
            alert("Property Added successfully"); // this.props.history.push('/PlotDisplay');
          }
        });
      };

      fReader.readAsDataURL(input.files[0]);
    } // Clear form


    this.refs.location.value = '0';
    this.refs.size.value = '';
    this.refs.price.value = '';
    this.refs.phone.value = '';
    this.refs.cnic.value = '';
    this.refs.constructionDate.value = '';
    this.refs.detail.value = '';
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!Meteor.user()) {
      document.getElementById("signup-popup").click();
    }
    /*else if (!(Meteor.user() && Meteor.user().emails[0].verified))
    {
      alert("Verify your email");
    }*/
    else {
        this.createProperty();
      }
  }

  renderPlots() {
    let filteredPlots = this.props.plots;
    return filteredPlots.map(plot => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;

      if (plot.owner === currentUserId) {
        return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Plot, {
          key: plot._id,
          plot: plot
        }));
      }
    });
  }

  render() {
    render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Account, null), /*#__PURE__*/React.createElement("br", null)), document.getElementById('signin')); // Download function

    const options = {
      method: 'GET',
      headers: {
        Accept: '*/*',
        AccessKey: '70c2d1ab-7ef8-4cea-9383-547ea75588a0d99ffb89-7c88-4f42-99b5-0d1ea88bd82c'
      }
    };
    /* 
     fetch('https://storage.bunnycdn.com/aanganstorage/Plots/File1.jpeg', options)
       .then(response => response.json())
       .then(response => console.log("download image: ", response))
       .catch(err => console.error(err));*/
    // document.getElementById('home-description').innerText = "";
    // document.getElementById('home-plots').innerHTML = ''
    // document.getElementById('scroll-down').innerHTML = '';

    return /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("h1", null, this.props.id, " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("center", null, "Add Property", this.props.owner)), /*#__PURE__*/React.createElement("div", {
      className: "plot-form"
    }, /*#__PURE__*/React.createElement("section", {
      className: "section contact-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container-contact"
    }, /*#__PURE__*/React.createElement("div", {
      className: "row",
      "data-aos": "fade-up"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-3  col-lg-3 col-sm-3 col-xs-3 "
    }), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6  col-lg-6 col-sm-6 col-xs-6 "
    }, /*#__PURE__*/React.createElement("form", {
      action: "#",
      method: "post",
      className: "border border-primary bg-white p-md-5 p-4 mb-5",
      onSubmit: this.handleSubmit.bind(this)
    }, /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " City "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      ref: "city",
      placeholder: "City",
      list: "cities",
      required: true,
      className: "form-control "
    }), /*#__PURE__*/React.createElement("datalist", {
      id: "cities"
    }, /*#__PURE__*/React.createElement("option", null, "  Abbott\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Al\u012B\u0101bad  "), /*#__PURE__*/React.createElement("option", null, " Alp\u016Brai  "), /*#__PURE__*/React.createElement("option", null, " Altit "), /*#__PURE__*/React.createElement("option", null, " Askole "), /*#__PURE__*/React.createElement("option", null, " Astore "), /*#__PURE__*/React.createElement("option", null, " Athmuqam     "), /*#__PURE__*/React.createElement("option", null, " Attock City "), /*#__PURE__*/React.createElement("option", null, " Aw\u0101r\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Ayubia   "), /*#__PURE__*/React.createElement("option", null, " Babusar  "), /*#__PURE__*/React.createElement("option", null, " Bad\u012Bn    "), /*#__PURE__*/React.createElement("option", null, " B\u0101gh     "), /*#__PURE__*/React.createElement("option", null, " Bah\u0101walnagar    "), /*#__PURE__*/React.createElement("option", null, " Bah\u0101walpur  "), /*#__PURE__*/React.createElement("option", null, " Balghar "), /*#__PURE__*/React.createElement("option", null, " Bannu    "), /*#__PURE__*/React.createElement("option", null, " Barah Valley "), /*#__PURE__*/React.createElement("option", null, " Bard\u0101r   "), /*#__PURE__*/React.createElement("option", null, " B\u0101rkh\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Batgr\u0101m  "), /*#__PURE__*/React.createElement("option", null, " Bhakkar  "), /*#__PURE__*/React.createElement("option", null, " Bunji "), /*#__PURE__*/React.createElement("option", null, " Chakw\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Chalunka "), /*#__PURE__*/React.createElement("option", null, " Chaman   "), /*#__PURE__*/React.createElement("option", null, " Ch\u0101rsadda   "), /*#__PURE__*/React.createElement("option", null, " Chilas "), /*#__PURE__*/React.createElement("option", null, " Chil\u0101s   "), /*#__PURE__*/React.createElement("option", null, " Chiniot  "), /*#__PURE__*/React.createElement("option", null, " Chitr\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Chitral. "), /*#__PURE__*/React.createElement("option", null, " D\u0101du     "), /*#__PURE__*/React.createElement("option", null, " Daggar   "), /*#__PURE__*/React.createElement("option", null, " D\u0101lband\u012Bn   "), /*#__PURE__*/React.createElement("option", null, " Danyor "), /*#__PURE__*/React.createElement("option", null, " Dasu     "), /*#__PURE__*/React.createElement("option", null, " Dera All \u0101hy\u0101r   "), /*#__PURE__*/React.createElement("option", null, " Dera Bugti  "), /*#__PURE__*/React.createElement("option", null, " Dera Gh\u0101zi Kh\u0101n "), /*#__PURE__*/React.createElement("option", null, " Dera Ism\u0101\u012Bl Kh\u0101n    "), /*#__PURE__*/React.createElement("option", null, " Dera Mur\u0101d Jam\u0101li   "), /*#__PURE__*/React.createElement("option", null, " Eidg\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Fairy Meadows "), /*#__PURE__*/React.createElement("option", null, " Faisal\u0101b\u0101d  "), /*#__PURE__*/React.createElement("option", null, " G\u0101kuch   "), /*#__PURE__*/React.createElement("option", null, " Gand\u0101v\u0101  "), /*#__PURE__*/React.createElement("option", null, " Ghotki   "), /*#__PURE__*/React.createElement("option", null, " Gilgit   "), /*#__PURE__*/React.createElement("option", null, " Gorikot "), /*#__PURE__*/React.createElement("option", null, " Gujr\u0101nw\u0101la  "), /*#__PURE__*/React.createElement("option", null, " Gujr\u0101t   "), /*#__PURE__*/React.createElement("option", null, " Gulmit "), /*#__PURE__*/React.createElement("option", null, " Gw\u0101dar   "), /*#__PURE__*/React.createElement("option", null, " H\u0101fiz\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Haji Gham "), /*#__PURE__*/React.createElement("option", null, " Haldi "), /*#__PURE__*/React.createElement("option", null, " Hangu    "), /*#__PURE__*/React.createElement("option", null, " Har\u012Bpur  "), /*#__PURE__*/React.createElement("option", null, " Hassanabad Chorbat "), /*#__PURE__*/React.createElement("option", null, " Hunza "), /*#__PURE__*/React.createElement("option", null, " Hushe "), /*#__PURE__*/React.createElement("option", null, " Hussainabad "), /*#__PURE__*/React.createElement("option", null, " Hyder\u0101b\u0101d City  "), /*#__PURE__*/React.createElement("option", null, " Islamabad   "), /*#__PURE__*/React.createElement("option", null, " Jacob\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " Jaglot "), /*#__PURE__*/React.createElement("option", null, " Jalal Abad "), /*#__PURE__*/React.createElement("option", null, " J\u0101mshoro     "), /*#__PURE__*/React.createElement("option", null, " Jhang City  "), /*#__PURE__*/React.createElement("option", null, " Jhang Sadr  "), /*#__PURE__*/React.createElement("option", null, " Jhelum   "), /*#__PURE__*/React.createElement("option", null, " Jutal "), /*#__PURE__*/React.createElement("option", null, " Kalam "), /*#__PURE__*/React.createElement("option", null, " Kal\u0101t    "), /*#__PURE__*/React.createElement("option", null, " Kandhkot     "), /*#__PURE__*/React.createElement("option", null, " Karachi  "), /*#__PURE__*/React.createElement("option", null, " Karak    "), /*#__PURE__*/React.createElement("option", null, " Karimabad "), /*#__PURE__*/React.createElement("option", null, " Kashmir  "), /*#__PURE__*/React.createElement("option", null, " Kas\u016Br    "), /*#__PURE__*/React.createElement("option", null, " Keris Valley "), /*#__PURE__*/React.createElement("option", null, " Khairpur     "), /*#__PURE__*/React.createElement("option", null, " Kh\u0101new\u0101l     "), /*#__PURE__*/React.createElement("option", null, " Khaplu "), /*#__PURE__*/React.createElement("option", null, " Kh\u0101r\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Kharfaq "), /*#__PURE__*/React.createElement("option", null, " Khush\u0101b  "), /*#__PURE__*/React.createElement("option", null, " Khuzd\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Koh\u0101t    "), /*#__PURE__*/React.createElement("option", null, " Kohlu    "), /*#__PURE__*/React.createElement("option", null, " Kotli    "), /*#__PURE__*/React.createElement("option", null, " Kumrat "), /*#__PURE__*/React.createElement("option", null, " Kumrat   "), /*#__PURE__*/React.createElement("option", null, " Kundi\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Lahore   "), /*#__PURE__*/React.createElement("option", null, " Lakki Marwat    "), /*#__PURE__*/React.createElement("option", null, " L\u0101rk\u0101na  "), /*#__PURE__*/React.createElement("option", null, " Leiah    "), /*#__PURE__*/React.createElement("option", null, " Lodhr\u0101n  "), /*#__PURE__*/React.createElement("option", null, " Loralai  "), /*#__PURE__*/React.createElement("option", null, " Maiun "), /*#__PURE__*/React.createElement("option", null, " Malakand     "), /*#__PURE__*/React.createElement("option", null, " Mandi Bah\u0101udd\u012Bn "), /*#__PURE__*/React.createElement("option", null, " M\u0101nsehra     "), /*#__PURE__*/React.createElement("option", null, " Mardan   "), /*#__PURE__*/React.createElement("option", null, " Mas\u012Bw\u0101la     "), /*#__PURE__*/React.createElement("option", null, " Mastung  "), /*#__PURE__*/React.createElement("option", null, " Mati\u0101ri  "), /*#__PURE__*/React.createElement("option", null, " Mehra    "), /*#__PURE__*/React.createElement("option", null, " Mi\u0101nw\u0101li     "), /*#__PURE__*/React.createElement("option", null, " Minimarg "), /*#__PURE__*/React.createElement("option", null, " M\u012Brpur Kh\u0101s "), /*#__PURE__*/React.createElement("option", null, " Misgar "), /*#__PURE__*/React.createElement("option", null, " Mult\u0101n   "), /*#__PURE__*/React.createElement("option", null, " Murree   "), /*#__PURE__*/React.createElement("option", null, " M\u016Bsa Khel B\u0101z\u0101r "), /*#__PURE__*/React.createElement("option", null, " Muzaffar garh    "), /*#__PURE__*/React.createElement("option", null, " Nagar Khas "), /*#__PURE__*/React.createElement("option", null, " Naltar Valley "), /*#__PURE__*/React.createElement("option", null, " Nank\u0101na  S\u0101hib   "), /*#__PURE__*/React.createElement("option", null, " Naran Kaghan. "), /*#__PURE__*/React.createElement("option", null, " N\u0101row\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Nasirabad "), /*#__PURE__*/React.createElement("option", null, " Nathia Gali "), /*#__PURE__*/React.createElement("option", null, " Naushahro F\u012Broz "), /*#__PURE__*/React.createElement("option", null, " Naw\u0101bsh\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Neelam "), /*#__PURE__*/React.createElement("option", null, " Neelam   "), /*#__PURE__*/React.createElement("option", null, " New M\u012Brpur  "), /*#__PURE__*/React.createElement("option", null, " Nowshera     "), /*#__PURE__*/React.createElement("option", null, " Ok\u0101ra    "), /*#__PURE__*/React.createElement("option", null, " Oshikhandass "), /*#__PURE__*/React.createElement("option", null, " P\u0101kpattan   "), /*#__PURE__*/React.createElement("option", null, " Palas "), /*#__PURE__*/React.createElement("option", null, " Panjg\u016Br  "), /*#__PURE__*/React.createElement("option", null, " Parachin\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Pasu "), /*#__PURE__*/React.createElement("option", null, " Pesh\u0101war     "), /*#__PURE__*/React.createElement("option", null, " Pishin   "), /*#__PURE__*/React.createElement("option", null, " Qila Abdull\u0101h   "), /*#__PURE__*/React.createElement("option", null, " Qila Saifull\u0101h  "), /*#__PURE__*/React.createElement("option", null, " Quetta   "), /*#__PURE__*/React.createElement("option", null, " Rah\u012Bmy\u0101r  Kh\u0101n   "), /*#__PURE__*/React.createElement("option", null, " R\u0101janpur     "), /*#__PURE__*/React.createElement("option", null, " R\u0101wala Kot  "), /*#__PURE__*/React.createElement("option", null, " R\u0101walpindi  "), /*#__PURE__*/React.createElement("option", null, " Rawlakot     "), /*#__PURE__*/React.createElement("option", null, " S\u0101diq\u0101b\u0101d   "), /*#__PURE__*/React.createElement("option", null, " S\u0101h\u012Bw\u0101l  "), /*#__PURE__*/React.createElement("option", null, " Saidu Sharif    "), /*#__PURE__*/React.createElement("option", null, " S\u0101nghar  "), /*#__PURE__*/React.createElement("option", null, " Sargodha     "), /*#__PURE__*/React.createElement("option", null, " Serai    "), /*#__PURE__*/React.createElement("option", null, " Shahd\u0101d Kot "), /*#__PURE__*/React.createElement("option", null, " Sheikhupura "), /*#__PURE__*/React.createElement("option", null, " Shigar "), /*#__PURE__*/React.createElement("option", null, " Shik\u0101rpur   "), /*#__PURE__*/React.createElement("option", null, " Shimshal "), /*#__PURE__*/React.createElement("option", null, " Si\u0101lkot City    "), /*#__PURE__*/React.createElement("option", null, " Sibi    "), /*#__PURE__*/React.createElement("option", null, " Skardu "), /*#__PURE__*/React.createElement("option", null, " Sost "), /*#__PURE__*/React.createElement("option", null, " Sukkur   "), /*#__PURE__*/React.createElement("option", null, " Sultan Abad "), /*#__PURE__*/React.createElement("option", null, " Sw\u0101bi    "), /*#__PURE__*/React.createElement("option", null, "  Swat    "), /*#__PURE__*/React.createElement("option", null, " Taghafari "), /*#__PURE__*/React.createElement("option", null, " Tando All\u0101hy\u0101r  "), /*#__PURE__*/React.createElement("option", null, " Tando Muhammad Kh\u0101n "), /*#__PURE__*/React.createElement("option", null, " T\u0101nk     "), /*#__PURE__*/React.createElement("option", null, " Thatta   "), /*#__PURE__*/React.createElement("option", null, " Timargara   "), /*#__PURE__*/React.createElement("option", null, " Toba Tek Singh  "), /*#__PURE__*/React.createElement("option", null, " Tolipeer     "), /*#__PURE__*/React.createElement("option", null, " Tolti Kharmang "), /*#__PURE__*/React.createElement("option", null, " Turbat   "), /*#__PURE__*/React.createElement("option", null, " Umarkot  "), /*#__PURE__*/React.createElement("option", null, " Upper Dir   "), /*#__PURE__*/React.createElement("option", null, " Uthal    "), /*#__PURE__*/React.createElement("option", null, " Vih\u0101ri   "), /*#__PURE__*/React.createElement("option", null, " Yugo "), /*#__PURE__*/React.createElement("option", null, " Zhob     "), /*#__PURE__*/React.createElement("option", null, " Zi\u0101rat   "), /*#__PURE__*/React.createElement("option", null, "  Other   ")), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Area "), /*#__PURE__*/React.createElement("input", {
      ref: "location",
      placeholder: "Enter area of city",
      className: "form-control "
    }), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon-dropdown"
    }, " Unit "), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      required: true,
      ref: "unit",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      value: "0.003673"
    }, "  Square Feet   "), /*#__PURE__*/React.createElement("option", {
      value: "0.033057"
    }, "  Square Yard   "), /*#__PURE__*/React.createElement("option", {
      value: "1"
    }, " Marla  "), /*#__PURE__*/React.createElement("option", {
      value: "20"
    }, " Kanal  "), /*#__PURE__*/React.createElement("option", {
      value: "160"
    }, " Acre  "), /*#__PURE__*/React.createElement("option", {
      value: "4000"
    }, " Marabba  ")), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Size "), /*#__PURE__*/React.createElement("input", {
      ref: "size",
      placeholder: "Enter size of your property",
      required: true,
      className: "form-control "
    }), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "incorrectSize"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Price "), /*#__PURE__*/React.createElement("input", {
      type: "number",
      ref: "price",
      placeholder: "Cost of Plot in PKR",
      required: true,
      className: "form-control "
    }), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "incorrectPrice"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Phone "), /*#__PURE__*/React.createElement("input", {
      type: "tel",
      ref: "phone",
      placeholder: "Contact Number",
      className: "form-control "
    }), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "incorrectPhone"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon-dropdown"
    }, " Type "), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      required: true,
      ref: "type",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", null, "  House   "), /*#__PURE__*/React.createElement("option", null, " Plot  ")), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon-dropdown"
    }, " Purpose "), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      required: true,
      ref: "purpose",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", null, "  Sell   "), /*#__PURE__*/React.createElement("option", null, " Rent  ")), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Date "), /*#__PURE__*/React.createElement("input", {
      type: "date",
      ref: "constructionDate",
      placeholder: "Date of Construction incase of building",
      className: "form-control "
    }), /*#__PURE__*/React.createElement("span", {
      ref: "incorrectDate"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, "display image", /*#__PURE__*/React.createElement("input", {
      type: "file",
      id: "image",
      ref: "image",
      required: true,
      accept: "image/*",
      className: "form-control "
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, "other images", /*#__PURE__*/React.createElement("input", {
      type: "file",
      id: "images",
      ref: "images",
      accept: "image/*",
      className: "form-control ",
      multiple: true
    })), /*#__PURE__*/React.createElement("div", {
      className: "error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    })), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group"
    }, /*#__PURE__*/React.createElement("textarea", {
      rows: "5",
      type: "text",
      ref: "detail",
      className: "form-control ",
      placeholder: "Any other notes for plot"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6  col-lg-6 col-sm-6 col-xs-6 form-group"
    }, /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Add Plot",
      className: "btn btn-primary"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-3  col-lg-3 col-sm-3 col-xs-3"
    })))))), /*#__PURE__*/React.createElement("ul", {
      className: "plots"
    }, this.renderPlots()), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    }));
  }

}

module.exportDefault(withTracker(() => {
  Meteor.subscribe('plots');
  Meteor.subscribe('homeLinks');
  return {
    homeLink: HomeLinks.findOne({}),
    plots: Plots.find({}, {
      sort: {
        createdAt: -1
      }
    }).fetch(),
    currentUser: Meteor.user()
  };
})(App));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Review.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Review.js                                                                                             //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  default: () => Plot
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let classnames;
module.link("classnames", {
  default(v) {
    classnames = v;
  }

}, 1);

class Plot extends Component {
  render() {
    const reviewClassName = classnames({
      review: this.props.review
    });
    return /*#__PURE__*/React.createElement("div", null, this.props.review.remarks ? /*#__PURE__*/React.createElement("div", {
      className: "col-md-4",
      "data-aos": "fade-up",
      "data-aos-delay": "100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "testimonial"
    }, /*#__PURE__*/React.createElement("div", {
      className: "reviews"
    }, /*#__PURE__*/React.createElement("img", {
      src: this.props.review.reviewer_dp,
      alt: "Image placeholder",
      width: "70px",
      height: "70px",
      className: "rounded-circle reviewer-dp"
    }), this.props.review.rating == '1' ? /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }) : "", this.props.review.rating == '2' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    })) : "", this.props.review.rating == '3' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    })) : "", this.props.review.rating == '4' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    })) : "", this.props.review.rating == '5' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    }), /*#__PURE__*/React.createElement("img", {
      width: "5%",
      height: "5%",
      id: "star",
      src: "/img/star.png"
    })) : "", /*#__PURE__*/React.createElement("div", {
      className: "review-remarks"
    }, /*#__PURE__*/React.createElement("p", null, "\u201C", this.props.review.remarks, "\u201D")), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("em", null, "\u2014 ", this.props.review.username))))) : "");
  }

}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Signup.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/Signup.js                                                                                             //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
module.link("../api/accounts.js");

class Signup extends Component {
  onSubmit(event) {
    event.preventDefault();
    var phone = this.refs.phone.value;

    if (this.refs.password.value != this.refs.passwordRepeat.value) {
      console.log("Error: Password do not match");
      this.refs.incorrectPassword.replaceWith("Passwords do not match");
    } else if (phone.length != 12) {
      console.log("Error: Phone number not in required formate");
      this.refs.incorrectPassword.replaceWith("");
      this.refs.incorrectPhone.replaceWith("Phone number not in required format");
    } else {
      this.refs.incorrectPassword.replaceWith("");
      this.refs.incorrectPhone.replaceWith(""); // const redirect = (role) => {
      //     if (role == "customer"){
      //         this.props.history.push('/SignupCustomer');
      //     };
      //     if (role == "company"){
      //         this.props.history.push('/SignupCompany');
      //     };
      //     if (role == "guide"){
      //         this.props.history.push('/SignupGuide');
      //     };
      // }
      // const userType = this.refs.role.value;

      const role = "company"; //Will be chnaged when other roles are defined

      const userdata = {
        username: this.refs.username.value,
        email: this.refs.email.value,
        password: this.refs.password.value,
        profile: {
          phone: this.refs.phone.value
        }
      };
      var input = document.getElementById("image");

      if (input.files[0]) {
        var fReader = new FileReader();
        fReader.readAsDataURL(input.files[0]);

        fReader.onloadend = function (event) {
          userdata.profile = {
            dp: event.target.result
          }; //     Meteor.call('plots.insert', plot, event.target.result);      
          //   }   

          userdata.image = event.target.result;
          console.log("Userdata: ", userdata);
          Accounts.createUser(userdata, error => {
            // Accounts.sendVerificationEmail(Meteor.user()._id, userdata.email)
            if (error) {
              console.log("Got error: ", error);
              this.refs.invalidUsername.replaceWith(error.reason);
            } else {
              console.log("successful", Meteor.user()._id); // redirect(role);

              Meteor.call('user.role', Meteor.user()._id, role);
              this.addFields();
            }
          });
        };
      } else {
        Accounts.createUser(userdata, error => {
          // Accounts.sendVerificationEmail(Meteor.user()._id, userdata.email)
          if (error) {
            console.log("Got error: ", error);
            this.refs.invalidUsername.replaceWith(error.reason);
          } else {
            console.log("successful", Meteor.user()._id); // redirect(role);

            Meteor.call('user.role', Meteor.user()._id, role);
            this.addFields();
          }
        });
      }
    }
  }

  addFields() {
    const fields = {
      name: this.refs.name.value,
      phone: this.refs.phone.value,
      company: this.refs.company.value,
      city: this.refs.city.value,
      intro: this.refs.intro.value,
      userType: this.refs.role.value
    }; // for email verification:    https://docs.meteor.com/api/passwords.html#Accounts-createUser

    const userId = Meteor.user()._id;

    Meteor.call('user.addFields', fields, (error, result) => {
      if (error) {
        console.log("Error ", error);
      } else {
        alert("Verify your email to add property");
        window.location.pathname = '/';
      }
    });
  }

  render() {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "container signup"
    }, /*#__PURE__*/React.createElement("form", {
      action: "#",
      "data-aos": "fade-left",
      method: "post",
      className: "bg-white p-md-5 p-4 mb-5",
      onSubmit: this.onSubmit.bind(this)
    }, /*#__PURE__*/React.createElement("div", {
      className: "row "
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-lg-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon-dropdown"
    }, " Role "), /*#__PURE__*/React.createElement("select", {
      ref: "role",
      className: "form-control"
    }, /*#__PURE__*/React.createElement("option", {
      value: "",
      disabled: true,
      selected: true
    }, "Choose role"), /*#__PURE__*/React.createElement("option", {
      value: "privateUser"
    }, "Private User"), /*#__PURE__*/React.createElement("option", {
      value: "realEstateAgent"
    }, "Real Estate Agent"), /*#__PURE__*/React.createElement("option", {
      value: "realEstateCompany"
    }, "Real Estate Company"))), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon-dropdown"
    }, " City "), /*#__PURE__*/React.createElement("select", {
      className: "form-control",
      ref: "city",
      id: "sel1"
    }, /*#__PURE__*/React.createElement("option", {
      required: true,
      value: "",
      disabled: true,
      selected: true
    }, "City (required)"), /*#__PURE__*/React.createElement("option", null, "  Abbottabad   "), /*#__PURE__*/React.createElement("option", null, " Aliabad  "), /*#__PURE__*/React.createElement("option", null, " Alpurai  "), /*#__PURE__*/React.createElement("option", null, " Altit "), /*#__PURE__*/React.createElement("option", null, " Askole "), /*#__PURE__*/React.createElement("option", null, " Astore "), /*#__PURE__*/React.createElement("option", null, " Athmuqam     "), /*#__PURE__*/React.createElement("option", null, " Attock City "), /*#__PURE__*/React.createElement("option", null, " Awaran   "), /*#__PURE__*/React.createElement("option", null, " Ayubia   "), /*#__PURE__*/React.createElement("option", null, " Babusar  "), /*#__PURE__*/React.createElement("option", null, " Badin    "), /*#__PURE__*/React.createElement("option", null, " Bagh     "), /*#__PURE__*/React.createElement("option", null, " Bahawalnagar    "), /*#__PURE__*/React.createElement("option", null, " Bahawalpur  "), /*#__PURE__*/React.createElement("option", null, " Balghar "), /*#__PURE__*/React.createElement("option", null, " Bannu    "), /*#__PURE__*/React.createElement("option", null, " Barah Valley "), /*#__PURE__*/React.createElement("option", null, " Bardar   "), /*#__PURE__*/React.createElement("option", null, " Barkhan  "), /*#__PURE__*/React.createElement("option", null, " Batgram  "), /*#__PURE__*/React.createElement("option", null, " Bhakkar  "), /*#__PURE__*/React.createElement("option", null, " Bunji "), /*#__PURE__*/React.createElement("option", null, " Chakwal  "), /*#__PURE__*/React.createElement("option", null, " Chalunka "), /*#__PURE__*/React.createElement("option", null, " Chaman   "), /*#__PURE__*/React.createElement("option", null, " Charsadda   "), /*#__PURE__*/React.createElement("option", null, " Chilas "), /*#__PURE__*/React.createElement("option", null, " Chilas   "), /*#__PURE__*/React.createElement("option", null, " Chiniot  "), /*#__PURE__*/React.createElement("option", null, " Chitral  "), /*#__PURE__*/React.createElement("option", null, " Chitral. "), /*#__PURE__*/React.createElement("option", null, " Dadu     "), /*#__PURE__*/React.createElement("option", null, " Daggar   "), /*#__PURE__*/React.createElement("option", null, " Dalbandin   "), /*#__PURE__*/React.createElement("option", null, " Danyor "), /*#__PURE__*/React.createElement("option", null, " Dasu     "), /*#__PURE__*/React.createElement("option", null, " Dera All ahyar   "), /*#__PURE__*/React.createElement("option", null, " Dera Bugti  "), /*#__PURE__*/React.createElement("option", null, " Dera Ghazi Khan "), /*#__PURE__*/React.createElement("option", null, " Dera Ismail Khan    "), /*#__PURE__*/React.createElement("option", null, " Dera Murad Jamali   "), /*#__PURE__*/React.createElement("option", null, " Eidgah   "), /*#__PURE__*/React.createElement("option", null, " Fairy Meadows "), /*#__PURE__*/React.createElement("option", null, " Faisalabad  "), /*#__PURE__*/React.createElement("option", null, " Gakuch   "), /*#__PURE__*/React.createElement("option", null, " Gandava  "), /*#__PURE__*/React.createElement("option", null, " Ghotki   "), /*#__PURE__*/React.createElement("option", null, " Gilgit   "), /*#__PURE__*/React.createElement("option", null, " Gorikot "), /*#__PURE__*/React.createElement("option", null, " Gujranwala  "), /*#__PURE__*/React.createElement("option", null, " Gujrat   "), /*#__PURE__*/React.createElement("option", null, " Gulmit "), /*#__PURE__*/React.createElement("option", null, " Gwadar   "), /*#__PURE__*/React.createElement("option", null, " Hafizabad   "), /*#__PURE__*/React.createElement("option", null, " Haji Gham "), /*#__PURE__*/React.createElement("option", null, " Haldi "), /*#__PURE__*/React.createElement("option", null, " Hangu    "), /*#__PURE__*/React.createElement("option", null, " Haripur  "), /*#__PURE__*/React.createElement("option", null, " Hassanabad Chorbat "), /*#__PURE__*/React.createElement("option", null, " Hunza "), /*#__PURE__*/React.createElement("option", null, " Hushe "), /*#__PURE__*/React.createElement("option", null, " Hussainabad "), /*#__PURE__*/React.createElement("option", null, " Hyderabad City  "), /*#__PURE__*/React.createElement("option", null, " Islamabad   "), /*#__PURE__*/React.createElement("option", null, " Jacobabad   "), /*#__PURE__*/React.createElement("option", null, " Jaglot "), /*#__PURE__*/React.createElement("option", null, " Jalal Abad "), /*#__PURE__*/React.createElement("option", null, " Jamshoro     "), /*#__PURE__*/React.createElement("option", null, " Jhang City  "), /*#__PURE__*/React.createElement("option", null, " Jhang Sadr  "), /*#__PURE__*/React.createElement("option", null, " Jhelum   "), /*#__PURE__*/React.createElement("option", null, " Jutal "), /*#__PURE__*/React.createElement("option", null, " Kalam "), /*#__PURE__*/React.createElement("option", null, " Kalat    "), /*#__PURE__*/React.createElement("option", null, " Kandhkot     "), /*#__PURE__*/React.createElement("option", null, " Karachi  "), /*#__PURE__*/React.createElement("option", null, " Karak    "), /*#__PURE__*/React.createElement("option", null, " Karimabad "), /*#__PURE__*/React.createElement("option", null, " Kashmir  "), /*#__PURE__*/React.createElement("option", null, " Kasur    "), /*#__PURE__*/React.createElement("option", null, " Keris Valley "), /*#__PURE__*/React.createElement("option", null, " Khairpur     "), /*#__PURE__*/React.createElement("option", null, " Khanewal     "), /*#__PURE__*/React.createElement("option", null, " Khaplu "), /*#__PURE__*/React.createElement("option", null, " Kharan   "), /*#__PURE__*/React.createElement("option", null, " Kharfaq "), /*#__PURE__*/React.createElement("option", null, " Khushab  "), /*#__PURE__*/React.createElement("option", null, " Khuzdar  "), /*#__PURE__*/React.createElement("option", null, " Kohat    "), /*#__PURE__*/React.createElement("option", null, " Kohlu    "), /*#__PURE__*/React.createElement("option", null, " Kotli    "), /*#__PURE__*/React.createElement("option", null, " Kumrat "), /*#__PURE__*/React.createElement("option", null, " Kumrat   "), /*#__PURE__*/React.createElement("option", null, " Kundian  "), /*#__PURE__*/React.createElement("option", null, " Lahore   "), /*#__PURE__*/React.createElement("option", null, " Lakki Marwat    "), /*#__PURE__*/React.createElement("option", null, " Larkana  "), /*#__PURE__*/React.createElement("option", null, " Leiah    "), /*#__PURE__*/React.createElement("option", null, " Lodhran  "), /*#__PURE__*/React.createElement("option", null, " Loralai  "), /*#__PURE__*/React.createElement("option", null, " Maiun "), /*#__PURE__*/React.createElement("option", null, " Malakand     "), /*#__PURE__*/React.createElement("option", null, " Mandi Bahauddin "), /*#__PURE__*/React.createElement("option", null, " Mansehra     "), /*#__PURE__*/React.createElement("option", null, " Mardan   "), /*#__PURE__*/React.createElement("option", null, " Masiwala     "), /*#__PURE__*/React.createElement("option", null, " Mastung  "), /*#__PURE__*/React.createElement("option", null, " Matiari  "), /*#__PURE__*/React.createElement("option", null, " Mehra    "), /*#__PURE__*/React.createElement("option", null, " Mianwali     "), /*#__PURE__*/React.createElement("option", null, " Minimarg "), /*#__PURE__*/React.createElement("option", null, " Mirpur Khas "), /*#__PURE__*/React.createElement("option", null, " Misgar "), /*#__PURE__*/React.createElement("option", null, " Multan   "), /*#__PURE__*/React.createElement("option", null, " Murree   "), /*#__PURE__*/React.createElement("option", null, " Musa Khel Bazar "), /*#__PURE__*/React.createElement("option", null, " Muzaffar garh    "), /*#__PURE__*/React.createElement("option", null, " Nagar Khas "), /*#__PURE__*/React.createElement("option", null, " Naltar Valley "), /*#__PURE__*/React.createElement("option", null, " Nankana  Sahib   "), /*#__PURE__*/React.createElement("option", null, " Naran Kaghan. "), /*#__PURE__*/React.createElement("option", null, " Narowal  "), /*#__PURE__*/React.createElement("option", null, " Nasirabad "), /*#__PURE__*/React.createElement("option", null, " Nathia Gali "), /*#__PURE__*/React.createElement("option", null, " Naushahro Firoz "), /*#__PURE__*/React.createElement("option", null, " Nawabshah   "), /*#__PURE__*/React.createElement("option", null, " Neelam "), /*#__PURE__*/React.createElement("option", null, " Neelam   "), /*#__PURE__*/React.createElement("option", null, " New Mirpur  "), /*#__PURE__*/React.createElement("option", null, " Nowshera     "), /*#__PURE__*/React.createElement("option", null, " Okara    "), /*#__PURE__*/React.createElement("option", null, " Oshikhandass "), /*#__PURE__*/React.createElement("option", null, " Pakpattan   "), /*#__PURE__*/React.createElement("option", null, " Palas "), /*#__PURE__*/React.createElement("option", null, " Panjgur  "), /*#__PURE__*/React.createElement("option", null, " Parachinar  "), /*#__PURE__*/React.createElement("option", null, " Pasu "), /*#__PURE__*/React.createElement("option", null, " Peshawar     "), /*#__PURE__*/React.createElement("option", null, " Pishin   "), /*#__PURE__*/React.createElement("option", null, " Qila Abdullah   "), /*#__PURE__*/React.createElement("option", null, " Qila Saifullah  "), /*#__PURE__*/React.createElement("option", null, " Quetta   "), /*#__PURE__*/React.createElement("option", null, " Rahimyar  Khan   "), /*#__PURE__*/React.createElement("option", null, " Rajanpur     "), /*#__PURE__*/React.createElement("option", null, " Rawala Kot  "), /*#__PURE__*/React.createElement("option", null, " Rawalpindi  "), /*#__PURE__*/React.createElement("option", null, " Rawlakot     "), /*#__PURE__*/React.createElement("option", null, " Sadiqabad   "), /*#__PURE__*/React.createElement("option", null, " Sahiwal  "), /*#__PURE__*/React.createElement("option", null, " Saidu Sharif    "), /*#__PURE__*/React.createElement("option", null, " Sanghar  "), /*#__PURE__*/React.createElement("option", null, " Sargodha     "), /*#__PURE__*/React.createElement("option", null, " Serai    "), /*#__PURE__*/React.createElement("option", null, " Shahdad Kot "), /*#__PURE__*/React.createElement("option", null, " Sheikhupura "), /*#__PURE__*/React.createElement("option", null, " Shigar "), /*#__PURE__*/React.createElement("option", null, " Shikarpur   "), /*#__PURE__*/React.createElement("option", null, " Shimshal "), /*#__PURE__*/React.createElement("option", null, " Sialkot City    "), /*#__PURE__*/React.createElement("option", null, " Sibi    "), /*#__PURE__*/React.createElement("option", null, " Skardu "), /*#__PURE__*/React.createElement("option", null, " Sost "), /*#__PURE__*/React.createElement("option", null, " Sukkur   "), /*#__PURE__*/React.createElement("option", null, " Sultan Abad "), /*#__PURE__*/React.createElement("option", null, " Swabi    "), /*#__PURE__*/React.createElement("option", null, "  Swat    "), /*#__PURE__*/React.createElement("option", null, " Taghafari "), /*#__PURE__*/React.createElement("option", null, " Tando Allahyar  "), /*#__PURE__*/React.createElement("option", null, " Tando Muhammad Khan "), /*#__PURE__*/React.createElement("option", null, " Tank     "), /*#__PURE__*/React.createElement("option", null, " Thatta   "), /*#__PURE__*/React.createElement("option", null, " Timargara   "), /*#__PURE__*/React.createElement("option", null, " Toba Tek Singh  "), /*#__PURE__*/React.createElement("option", null, " Tolipeer     "), /*#__PURE__*/React.createElement("option", null, " Tolti Kharmang "), /*#__PURE__*/React.createElement("option", null, " Turbat   "), /*#__PURE__*/React.createElement("option", null, " Umarkot  "), /*#__PURE__*/React.createElement("option", null, " Upper Dir   "), /*#__PURE__*/React.createElement("option", null, " Uthal    "), /*#__PURE__*/React.createElement("option", null, " Vihari   "), /*#__PURE__*/React.createElement("option", null, " Yugo "), /*#__PURE__*/React.createElement("option", null, " Zhob     "), /*#__PURE__*/React.createElement("option", null, " Ziarat   "), /*#__PURE__*/React.createElement("option", null, "  Other   ")))), /*#__PURE__*/React.createElement("div", {
      className: "row "
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Username "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      ref: "username",
      placeholder: "Username",
      className: "form-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Email "), /*#__PURE__*/React.createElement("input", {
      type: "email",
      ref: "email",
      placeholder: "Email",
      className: "form-control"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Password "), /*#__PURE__*/React.createElement("input", {
      type: "password",
      ref: "password",
      placeholder: "Password",
      className: "form-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Password "), /*#__PURE__*/React.createElement("input", {
      type: "password",
      ref: "passwordRepeat",
      placeholder: "Password Again",
      className: "form-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Name "), /*#__PURE__*/React.createElement("input", {
      required: true,
      type: "text",
      ref: "name",
      placeholder: "Full Name (required)",
      className: "form-control"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Phone "), /*#__PURE__*/React.createElement("input", {
      required: true,
      type: "tel",
      ref: "phone",
      placeholder: "Phone# (required) e.g. 923221234567",
      className: "form-control "
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Company "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      ref: "company",
      placeholder: "Company Name (Optional)",
      className: "form-control "
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5 form-group input-group"
    }, /*#__PURE__*/React.createElement("span", {
      class: "input-group-addon input-icon"
    }, " Intro "), /*#__PURE__*/React.createElement("input", {
      type: "text",
      rows: "5",
      ref: "intro",
      placeholder: "Brief introduction of company (Optional)",
      minLength: "150",
      maxLength: "500",
      className: "form-control "
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-5 col-sm-5 col-xs-5  form-group"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text align-self-center"
    }, "Upload Profile Picture:"), /*#__PURE__*/React.createElement("input", {
      type: "file",
      id: "image",
      ref: "picture",
      accept: "image/*"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "error"
    }, /*#__PURE__*/React.createElement("span", {
      ref: "incorrectPassword"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      ref: "invalidUsername"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      ref: "incorrectPhone"
    })), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group"
    }, /*#__PURE__*/React.createElement("input", {
      ref: "signup_button",
      type: "submit",
      value: "Sign Up",
      className: "btn btn-primary"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "clear-end"
    })));
  }

}

;
module.exportDefault(Signup);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"client":{"main.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// client/main.js                                                                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let render;
module.link("react-dom", {
  render(v) {
    render = v;
  }

}, 1);
let renderRoutes;
module.link("../imports/startup/routes.js", {
  renderRoutes(v) {
    renderRoutes = v;
  }

}, 2);
let AOS;
module.link("aos", {
  default(v) {
    AOS = v;
  }

}, 3);
module.link("aos/dist/aos.css");
module.link("owl.carousel/dist/assets/owl.carousel.css");
module.link("owl.carousel");
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 4);
Meteor.startup(() => {
  var theURL = "https://aangann.herokuapp.com";
  Meteor.absoluteUrl.defaultOptions.rootUrl = theURL;
  process.env.MOBILE_ROOT_URL = theURL;
  process.env.MOBILE_DDP_URL = theURL;
  process.env.DDP_DEFAULT_CONNECTION_URL = theURL;
  AOS.init({
    duration: 1500
  });
  $(".owl-carousel").owlCarousel({
    items: 1,
    autoplay: true,
    autoPlay: 1500 //Set AutoPlay to 3 seconds

  });
  Accounts.config({
    sendVerificationEmail: true // forbidClientAccountCreation: true 

  });
  render(renderRoutes(), document.getElementById('render-target'));
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".ts",
    ".mjs",
    ".css",
    ".tsx"
  ]
});

var exports = require("/client/main.js");