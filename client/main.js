
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../imports/startup/routes.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
    var theURL = "https://aangann.herokuapp.com";

    Meteor.absoluteUrl.defaultOptions.rootUrl = theURL;
    process.env.MOBILE_ROOT_URL = theURL;
    process.env.MOBILE_DDP_URL = theURL;
    process.env.DDP_DEFAULT_CONNECTION_URL = theURL;
  AOS.init({
    duration : 1500
  })
  $(".owl-carousel").owlCarousel({
    items : 1,
    autoplay: true,
    autoPlay: 1500, //Set AutoPlay to 3 seconds
    
    });

    Accounts.config({
      sendVerificationEmail:true,
      // forbidClientAccountCreation: true 
    });

  render(renderRoutes(), document.getElementById('render-target'));
});