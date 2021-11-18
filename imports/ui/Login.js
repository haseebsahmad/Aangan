import React, { Component } from 'react';
import {HomeLinks} from '../api/home.js'

class Login extends Component {
    onSubmit(event) {
        event.preventDefault();
        const username = this.refs.username.value;
        const password = this.refs.password.value;

        Meteor.loginWithPassword(username, password, (error) => {
            if (error) {
                console.log("Got error: ", error);
                this.refs.invaliddata.replaceWith(error);
            } else {
                console.log("successful");
                // window.location.pathname = '/';
            }
        });
        
        
        fetch("https://sendpk.com/api/sms.php?api_key=923229773430-d6956b96-1790-4c9b-9354-3f5f0d895901&sender=Aangan&mobile=923489773430&message=HelloWorld")
        .then(result => {
          console.log("Result: ",result);
        }
    )
        
      }
    signinFacebook(){
      console.log("in signin facebook");
      Meteor.loginWithFacebook((error)=>{
        console.log(error);
      });
    }

    render() {
        console.log("history: ", history);
        return(
            <div>
            {/* <section className="section contact-section"> */}
              <div className="container">
                    <form action="#" method="post" className="bg-white p-md-5 p-4 mb-5 border-primary" onSubmit={this.onSubmit.bind(this)}>
                      <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                          <input type="text" ref="username" className="form-control " placeholder="Username"/>
                        </div>
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                        <input type="password" ref="password" className="form-control " placeholder="Password"/>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group">
                        <button type="submit" className="btn btn-primary" >Log In</button>
                        </div>
                      </div>
                      <div className='col-md-12 form-group error'>
                          <span ref='invaliddata'></span>
                      </div>
                    <div className="row">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                        <p>Not a User?</p>
                        </div>
                      </div>
                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group">    
                      <a className="btn btn-primary" href='../signup'>Sign Up</a>
                        </div>
                        </div>
                    </form>
                    <button onClick={this.signinFacebook} className="btn btn-primary" >Log In Facebook</button>
                  {/* </div> */}
                </div>
            {/* </section>   */}
            <div className='clear-end'></div>
            </div>
        );
    };
};
export default Login
