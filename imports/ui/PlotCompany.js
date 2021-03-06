import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Plots } from '../api/plots.js';
import Plot from './Plot.js';
import Account from './Account';
import { render } from 'react-dom';
import {HomeLinks} from '../api/home.js'
import { post, data } from 'jquery';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hideCompleted: false,
    };
  }

  uploadImages(){
      console.log("Upload images called");
      var arr = [];
        var files = document.getElementById("images").files; //FileList object
        console.log(files);
        function readfile(i){
            var file = files[i];
            //Only pics
            if (!file.type.match('image')) {if(i+1<files.length) readfile(i+1)};
            console.log('ImageFIles: ',file);
            var picReader = new FileReader();
            picReader.addEventListener("load", function (event) {
                console.log("target", event.target);
                arr.push({name:file.name,data:event.target.result});
            });
            //Read the image
            picReader.readAsDataURL(file);
            if(i+1<files.length) {
              readfile(i+1)}
          }
          if (files.length > 0){
            readfile(0);}
          return arr;
  }

  createProperty(){
    const today = new Date();
      const constructionDate = new Date(this.refs.constructionDate.value); //make it optional. Tbc
      var uploadedImage = this.uploadImages();
      const plot = {
          userId: Meteor.userId(),
          // size : this.refs.size.value, //add units. tbc
          phone : this.refs.phone.value,
          purpose : this.refs.purpose.value,
          // cnic : this.refs.cnic.value,
          constructionDate : this.refs.constructionDate.value,
          city : this.refs.city.value,
          location : this.refs.location.value,
          price: parseInt(this.refs.price.value),
          detail : this.refs.detail.value,
          images: uploadedImage,
          type : this.refs.type.value};
          
      var flag = true;
      if (this.refs.size.value > 0){
        plot.size = parseFloat(this.refs.unit.value)*this.refs.size.value;
      }
      else{
        flag = false
        this.refs.incorrectSize.replaceWith('Enter valid size');
      }
      if (today < constructionDate){
        flag = false;
        this.refs.incorrectDate.replaceWith("Enter the past date");
      }
      // if (plot.size < 0){
      //   flag = false
      //   this.refs.incorrectSize.replaceWith('Enter valid size');
      // }
      if (plot.price < 0){
        flag = false
        this.refs.incorrectPrice.replaceWith('Enter valid price');
      }
      if (!(plot.type != "House" | plot.type != "Plot")){
        flag = false
        this.refs.incorrectType.replaceWith('Enter type');
      }
      if (flag == true){
        var input = document.getElementById("image");
        console.log("Input1: ", input)
        var fReader = new FileReader();
        fReader.onload = function(event){
          console.log("image 1: ", event.target.result);
          for(var i=0; i<uploadedImage.length;i++)
          {
            //var cdnURL= 'https://storage.bunnycdn.com/aangan1storage/%2Faangan1storage%2F/'+uploadedImage[i].name;
            var cdnURL= 'https://storage.bunnycdn.com/aangan1storage/featured/'+uploadedImage[i].name;
            console.log("ImageID: ", cdnURL);

            fetch(cdnURL,{
            method: 'PUT',
            headers: { 
              "AccessKey": "07da9b11-9aa3-4b18-9a7695d9c2d8-3982-4a87",
              "Content-Type": "image/jpeg"},  
            body: document.getElementById("images").files[i]
            }).then(response => response.json())
            .then(response => console.log("Upload Response: ",response))
            .catch(err => console.error(err));
          }
        // HTTP.call(post, "https://secure.h3techs.com/sms/api/send", data,  (res)=>{console.log("res",res)});
          Meteor.call('plots.insert', plot, event.target.result, (error, result) => {
            console.log('error: ', error);
            if (error) {
              console.log('error: ', error);
            }
            else{
              alert("Property Added successfully");
              // this.props.history.push('/PlotDisplay');
              }
            }
              );
        }   
        fReader.readAsDataURL(input.files[0]);
    }
      

      // Clear form
      this.refs.location.value = '0';
      this.refs.size.value = '';
      this.refs.price.value = '';
      this.refs.phone.value = '';
      this.refs.cnic.value = '';
      this.refs.constructionDate.value = '';
      this.refs.detail.value = '';
    
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!(Meteor.user())){
      document.getElementById("signup-popup").click();
    }
    /*else if (!(Meteor.user() && Meteor.user().emails[0].verified))
    {
      alert("Verify your email");
    }*/
    else{
      this.createProperty();
    }
  }  

  renderPlots() {
    let filteredPlots = this.props.plots;
    return filteredPlots.map((plot) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      if (plot.owner === currentUserId){
      return (
        <div>
          <Plot
            key={plot._id}
            plot={plot}
          ></Plot>        
        </div>
      );
        }
    });
  }

  render() {
    render(<div>
      <Account /><br/>
      </div>,
      document.getElementById('signin')
      );
      // Download function
      const options = {
        method: 'GET',
        headers: {Accept: '*/*', AccessKey: '70c2d1ab-7ef8-4cea-9383-547ea75588a0d99ffb89-7c88-4f42-99b5-0d1ea88bd82c'}
      };
     /* 
      fetch('https://storage.bunnycdn.com/aanganstorage/Plots/File1.jpeg', options)
        .then(response => response.json())
        .then(response => console.log("download image: ", response))
        .catch(err => console.error(err));*/


    // document.getElementById('home-description').innerText = "";
    // document.getElementById('home-plots').innerHTML = ''
    // document.getElementById('scroll-down').innerHTML = '';
    return (
      <div className="container">
        <header>
          <h1>{this.props.id} <br/>
            <center>
              Add Property{this.props.owner}
            </center>
          </h1>
        {/* { this.props.currentUser ? */}
              <div className='plot-form'>
                <section className="section contact-section">
                  <div className="container-contact">
                    <div className="row" data-aos="fade-up">
                      <div className="col-md-3  col-lg-3 col-sm-3 col-xs-3 ">
                    </div>
                    <div className="col-md-6  col-lg-6 col-sm-6 col-xs-6 ">
                      
                      <form action="#" method="post" className="border border-primary bg-white p-md-5 p-4 mb-5" onSubmit={this.handleSubmit.bind(this)} >
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon"> City </span>
                          <input type="text" ref="city" placeholder="City" list='cities' required className="form-control " />
                            <datalist id="cities" >
                            <option>  Abbott??b??d  	</option>
                              <option>	Al????bad 	</option>
                              <option>	Alp??rai 	</option>
                              <option>	Altit	</option>
                              <option>	Askole	</option>
                              <option>	Astore	</option>
                              <option>	Athmuqam	    </option>
                              <option>	Attock City </option>
                              <option>	Aw??r??n  	</option>
                              <option>	Ayubia  	</option>
                              <option>	Babusar 	</option>
                              <option>	Bad??n   	</option>
                              <option>	B??gh    	</option>
                              <option>	Bah??walnagar    </option>
                              <option>	Bah??walpur  </option>
                              <option>	Balghar	</option>
                              <option>	Bannu   	</option>
                              <option>	Barah Valley	</option>
                              <option>	Bard??r  	</option>
                              <option>	B??rkh??n 	</option>
                              <option>	Batgr??m 	</option>
                              <option>	Bhakkar 	</option>
                              <option>	Bunji	</option>
                              <option>	Chakw??l 	</option>
                              <option>	Chalunka	</option>
                              <option>	Chaman  	</option>
                              <option>	Ch??rsadda   </option>
                              <option>	Chilas	</option>
                              <option>	Chil??s  	</option>
                              <option>	Chiniot 	</option>
                              <option>	Chitr??l 	</option>
                              <option>	Chitral.	</option>
                              <option>	D??du    	</option>
                              <option>	Daggar  	</option>
                              <option>	D??lband??n   </option>
                              <option>	Danyor	</option>
                              <option>	Dasu    	</option>
                              <option>	Dera All	??hy??r   </option>
                              <option>	Dera Bugti  </option>
                              <option>	Dera Gh??zi Kh??n </option>
                              <option>	Dera Ism????l Kh??n    </option>
                              <option>	Dera Mur??d Jam??li   </option>
                              <option>	Eidg??h  	</option>
                              <option>	Fairy Meadows	</option>
                              <option>	Faisal??b??d  </option>
                              <option>	G??kuch  	</option>
                              <option>	Gand??v?? 	</option>
                              <option>	Ghotki  	</option>
                              <option>	Gilgit  	</option>
                              <option>	Gorikot	</option>
                              <option>	Gujr??nw??la  </option>
                              <option>	Gujr??t  	</option>
                              <option>	Gulmit	</option>
                              <option>	Gw??dar  	</option>
                              <option>	H??fiz??b??d   </option>
                              <option>	Haji Gham	</option>
                              <option>	Haldi	</option>
                              <option>	Hangu   	</option>
                              <option>	Har??pur 	</option>
                              <option>	Hassanabad Chorbat	</option>
                              <option>	Hunza	</option>
                              <option>	Hushe	</option>
                              <option>	Hussainabad	</option>
                              <option>	Hyder??b??d City  </option>
                              <option>	Islamabad   </option>
                              <option>	Jacob??b??d   </option>
                              <option>	Jaglot	</option>
                              <option>	Jalal Abad	</option>
                              <option>	J??mshoro	    </option>
                              <option>	Jhang City  </option>
                              <option>	Jhang Sadr  </option>
                              <option>	Jhelum  	</option>
                              <option>	Jutal	</option>
                              <option>	Kalam	</option>
                              <option>	Kal??t   	</option>
                              <option>	Kandhkot	    </option>
                              <option>	Karachi 	</option>
                              <option>	Karak   	</option>
                              <option>	Karimabad	</option>
                              <option>	Kashmir 	</option>
                              <option>	Kas??r   	</option>
                              <option>	Keris Valley	</option>
                              <option>	Khairpur	    </option>
                              <option>	Kh??new??l	    </option>
                              <option>	Khaplu	</option>
                              <option>	Kh??r??n  	</option>
                              <option>	Kharfaq	</option>
                              <option>	Khush??b 	</option>
                              <option>	Khuzd??r 	</option>
                              <option>	Koh??t   	</option>
                              <option>	Kohlu   	</option>
                              <option>	Kotli   	</option>
                              <option>	Kumrat	</option>
                              <option>	Kumrat  	</option>
                              <option>	Kundi??n 	</option>
                              <option>	Lahore  	</option>
                              <option>	Lakki Marwat    </option>
                              <option>	L??rk??na 	</option>
                              <option>	Leiah   	</option>
                              <option>	Lodhr??n 	</option>
                              <option>	Loralai 	</option>
                              <option>	Maiun	</option>
                              <option>	Malakand	    </option>
                              <option>	Mandi Bah??udd??n </option>
                              <option>	M??nsehra	    </option>
                              <option>	Mardan  	</option>
                              <option>	Mas??w??la	    </option>
                              <option>	Mastung 	</option>
                              <option>	Mati??ri 	</option>
                              <option>	Mehra   	</option>
                              <option>	Mi??nw??li	    </option>
                              <option>	Minimarg	</option>
                              <option>	M??rpur Kh??s </option>
                              <option>	Misgar	</option>
                              <option>	Mult??n  	</option>
                              <option>	Murree  	</option>
                              <option>	M??sa Khel B??z??r </option>
                              <option>	Muzaffar	garh    </option>
                              <option>	Nagar Khas	</option>
                              <option>	Naltar Valley	</option>
                              <option>	Nank??na 	S??hib   </option>
                              <option>	Naran Kaghan.	</option>
                              <option>	N??row??l 	</option>
                              <option>	Nasirabad	</option>
                              <option>	Nathia Gali </option>
                              <option>	Naushahro F??roz </option>
                              <option>	Naw??bsh??h   </option>
                              <option>	Neelam	</option>
                              <option>	Neelam  	</option>
                              <option>	New M??rpur  </option>
                              <option>	Nowshera	    </option>
                              <option>	Ok??ra   	</option>
                              <option>	Oshikhandass	</option>
                              <option>	P??kpattan   </option>
                              <option>	Palas	</option>
                              <option>	Panjg??r 	</option>
                              <option>	Parachin??r  </option>
                              <option>	Pasu	</option>
                              <option>	Pesh??war	    </option>
                              <option>	Pishin  	</option>
                              <option>	Qila Abdull??h   </option>
                              <option>	Qila Saifull??h  </option>
                              <option>	Quetta  	</option>
                              <option>	Rah??my??r	 Kh??n   </option>
                              <option>	R??janpur	    </option>
                              <option>	R??wala Kot  </option>
                              <option>	R??walpindi  </option>
                              <option>	Rawlakot	    </option>
                              <option>	S??diq??b??d   </option>
                              <option>	S??h??w??l 	</option>
                              <option>	Saidu Sharif    </option>
                              <option>	S??nghar 	</option>
                              <option>	Sargodha	    </option>
                              <option>	Serai   	</option>
                              <option>	Shahd??d Kot </option>
                              <option>	Sheikhupura </option>
                              <option>	Shigar	</option>
                              <option>	Shik??rpur   </option>
                              <option>	Shimshal	</option>
                              <option>	Si??lkot City    </option>
                              <option>	Sibi    </option>
                              <option>	Skardu	</option>
                              <option>	Sost	</option>
                              <option>	Sukkur  	</option>
                              <option>	Sultan Abad	</option>
                              <option>	Sw??bi   	</option>
                              <option>  Swat    </option>
                              <option>	Taghafari	</option>
                              <option>	Tando All??hy??r  </option>
                              <option>	Tando Muhammad Kh??n </option>
                              <option>	T??nk    	</option>
                              <option>	Thatta  	</option>
                              <option>	Timargara   </option>
                              <option>	Toba Tek	Singh  </option>
                              <option>	Tolipeer	    </option>
                              <option>	Tolti Kharmang	</option>
                              <option>	Turbat  	</option>
                              <option>	Umarkot 	</option>
                              <option>	Upper Dir   </option>
                              <option>	Uthal   	</option>
                              <option>	Vih??ri  	</option>
                              <option>	Yugo	</option>
                              <option>	Zhob    	</option>
                              <option>	Zi??rat  	</option>
                              <option>  Other   </option>
                            </datalist>
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon"> Area </span>
                            <input ref="location" placeholder="Enter area of city" className="form-control " />
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon-dropdown"> Unit </span>
                            <select className="form-control" required ref='unit' id="sel1">
                              <option value='0.003673'>  Square Feet  	</option>
                              <option value='0.033057'>  Square Yard  	</option>
                              <option value='1'>	Marla 	</option>
                              <option value='20'>	Kanal 	</option>
                              <option value='160'>	Acre 	</option>
                              <option value='4000'>	Marabba 	</option>
                            </select>
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                        </div>
                      </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon"> Size </span>
                            <input ref="size" placeholder="Enter size of your property" required className="form-control " />
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                              <span ref='incorrectSize' ></span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon"> Price </span>
                            <input type="number" ref="price" placeholder="Cost of Plot in PKR" required className="form-control " />
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                              <span ref='incorrectPrice' ></span>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon"> Phone </span>
                          <input type="tel" ref="phone" placeholder="Contact Number" className="form-control " />
                          <div className="error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">
                            <span ref='incorrectPhone' ></span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">
                          <input type="tel" ref="cnic" placeholder="CNIC" className="form-control " />
                          <div className="error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">
                            <span ref='incorrectCNIC' ></span>
                          </div>
                        </div>
                      </div> */}
                      <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon-dropdown"> Type </span>
                            <select className="form-control" required ref='type' id="sel1">
                              <option>  House  	</option>
                              <option>	Plot 	</option>
                            </select>
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                        </div>
                      </div>
                      <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                            <span class="input-group-addon input-icon-dropdown"> Purpose </span>
                            <select className="form-control" required ref='purpose' id="sel1">
                              <option>  Sell  	</option>
                              <option>	Rent 	</option>
                            </select>
                            <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group input-group">
                          <span class="input-group-addon input-icon"> Date </span>
                          <input type="date"  ref="constructionDate" placeholder="Date of Construction incase of building" className="form-control "/>
                          <span ref='incorrectDate'  ></span>
                        </div>
                      </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">
                            display image
                            <input type="file" id="image" ref="image" required accept="image/*" className="form-control "/>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">
                            other images
                            <input type="file" id="images" ref="images" accept="image/*" className="form-control " multiple/>
                          </div>
                          <div className='error col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group'>
                            </div>
                        </div>
                          <div className="row">
                            <div className="col-md-12  col-lg-12 col-sm-12 col-xs-12  form-group">                    
                              <textarea rows='5' type="text"  ref="detail" className="form-control "  placeholder="Any other notes for plot" />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-6  col-lg-6 col-sm-6 col-xs-6 form-group">
                              <input type="submit" value="Add Plot" className="btn btn-primary"/>
                            </div>
                          </div>
                        </form>
                          </div>
                            <div className="col-md-3  col-lg-3 col-sm-3 col-xs-3">
                            </div>
                          </div>
                      </div>
                    </section>
                  </div>
                {/* : '' */}
                {/* } */}
                </header>
                <ul className='plots'>
                  {this.renderPlots()}
                </ul>
                <div className='clear-end'></div>
              </div>
            );
      }
  }

  export default withTracker(() => {
    Meteor.subscribe('plots');
    Meteor.subscribe('homeLinks');
    return {
        homeLink: HomeLinks.findOne({}),
        plots: Plots.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),
    };
  })(App);