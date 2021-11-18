import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

if (Meteor.isServer) {
// This code only runs on the server
    Meteor.publish('Meteor.users.age', function ({ userIds }) {
        new SimpleSchema({
        userIds: { type: [String] }
        }).validate({ userIds });
    
        // Select only the users that match the array of IDs passed in
        const selector = {
            _id: { $in: userIds }
        };
    
        // Only return one field
        const options = {
            fields: { age: 1 }
        };
        return Meteor.users.find(selector, options, role);
    });
}

Meteor.methods({

    'user.addFields'(fields){
        console.log('fields: ', fields);
        userId = Meteor.user()._id;
        if (Roles.userIsInRole(userId, 'company')){
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
        if (Roles.userIsInRole(userId, 'customer')){
            Meteor.users.update(userId, {
                $set: {
                name: fields.name,
                phone: fields.phone,
                age: fields.age,
                cnic: fields.cnic,
                city: fields.city,
                }
            });
        }
        if (Roles.userIsInRole(userId, 'guide')){
            Meteor.users.update(userId, {
                $set: {
                name: fields.name,
                age: fields.age,
                phone: fields.phone,
                address: fields.address,
                cnic: fields.cnic,
                expertise: fields.expertise,
                city: fields.city,
                experience: fields.experience,
                }
            });
        }
    },

    'user.role'(userId, role){
        if (Meteor.isServer) {
            Roles.addUsersToRoles(userId, role, null);
        }
    },

    'user.checkrole'(userId, role){
        const check = Roles.userIsInRole(userId, role);
        return check;
    },

    'users.companyData'(id){
        console.log("ID: ", id);
        console.log("Return value ",Meteor.users.find({_id:id},{phone:1, address:1, link:1, license:1, intro:1}).fetch());
        return(
            Meteor.users.find({_id:id},{phone:1, address:1, link:1, license:1, intro:1}).fetch()
        )
    }
})