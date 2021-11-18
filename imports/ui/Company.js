import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Plots } from '../api/plots.js';
import Plot from './Plot.js';
import Account from './Account';
import { render } from 'react-dom';
// import {HomeLinks} from '../api/home.js'



class Company extends Component {


  renderPlots() {
    let filteredPlots = this.props.plots;
    return filteredPlots.map((plot) => {
      return (
        <Plot
          key={plot._id}
          plot={plot}
        />
      );
    });
  }


  renderCompanyData(){
    console.log("Windo id: ", (window.location.pathname).match('[^/]*$')[0]);
    Meteor.call('users.companyData', (window.location.pathname).match('[^/]*$')[0],
    (err, result) => {
      if(err){
        console.log("Error: ", err);
      }
      else{
        console.log('Result Company: ', result);
        this.refs.phone.replaceWith(result[0].phone);
        if (result[0].intro){
          this.refs.intro.replaceWith(result[0].intro);
        }
        if (result[0].link){
          this.refs.link.replaceWith(result[0].link);
        }
        this.refs.address.replaceWith(result[0].address);
      }
    })
  }

  render() {
    this.renderCompanyData();
    // console.log("comp: ", this.props.comp);
    render(<div>
      <Account /><br/>
      </div>,
      document.getElementById('signin')
      );
    return (
      <div className="container">
        {/* <section> */}
        <header>
        <h1>{this.props.id} <br/>
          <center>
            {this.props.plots[0] ? this.props.plots[0].company : ""}
          </center>
        </h1>
        <center>
          <div className='company-intro'>
            <span ref='intro'></span><br/>
            {/* <span ref='license'></span><br/> */}
            <div className='plot-data'>
              <span ref='address'></span><br/>
              <span ref='link'></span><br/>
              <span ref='phone'></span><br/>
            </div>
          </div>
          {/* <h2 className='plot-company-rate'>Rating: <img src={this.getRating()} width='150px' ref='rateStar'></img></h2> */}
          {/* {this.getRating()} */}
        </center>
        </header>
        <ul className='plots'>
          {this.renderPlots()}
        </ul>
      </div>
    );
    }
  }

  export default withTracker(() => {
    Meteor.subscribe('plots');
    // Meteor.subscribe('reviews');
    // Meteor.subscribe('homeLinks');
    return {
        // homeLink: HomeLinks.findOne({}),
        plots: Plots.find({ owner: (window.location.pathname).match('[^/]*$')[0] }, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
        // reviews: Reviews.find({company: (window.location.pathname).match('[^/]*$')[0]}).fetch(),
        // thisReviewer: Reviews.find({company: (window.location.pathname).match('[^/]*$')[0], reviewer: Meteor.userId()}).fetch(),
        comp: Meteor.users.findOne({_id:(window.location.pathname).match('[^/]*$')[0]})
    };
  })(Company);