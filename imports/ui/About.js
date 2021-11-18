import React, { Component } from 'react';
// import {GuideBookings, AcceptedRequests} from '../api/guide.js';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Account from './Account';
import { render } from 'react-dom';
// import {HomeLinks} from '../api/home.js'


class About extends Component {

    render() {
        render(<div>
            <Account /><br/>
            </div>,
            document.getElementById('signin')
            );
        return(
            <div>
                    <section className="section ">
                          <div className="container">
                            <div className="half d-md-flex d-block">
                            <div className="image about" data-aos="fade-left"></div>
                            <div className="text" data-aos="fade-right" data-aos-delay="200">
                            <h2>Vision</h2>
                            
                            <p>Aangan aap ki khushyun ka</p>
                            {/* <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. </p> */}
                        </div>
                        </div>
                    </div>
                    </section>


                    <section className="section bg-light">
                    <div className="container">
                        <div className="half d-md-flex d-block">

                        <div className="text" data-aos="fade-right" data-aos-delay="200">
                            <h2>Mission</h2>
                            <p>The mission is to provide a save and accessible platform to local vendors and services providers for the needs of locals without boundaries.

The above mission needs discussion. Because when we write mission statement we mean every part of it. Each action word is to be reflected in our model.</p>
                            {/* <p>Pakistan, the top travel destination for 2020, is a mighty hub of mesmerizing landscapes, historical sites and cultural heritages. We are eager to portray the different aspects of Pakistan in the most pure and captivating ways. </p> */}
                            {/* <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. </p> */}
                        </div>
                        <div className="image about2" data-aos="fade-left"></div>
                        </div>
                        </div>
                    </section>
                <div className='clear-end'></div>
            </div> 
        )
    };
};
export default withTracker(() => {
    // Meteor.subscribe('homeLinks');
    return {
        // homeLink: HomeLinks.findOne({}),
        currentUser: Meteor.user(),
    };
  })(About);
