import React, { Component } from 'react';
import '../api/accounts.js';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import {HomeLinks} from '../api/home.js';
import { Popover } from '@varld/popover';
import Login from './Login';
import { Accounts } from 'meteor/accounts-base';
import Signup from './Signup';

class Account extends Component {
    signout(event){
        console.log("signout")
        Meteor.logout()
        // document.getElementById('link').innerHTML = '';
        // this.addPropertiesPopup();
        return(
            <div>
                <a href='../Login'><button>Sign In</button></a>
            </div>
        )
      }
      addPropertiesPopup(){
        render(<Popover popover={({ visible, open, close }) => {
            return (
                <Login/>
                )
                }}>
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item active">
                            <button className="nav-item nav-link nav-item-mobile sign-button">Add Property</button>
                        </li>
                    </ul>
                </Popover>,
            document.getElementById('link')
            );
    }

    render() {
        // const requiredLink = this.props.homeLink;
        // if (requiredLink){
        //     render(<a className='nav-link nav-item-mobile' href={'../'+requiredLink.link}>{requiredLink.text}</a>,
        //         document.getElementById('link')
        //         );
        // }        
        if (this.props.currentUser){
            const user = this.props.currentUser.username;
            const profile = this.props.currentUser.profile;
            // document.getElementById("user-role").replaceWith(requiredLink.user);
            document.getElementById('nav-custom').classList.add('nav-custom');
            // console.log("user", this.props.currentUser);
        return(
            // <div align='right' className='animated fadeInDownBig'>
            <ul className="navbar-nav ml-auto">
                <li className="nav-item active">
                    <a className="nav-link nav-item-mobile" href={'/company/'+Meteor.userId()}> 
                    My Properties 
                    </a> 
                </li>
                <li className="nav-item active">
                    {/* <a className="nav-link" href='#'>  */}
                    <button className=' nav-link nav-item-mobile sign-button' onClick={this.signout.bind(this)}> Sign out </button>
                     {/* </a> */}
                </li>
                <li className="nav-item nav-item-mobile active">
                {profile?<img className='dp' src={profile.dp}></img>:
                <img className='dp' src="images/a_sign.jpg"></img>}<br/><br/>
                    <h5>
                        <div color='black' className='username'>{user}</div>
                    </h5>
                    {/* <div className='user-role'>{requiredLink? requiredLink.user :""}</div> */}
                </li>
                {/* {this.renderprofile()} */}
            </ul>
        
        );}
        else{
            const nav = document.getElementById('nav-custom')
            nav.classList.remove('nav-custom');
            nav.classList.add('not-loggin');
            // this.addPropertiesPopup();
        return(
            // <div align='right'>
            <ul className="navbar-nav ml-auto">
                <Popover popover={({ visible, open, close }) => {
                    return (
                        <Login/>
                    )
                    }}>
                    <li className="nav-item active">
                        <button className=" nav-link nav-item-mobile sign-button"> Log In </button>
                    </li>
                    </Popover>
                    <Popover popover={({ visible, open, close }) => {
                    return (
                         <Signup/>
                    )
                    }}>
                    <li className="nav-item active">
                        <button id="signup-popup" className=" nav-link nav-item-mobile sign-button"> Sign Up </button>
                    </li>
                    </Popover>
            </ul>
            // </div>
        );}

    };
};
export default withTracker(() => {
    Meteor.subscribe('homeLinks');
    return {
        currentUser: Meteor.user(),
        homeLink: HomeLinks.findOne({}),
    };
  })(Account);
