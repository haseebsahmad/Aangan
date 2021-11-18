import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Plots, UserPlotBookings } from '../api/plots.js';
import Plot from './Plot.js';
import Account from './Account';
import { render } from 'react-dom';
import 'aos/dist/aos.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';

class IndividualPlot extends Component {

    constructor(props) {
        super(props);
    };

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

    renderImages() {
      let images = this.props.plots[0].images;
      console.log("In renderimages", this.props.plots);
        return images.map((image) => {
          console.log(image);
          return (
            <div className="extra-images">
              <img className='multiple-images' src={'/uploads/'+this.props.plots[0]._id+'/'+image} alt="Image placeholder" className="img-fluid"/>
            </div>
          );
        });
      
    }

    render() {
      $(".owl-carousel").owlCarousel({
        items : 1,
        autoplay: true,
        autoPlay: 1500, //Set AutoPlay to 3 seconds
        
        });

      render(<div>
        <Account /><br/>
        </div>,
        document.getElementById('signin')
        );

      const plot = this.props.plots[0];
      return(
            <div className="container">
            <header>
            <center>
              <h1>Plot</h1>
            </center>
            </header>
            <ul className='plots'>
              {this.renderPlots()}
              {plot ?
              <div className='plot-detail'>
                <div className='clear-end'></div>
                {plot.detail}<br/>                
                <br/>
              </div>:""}
            </ul>
            {plot ? 
              <div>
                <center>
                <div className="row">
                  <div className="col-md-12">
                    {/* <div className="home-slider major-caousel owl-carousel mb-5" data-aos="fade-up" data-aos-delay="200"> */}
                      {this.renderImages()}
                    {/* </div> */}
                  </div>                  
                </div>
                </center>
              </div>
              :""}
            <div className='clear-end'></div>
          </div>
        );
    };
};

export default withTracker(() => {
    Meteor.subscribe('plots');
    Meteor.subscribe('Meteor.users');
    console.log("userid: ", Meteor.userId());
    return {
        plots: Plots.find({ _id: (window.location.pathname).match('[^/]*$')[0] }).fetch(),
        currentUser: Meteor.user(),   
    };
  })(IndividualPlot);