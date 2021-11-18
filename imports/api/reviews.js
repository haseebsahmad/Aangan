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