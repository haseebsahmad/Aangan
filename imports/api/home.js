import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';


export const HomeLinks = new Mongo.Collection('homeLinks');

if (Meteor.isServer) {
    // This code only runs on the server
  Meteor.publish('homeLinks', () => {
    if (Roles.userIsInRole(Meteor.userId(), 'company')){
        return HomeLinks.find({link:"PlotCompany"});
    }
    });

    
}

Meteor.methods({
  'homeLinks.addLink'(){
    console.log("Added");
    HomeLinks.insert({link:"PlotCompany", text:"Add Plots", user:"Company"})
  }
})
