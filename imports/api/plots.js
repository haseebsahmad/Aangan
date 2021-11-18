import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
// import {FileAPI} from 'file-api';

export const Plots = new Mongo.Collection('plots');
// export const UserPlotBookings = new Mongo.Collection('userPlotBookings');

if (Meteor.isServer) {
    // This code only runs on the server
    const today = new Date();
  Meteor.publish('plots', () => {
    return Plots.find({});
      //{
    //   fields: {
    //     bookings: 0
    //   }
    // });
  });
    // Meteor.publish('plotsBookings', () => {
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

    'plots.findOne'(plotId){
      return (Plots.findOne({_id: new Mongo.ObjectID(plotId)}));
    },
    
    'plots.insert'(plot, image) {
      // check(plot.destination, String);
      // check(cost, Int);
      // check(startDate, Date);
      // check(endDate, Date);
      // check(plot.departure, String);
      // check(plot.destinationInformation, String);
      // Make sure the user is logged in before inserting a plot
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      if (! Roles.userIsInRole(this.userId, 'company')){
        throw new Meteor.Error('not-authorized');
      }
      // console.log("company", Meteor.user({"_id":this.userId}))
      if (!plot.phone){
        plot.phone = Meteor.users.findOne({_id: Meteor.userId()}).phone;
      }
      if (!plot.cnic){
        plot.cnic = Meteor.users.findOne({_id: Meteor.userId()}).cnic;
      }
      console.log("imgaessss: ", plot.images.length);    
      var imagesNames = [];
      var fs = require('fs');
      const startpath = "/Users/yusrakhalid/Desktop/Disk/Projects/Aangan/public/uploads/";
      for(var i = 0; i < plot.images.length;i++){
        imagesNames.push(plot.images[i].name);
      }
      Plots.insert({
        size: plot.size,
        createdAt: new Date(),
        owner: this.userId,
        company: Meteor.user({"_id":this.userId}).company,
        phone: plot.phone,
        constructionDate: plot.constructionDate,
        // cnic: plot.cnic,
        city: plot.city,
        location: plot.location,
        image: image,
        type: plot.type,
        price: plot.price,
        detail: plot.detail,
        purpose:plot.purpose,
        images:imagesNames,
      }
      // ,function (err,id){
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

    'plot.companyPhone'(id){
      return (
        Meteor.users.findOne({_id: id}).phone
      )
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

    'plots.search'(search){
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
      if (!search.sizeMin){
        search.sizeMin = 0;
      }
      if (!search.sizeMax){
        search.sizeMax = 999999999;
      }
      if (!search.city){
        search.city = {$ne: ""};
      }
      if (!search.type){
        search.type = {$ne: ""};
      }
      if (!search.purpose){
        search.type = {$ne: ""};
      }
      console.log('plotsearch: ', search);
      if (!search.constructionDate){
        // console.log("New search: ",Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }}).fetch());
        return Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }}).fetch();
      }
      else{
        // console.log("New search: ",  Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }, constructionDate: {$gte: search.constructionDate}}).fetch());
        return Plots.find({ purpose:search.purpose, size:{ $lte:search.sizeMax }, size:{ $gte:search.sizeMin }, city:search.city, type:search.type, price: { $lte: search.price }, constructionDate: {$gte: search.constructionDate}}).fetch();
      }
    },

    // 'plots.price'(){
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