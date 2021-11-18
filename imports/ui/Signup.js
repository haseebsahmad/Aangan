import React, { Component } from 'react';
import { Accounts } from 'meteor/accounts-base';
import '../api/accounts.js';


class Signup extends Component {
    onSubmit(event) {
        event.preventDefault();
        var phone = this.refs.phone.value;                
        if (this.refs.password.value!=this.refs.passwordRepeat.value){
            console.log("Error: Password do not match");
            this.refs.incorrectPassword.replaceWith("Passwords do not match");
        }
        else if (phone.length != 12){
          console.log("Error: Phone number not in required formate");
          this.refs.incorrectPassword.replaceWith("");
          this.refs.incorrectPhone.replaceWith("Phone number not in required format"); 
        }
        else {
          this.refs.incorrectPassword.replaceWith("");
          this.refs.incorrectPhone.replaceWith("");
            // const redirect = (role) => {
            //     if (role == "customer"){
            //         this.props.history.push('/SignupCustomer');
            //     };
            //     if (role == "company"){
            //         this.props.history.push('/SignupCompany');
            //     };
            //     if (role == "guide"){
            //         this.props.history.push('/SignupGuide');
            //     };
            // }
            // const userType = this.refs.role.value;
            const role = "company"; //Will be chnaged when other roles are defined
            const userdata = {
                username: this.refs.username.value,
                email: this.refs.email.value,
                password: this.refs.password.value,
                profile: {phone: this.refs.phone.value},
            };
            var input = document.getElementById("image");
            if(input.files[0]){
              var fReader = new FileReader();
              fReader.readAsDataURL(input.files[0]);
              fReader.onloadend = function(event){
                  userdata.profile = {
                      dp: event.target.result
                  }
              
              //     Meteor.call('plots.insert', plot, event.target.result);      
              //   }   
                  userdata.image = event.target.result;
                  console.log("Userdata: ", userdata);
                  Accounts.createUser(userdata, (error) => {
                    // Accounts.sendVerificationEmail(Meteor.user()._id, userdata.email)
                      if (error) {
                          console.log("Got error: ", error);
                          this.refs.invalidUsername.replaceWith(error.reason);
                      } else {
                          console.log("successful", Meteor.user()._id );
                          // redirect(role);
                          Meteor.call('user.role', Meteor.user()._id , role);
                          this.addFields();
                      }
                  });
              };
            }
            else{
              Accounts.createUser(userdata, (error) => {
                // Accounts.sendVerificationEmail(Meteor.user()._id, userdata.email)
                  if (error) {
                      console.log("Got error: ", error);
                      this.refs.invalidUsername.replaceWith(error.reason);
                  } else {
                      console.log("successful", Meteor.user()._id );
                      // redirect(role);
                      Meteor.call('user.role', Meteor.user()._id , role);
                      this.addFields();
                  }
              });
            }
    }
    }

    addFields(){
      const fields = {
        name: this.refs.name.value,
        phone: this.refs.phone.value,
        company: this.refs.company.value,
        city: this.refs.city.value,
        intro: this.refs.intro.value,
        userType:  this.refs.role.value
      };
      // for email verification:    https://docs.meteor.com/api/passwords.html#Accounts-createUser
      const userId = Meteor.user()._id;
      Meteor.call('user.addFields', fields, (error, result) => {
          if (error){
              console.log("Error ", error);
          }
          else {
              alert("Verify your email to add property");
              window.location.pathname = '/';
          }
      });
    }

    render() {
        return(
          <div>
            <div className="container signup">
          {/* <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4" data-aos="fade-left"> */}
                <form action="#" data-aos="fade-left" method="post" className="bg-white p-md-5 p-4 mb-5" onSubmit={this.onSubmit.bind(this)} >
                <div className="row ">
                    <div className="col-md-5 col-lg-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon-dropdown"> Role </span>
                      <select ref="role" className="form-control">
                          <option value="" disabled selected>Choose role</option>
                          <option value="privateUser">Private User</option>
                          <option value="realEstateAgent">Real Estate Agent</option>
                          <option value="realEstateCompany">Real Estate Company</option>
                      </select>              
                    </div>
                  {/* </div> */}
                  <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon-dropdown"> City </span>
                      <select className="form-control" ref='city' id="sel1">
                            <option required value="" disabled selected>City (required)</option>
                            <option>  Abbottabad  	</option>
                            <option>	Aliabad 	</option>
                            <option>	Alpurai 	</option>
                            <option>	Altit	</option>
                            <option>	Askole	</option>
                            <option>	Astore	</option>
                            <option>	Athmuqam	    </option>
                            <option>	Attock City </option>
                            <option>	Awaran  	</option>
                            <option>	Ayubia  	</option>
                            <option>	Babusar 	</option>
                            <option>	Badin   	</option>
                            <option>	Bagh    	</option>
                            <option>	Bahawalnagar    </option>
                            <option>	Bahawalpur  </option>
                            <option>	Balghar	</option>
                            <option>	Bannu   	</option>
                            <option>	Barah Valley	</option>
                            <option>	Bardar  	</option>
                            <option>	Barkhan 	</option>
                            <option>	Batgram 	</option>
                            <option>	Bhakkar 	</option>
                            <option>	Bunji	</option>
                            <option>	Chakwal 	</option>
                            <option>	Chalunka	</option>
                            <option>	Chaman  	</option>
                            <option>	Charsadda   </option>
                            <option>	Chilas	</option>
                            <option>	Chilas  	</option>
                            <option>	Chiniot 	</option>
                            <option>	Chitral 	</option>
                            <option>	Chitral.	</option>
                            <option>	Dadu    	</option>
                            <option>	Daggar  	</option>
                            <option>	Dalbandin   </option>
                            <option>	Danyor	</option>
                            <option>	Dasu    	</option>
                            <option>	Dera All	ahyar   </option>
                            <option>	Dera Bugti  </option>
                            <option>	Dera Ghazi Khan </option>
                            <option>	Dera Ismail Khan    </option>
                            <option>	Dera Murad Jamali   </option>
                            <option>	Eidgah  	</option>
                            <option>	Fairy Meadows	</option>
                            <option>	Faisalabad  </option>
                            <option>	Gakuch  	</option>
                            <option>	Gandava 	</option>
                            <option>	Ghotki  	</option>
                            <option>	Gilgit  	</option>
                            <option>	Gorikot	</option>
                            <option>	Gujranwala  </option>
                            <option>	Gujrat  	</option>
                            <option>	Gulmit	</option>
                            <option>	Gwadar  	</option>
                            <option>	Hafizabad   </option>
                            <option>	Haji Gham	</option>
                            <option>	Haldi	</option>
                            <option>	Hangu   	</option>
                            <option>	Haripur 	</option>
                            <option>	Hassanabad Chorbat	</option>
                            <option>	Hunza	</option>
                            <option>	Hushe	</option>
                            <option>	Hussainabad	</option>
                            <option>	Hyderabad City  </option>
                            <option>	Islamabad   </option>
                            <option>	Jacobabad   </option>
                            <option>	Jaglot	</option>
                            <option>	Jalal Abad	</option>
                            <option>	Jamshoro	    </option>
                            <option>	Jhang City  </option>
                            <option>	Jhang Sadr  </option>
                            <option>	Jhelum  	</option>
                            <option>	Jutal	</option>
                            <option>	Kalam	</option>
                            <option>	Kalat   	</option>
                            <option>	Kandhkot	    </option>
                            <option>	Karachi 	</option>
                            <option>	Karak   	</option>
                            <option>	Karimabad	</option>
                            <option>	Kashmir 	</option>
                            <option>	Kasur   	</option>
                            <option>	Keris Valley	</option>
                            <option>	Khairpur	    </option>
                            <option>	Khanewal	    </option>
                            <option>	Khaplu	</option>
                            <option>	Kharan  	</option>
                            <option>	Kharfaq	</option>
                            <option>	Khushab 	</option>
                            <option>	Khuzdar 	</option>
                            <option>	Kohat   	</option>
                            <option>	Kohlu   	</option>
                            <option>	Kotli   	</option>
                            <option>	Kumrat	</option>
                            <option>	Kumrat  	</option>
                            <option>	Kundian 	</option>
                            <option>	Lahore  	</option>
                            <option>	Lakki Marwat    </option>
                            <option>	Larkana 	</option>
                            <option>	Leiah   	</option>
                            <option>	Lodhran 	</option>
                            <option>	Loralai 	</option>
                            <option>	Maiun	</option>
                            <option>	Malakand	    </option>
                            <option>	Mandi Bahauddin </option>
                            <option>	Mansehra	    </option>
                            <option>	Mardan  	</option>
                            <option>	Masiwala	    </option>
                            <option>	Mastung 	</option>
                            <option>	Matiari 	</option>
                            <option>	Mehra   	</option>
                            <option>	Mianwali	    </option>
                            <option>	Minimarg	</option>
                            <option>	Mirpur Khas </option>
                            <option>	Misgar	</option>
                            <option>	Multan  	</option>
                            <option>	Murree  	</option>
                            <option>	Musa Khel Bazar </option>
                            <option>	Muzaffar	garh    </option>
                            <option>	Nagar Khas	</option>
                            <option>	Naltar Valley	</option>
                            <option>	Nankana 	Sahib   </option>
                            <option>	Naran Kaghan.	</option>
                            <option>	Narowal 	</option>
                            <option>	Nasirabad	</option>
                            <option>	Nathia Gali </option>
                            <option>	Naushahro Firoz </option>
                            <option>	Nawabshah   </option>
                            <option>	Neelam	</option>
                            <option>	Neelam  	</option>
                            <option>	New Mirpur  </option>
                            <option>	Nowshera	    </option>
                            <option>	Okara   	</option>
                            <option>	Oshikhandass	</option>
                            <option>	Pakpattan   </option>
                            <option>	Palas	</option>
                            <option>	Panjgur 	</option>
                            <option>	Parachinar  </option>
                            <option>	Pasu	</option>
                            <option>	Peshawar	    </option>
                            <option>	Pishin  	</option>
                            <option>	Qila Abdullah   </option>
                            <option>	Qila Saifullah  </option>
                            <option>	Quetta  	</option>
                            <option>	Rahimyar	 Khan   </option>
                            <option>	Rajanpur	    </option>
                            <option>	Rawala Kot  </option>
                            <option>	Rawalpindi  </option>
                            <option>	Rawlakot	    </option>
                            <option>	Sadiqabad   </option>
                            <option>	Sahiwal 	</option>
                            <option>	Saidu Sharif    </option>
                            <option>	Sanghar 	</option>
                            <option>	Sargodha	    </option>
                            <option>	Serai   	</option>
                            <option>	Shahdad Kot </option>
                            <option>	Sheikhupura </option>
                            <option>	Shigar	</option>
                            <option>	Shikarpur   </option>
                            <option>	Shimshal	</option>
                            <option>	Sialkot City    </option>
                            <option>	Sibi    </option>
                            <option>	Skardu	</option>
                            <option>	Sost	</option>
                            <option>	Sukkur  	</option>
                            <option>	Sultan Abad	</option>
                            <option>	Swabi   	</option>
                            <option>  Swat    </option>
                            <option>	Taghafari	</option>
                            <option>	Tando Allahyar  </option>
                            <option>	Tando Muhammad Khan </option>
                            <option>	Tank    	</option>
                            <option>	Thatta  	</option>
                            <option>	Timargara   </option>
                            <option>	Toba Tek	Singh  </option>
                            <option>	Tolipeer	    </option>
                            <option>	Tolti Kharmang	</option>
                            <option>	Turbat  	</option>
                            <option>	Umarkot 	</option>
                            <option>	Upper Dir   </option>
                            <option>	Uthal   	</option>
                            <option>	Vihari  	</option>
                            <option>	Yugo	</option>
                            <option>	Zhob    	</option>
                            <option>	Ziarat  	</option>
                            <option>  Other   </option>
                          </select>
                        </div>
                      </div>
                    <div className="row ">
                    <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Username </span>
                      <input type="text" ref="username" placeholder="Username" className="form-control" />
                    </div>
                      <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                        <span class="input-group-addon input-icon"> Email </span>
                        <input type="email" ref="email" placeholder="Email" className="form-control"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Password </span>
                        <input type="password" ref="password" placeholder="Password" className="form-control"/>
                      </div>
                      <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Password </span>
                        <input type="password" ref="passwordRepeat" placeholder="Password Again" className="form-control"/>
                      </div>
                    
                  {/* <div className="row">
                    <div className="col-md-6 form-group">
                      <input type="submit" value="Sign Up" className="btn btn-primary"/>
                    </div>
                  </div> */}
                  


                  {/* <div className="row"> */}
                    <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Name </span>
                      <input required type="text" ref="name" placeholder="Full Name (required)" className="form-control" />
                    </div>
                    <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Phone </span>
                      <input required type="tel" ref="phone" placeholder="Phone# (required) e.g. 923221234567" className="form-control "/>
                    </div>
                  {/* </div> */}
              
                  {/* <div className="row"> */}
                  {/* </div> */}
                  {/* <div className="row"> */}
                    <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Company </span>
                      <input type="text" ref="company" placeholder="Company Name (Optional)" className="form-control "/>
                    </div>
                  {/* </div> */}
                  {/* <div className="row"> */}
                    <div className="col-md-5 col-sm-5 col-xs-5 form-group input-group">
                    <span class="input-group-addon input-icon"> Intro </span>
                      <input type="text" rows='5' ref="intro" placeholder="Brief introduction of company (Optional)" minLength='150' maxLength='500' className="form-control "/>
                    </div>
                  {/* </div> */}
                  <div className="col-md-5 col-sm-5 col-xs-5  form-group">
                      <label className="text align-self-center">Upload Profile Picture:</label>
                      <input type="file" id="image" ref="picture" accept="image/*"/>
                    </div>
                  </div>
                  <div className='error'>
                    <span ref='incorrectPassword'></span><br/>
                    <span ref='invalidUsername'></span><br/>
                    <span ref='incorrectPhone'></span>
                  </div>
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6 col-xs-6 form-group">
                      <input ref='signup_button' type="submit" value="Sign Up" className="btn btn-primary"/>
                    </div>
                    </div>
                </form>

            {/* </section> */}
            <div className='clear-end'></div>
            </div>
            </div>
                );
    };
};
export default Signup
