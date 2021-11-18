import React, { Component } from 'react';
import '../api/accounts.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Account from './Account';
import { render } from 'react-dom';
// import {HomeLinks} from '../api/home.js'

class Contact extends Component {
    
    render() {
      render(<div>
        <Account /><br/>
        </div>,
        document.getElementById('signin')
        );
        return(
            <div>
            <section className="section contact-section">
              <center>
                <h1 className='title' data-aos="fade-up">Contact Us</h1>
                <div className='contact'>
                  <h5 className='fields-left'>
                    Email Address:
                  </h5> <br/>
                  <p><b>info@aangan.pk</b></p>

                  <h5 className='fields-left'>
                    Phone Number:
                  </h5> <br/>
                  <p><b>03229773786</b></p>
                  <p><b>03345005652</b></p>
                  
                  <h5 className='fields-left'>
                    Address:
                  </h5> <br/>
                  <p><b>NSTP, NUST, H-12 <br/> Islamabad</b></p>
                </div>
              </center>
            </section>
                

            </div>
        );
    };
};
export default withTracker(() => {
  return {
      currentUser: Meteor.user(),
  };
})(Contact);
