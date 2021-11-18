import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import {HomeLinks} from '../api/home.js'
import Account from './Account';
import { render } from 'react-dom';
import { Reviews } from '../api/reviews.js';
import Review from './Review.js';
import ReactDom from 'react-dom';
import { Plots, UserPlotBookings } from '../api/plots.js';
import Plot from './Plot.js';
import 'aos/dist/aos.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel';


class Home extends Component {



    city(){
        const locations = {
          'Punjab':{ $in:["Abdul Hakim", "Ahmadabad", "Ahmadpur East", "Ahmadpur Sial", "Ahmedpur Lumma", "Alipur", "Alipur Chatha", "Allahabad", "Arifwala", "Attock", "Bahawalnagar", "Bahawalpur", "Basirpur", "Bhakkar", "Bhalwal", "Bhawana", "Bhera", "Bhopalwala", "Burewala", "Chak Jhumra", "Chakwal", "Chaubara", "Chawinda", "Chenab Nagar (Rabwah)", "Chichawatni", "Chiniot", "Chishtian", "Choa Saidanshah", "Chowk azam", "Chowk Sarwar Shahid", "Chunian", "Dajal", "Darya Khan", "Daska", "Daud Khel", "Daultala", "Dera Din Panah", "Dera Ghazi Khan", "Khanpur", "Dhanote", "Dijkot", "Dina", "Dinga", "Dipalpur", "Dullewala", "Dunga Bunga", "Dunyapur", "Eminabad", "Faisalabad", "Faqirwali", "Farooqa", "Faruqabad", "Fatehjang", "Fatehpur", "Fazilpur", "Firozwala", "Fort Abbas", "Garh Maharaja", "Ghakhar", "Gogera", "Gojra", "Gujar Khan", "Gujranwala", "Gujranwala Cantonment", "Gujrat", "Hadali", "Hafizabad", "Harunabad", "Hasan Abdal", "Hasilpur", "Haveli Lakha", "Hazro", "Hujra Shah Muqim", "Isa Khel", "Jalalpur Bhattian", "Jalalpur Jattan", "Jalalpur Pirwala", "Jamke Chima", "Jampur", "Jand", "Jandanwala", "Jaranwala", "Jatoi", "Jauharabad", "Jehanian", "Jhang", "Jhawarian", "Jhelum", "Kabirwala", "Kahror Pakka", "Kahuta", "Kalabagh", "Kallar Kahar", "Kallar Sayaddan", "Kalur Kot", "Kamalia", "Kamar Mashani", "Kamir", "Kamoki", "Kamra Cantonment", "Kanganpur", "Karampur", "Karor Lal Esan", "Kasur", "Khairpur Tamewali", "Khanewal", "Khangarh", "Khanpur", "Khanqah Dogran", "Kharian", "Khewra", "Khudian", "Khurianwala", "Khushab", "Kot Abdul Malik", "Kot Addu", "Kot Chutta", "Kotli Loharan", "Kotli Sattian", "Kot Mithan", "Kot Mumin", "Kot Radha Kishan", "Kot Samaba", "Kundian", "Kunjah", "Lahore", "Lala Musa", "Lalian", "Layyah", "Liaquatabad", "Liaquatpur", "Lodhran", "Ludhewala Warraich", "Mailsi", "Makhdoom Pur Pahuran", "Malakwal", "Mamu Kanjan", "Mananwala Jodh Singh", "Mandi Bahauddin", "Mian Channu", "Miani", "Mianwali", "Minchinabad", "Mitha Tiwana", "Multan", "Muridke", "Murree", "Mustafabad", "Muzaffargarh", "Nankana Sahib", "Narang", "Narowal", "Noorpur Thal", "Nowshera Virkan", "Okara", "Okara Cantonment", "Pakpattan", "Pasrur", "Pattoki", "Phalia", "Phularwan", "Phulnagar", "Pind Dadan Khan", "Pindi Bhattian", "Pindi Gheb", "Pir Mahal", "Qadirpur Ran", "Qila Didar Singh", "Quaidabad", "Rahimyar Khan", "Raja Jang", "Rajanpur", "Rawalpindi", "Renala Khurd", "Sadiqabad", "Safdarabad", "Sahiwal", "Samasata", "Sambrial", "Samundri", "Sanawan", "Sangla Hill", "Sarai alamgir", "Sargodha", "Shadiwal", "Shahkot", "Shahpur Sadar", "Shakargarh", "Sharqpur", "Shehr Sultan", "Sheikhupura", "Shorkot", "Shorkot Cantonment", "Shujaabad", "Sialkot", "Sillanwali", "Sohawa", "Sukheke", "Talagang", "Tandlianwala", "Taunsa", "Taxila", "Toba Tek Singh", "Trinda Sawai Khan", "Tulamba", "Uch", "Vehari", "Wah Cantonment", "Warburton", "Wazirabad", "Yazman", "Zafarwal", "Zahir Pir"]},
          'Sindh': { $in:["Ahmedpur", "Arija", "Badah", "Badin", "Bandhi", "Behram", "Bhan", "Bhiria Road", "Bhitshah", "Chachro", "Choondiko", "Chore Old", "Dadu", "Daharki", "Daur", "Dhoronaro", "Digri", "Dokri", "Faqirabad", "Gambat", "Gharo", "Ghauspur", "Ghotki", "Golarchi", "Guddu", "Hala", "Halani", "Hingorja", "Husri", "Hyderabad", "Jacobabad", "Jam Nawaz Ali", "Jamshoro", "Jatia", "Jhol", "Jhudo", "Johi", "Kambar Ali Khan", "Kandhkot", "Kandiaro", "Karachi", "Kario Ghanwer", "Kashmor", "Kazi Ahmed", "Khairpur", "Khairpur Nathan Shah", "Khangarh", "Khipro", "Khoski", "Khuhra", "Kot Diji", "Kot Ghulam Muhammad", "Kotri", "Kunri", "Lakhi", "Larkana", "Madeji", "Makli", "Matiari", "Matli", "Mehar", "Mehrabpur", "Mirokhan", "Mirpur Khas", "Mirpur Mathelo", "Mithi", "Mithiani", "Moro", "Nasirabad", "Nasirpur", "Naudero", "Naukot", "Naushahro Feroze", "Nawabshah", "New Saeedabad", "Pacca Chang", "Padidan", "Pano aqil", "Pano aqil Cantonment", "Pirjo Goth", "Piryaloi", "Qubo Saeed Khan", "Radhan", "Rajo Khanani", "Ranipur", "Ratodero", "Rohri", "Sakrand", "Salehpat", "Sanghar", "Sehwan", "Setharja", "Shahdadkot", "Shahdadpur", "Shahpur Chakar", "Shikarpur", "Sinjhoro", "Sita Road", "Sobhodero", "Sujawal", "Sukkur", "Talhar", "Tando adam", "Tando Allahyar", "Tando Ghulam Ali", "Tando Ghulam Hyder", "Tando Jam", "Tando Jan Muhammad", "Tando Mir Ali", "Tando Muhammad Khan", "Thari Mirwah", "Tharushah", "Thatta", "Therhi", "Thul", "Ubauro", "Umerkot", "Warah"]},
          'KPK': { $in:["Abbottabad", "Akora Khattak", "Amangarh", "Bannu", "Barikot", "Bat Khela", "Behrain", "Charsadda", "Chitral", "Dera Ismail Khan", "Dir", "Doaba", "Hangu", "Haripur", "Havelian Cantonment", "Jehangira", "Kabal", "Karak", "Khalabat", "Khwazakhela", "Kohat", "Kulachi", "Lachi", "Lakki Marwat", "Mansehra", "Mardan", "Matta", "Mingawara", "Nawan Killi", "Nawanshehr", "Nowshera", "Pabbi", "Paharpur", "Paroa", "Peshawar", "Risalpur Cantonment", "Serai Naurang", "Shabqadar", "Swabi", "Swat", "Takht Bhai", "Tangi", "Tank", "Thall", "Timargara", "Topi", "Tordher", "Utmanzai", "Zaida" ]},
          'Balochistan':{ $in: ["Awaran", "Bela", "Buleda", "Chaman", "Chitkan", "Dera Allah Yar", "Dera Bugti", "Dera Murad Jamali", "Gwadar", "Hub", "Huramzai", "Kalat", "Khanozai", "Kharan", "Khuzdar", "Killa Abdullah", "Killa Saifullah", "Loralai", "Mastung", "Muslim Bagh", "Nal", "Nushki", "Pasni", "Pishin", "Quetta", "Saranan", "Sibi", "Sui", "Surab", "Tasp", "Tump", "Turbat", "Usta Muhammad", "Uthal", "Wadh", "Washuk", "Winder", "Zehri", "Zhob"]},
          'FATA':{ $in: ["Jamrud", "Landi Kotal", "Miran Shah", "Parachinar", "Sadda"]}
        }
        console.log("The value is: ", locations[this.refs.search.value]);
        if(locations[this.refs.search.value]){
          // console.log("The value is: ", locations[this.refs.search.value]);
          return locations[this.refs.search.value];
        }
        else{
          return this.refs.search.value;
          // return {'q':'destination: ','l': this.refs.search.value};
        }
      }
    
      handleSubmit(event){
        event.preventDefault();
        console.log("this.refs.search.value: ", this.refs.search.value);
        // const loc = this.location();
          const search = {
            constructionDate: this.refs.constructionDate.value,
            //location: this.location(), //this.refs.search.value,
            // location: this.refs.location.value,
            price: parseInt(this.refs.priceRange.value),
            // size: this.refs.size.value,
            city: this.city(),
            type: this.refs.type.value,
            purpose: this.refs.purpose.value,
            // destinationQuery: loc.q
            }
          if ((this.refs.sizeMin.value > 0) && (this.refs.sizeMax.value > 0)) {
            search.sizeMin = parseFloat(this.refs.unit.value)*this.refs.sizeMin.value;
            search.sizeMax = parseFloat(this.refs.unit.value)*this.refs.sizeMax.value;
          }
          if (search.type == 'null'){
            search.type = {$ne: ""};
          }
          if (search.purpose == 'null'){
            search.purpose = {$ne: ""}
          }
          console.log("search: ", search);
          Meteor.call('plots.search', search, (error, result) => {
            console.log('error: ', error);
            if (error) {
              document.getElementsById('render-plots').replaceWith('No plot found');
            }
            console.log('result: ', result, result[0]);
            if (result.length==0){
              render(
                <center><h4>No Plots found</h4></center>,
                document.getElementById('render-plots')
              );
            }
            else{
              // console.log("Price: ", result[0].price-this.refs.priceRange.value);
              render(
                this.renderPlots(result),
                document.getElementById('render-plots')
              );
              document.getElementById('home').innerText = "";
            }
            result = [];
            // this.refs.search.value = '';
            // this.refs.date.value = '';
            // this.refs.departure.value = ''
          });
      }
    
      renderPlots(filteredPlots) {
        return filteredPlots.map((plot) => {
          return (
            <Plot
              key={plot._id}
              plot={plot}
            />
          );
        });
      }


    displayProperty(){
        if (this.props.plots){
            console.log(this.props.plots);
            render(
                this.renderPlots(this.props.plots),
                document.getElementById('render-plots')
            );
            document.getElementById('home').innerText = "";
        }
    }

    renderAccounts(){
        ReactDom.render(<div>
            <Account /><br/>
            </div>,
            document.getElementById('signin')
            );
    }
    

    render() {
        window.onload = function(){
            var sliderSections = document.getElementsByClassName("range-slider");
                for( var x = 0; x < sliderSections.length; x++ ){
                  var sliders = sliderSections[x].getElementsByTagName("input");
                  for( var y = 0; y < sliders.length; y++ ){
                    if( sliders[y].type ==="range" ){
                      sliders[y].oninput = getVals;
                      // Manually trigger event first time to display values
                      sliders[y].oninput();
                    }
                  }
                }
        }
        function getVals(){
            // Get slider values
            var parent = this.parentNode;
            var slides = parent.getElementsByTagName("input");
              var slide1 = parseFloat( slides[0].value );
              var slide2 = parseFloat( slides[1].value );
            // Neither slider will clip the other, so make sure we determine which is larger
            if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
            
            var displayElement = document.getElementsByClassName("rangeValues")[0];
                displayElement.innerHTML = "Size: " + slide1 + "-" + slide2;
          }

        // window.onload()= function(){
        //     document.getElementById('top-section')='10px'
        // }
        // window.onload = function() {
        //     document.getElementById('top-section').height='10px';
        // };
        $(".owl-carousel").owlCarousel({
            items : 1,
            autoplay: true,
            // autoWidth: true,
            // heigth: 80,
            autoPlay: 1500, //Set AutoPlay to 3 seconds
            
            });
        var slider = document.getElementById("myRange");
        var output = document.getElementById("demo");
        if (slider){
          output.innerHTML = slider.value;
          slider.oninput = function() {
            output.innerHTML = this.value;
          }
        }
        return(
            <div>
                {this.renderAccounts()}
                <section id='top-section' className="site-hero overlay page-outside" >
                    
                <div className='home-search'>
                    <div className="site-hero-inner">
                        <div>
                            <center>
                                <div className='name-quote'>
                                    <h1 className="heading mb-4 animated swing"> Aangan </h1>
                                    <p id='home-description' className="sub-heading mb-5  animated fadeInUpBig slower">
                                        Aap ki khushion ka!
                                    </p>
                                </div>
                            </center>
                    <header>
                        <div className=' translate'>
                        <center>
                        <div id='home-search-form' className='search-form-div animated fadeInUpBig'>
                            <form className='search-form fadeInUpBig slower' onSubmit={this.handleSubmit.bind(this)}>
                            <center>
                            <div className='input-type-fields'>
                            <div className='search-fields'>
                                Unit: <br/>
                                <select className="home-input" ref='unit' id="sel1"> 
                                    <option value='0.003673'>  Sq Feet  	</option>
                                    <option value='0.033057'>  Sq Yard  	</option>
                                    <option selected value='1'>	Marla 	</option>
                                    <option value='20'>	Kanal 	</option>
                                    <option value='160'>	Acre 	</option>
                                    <option value='4000'>	Marabba 	</option>
                                </select>
                            </div>
                            <div className='search-fields'>
                                Type: <br/>
                                <select className="home-input" ref='type' id="sel1">
                                    <option value='null' defaultValue>  Select  	</option>
                                    <option>  House  	</option>
                                    <option>	Plot 	</option>
                                </select>
                            </div>
                            <div className='search-fields'>
                                Purpose: <br/>
                                <select className="home-input" ref='purpose' id="sel1">
                                    <option value='null' defaultValue>  Select  	</option>
                                    <option value='Sell'>  Purchase  	</option>
                                    <option value='Rent'>	Rent 	</option>
                                </select>
                            </div>
                            <div className="search-fields">
                                City:<br/>
                                <input className='home-input' type='text' placeholder='City' ref='search' list="cities"/>
                                <datalist id="cities">
                                    <option>  Punjab  	</option>
                                    <option>	KPK 	</option>
                                    <option>	Sindh 	</option>
                                    <option>	Balochistan	</option>
                                    <option>	FATA	</option>
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
                                    <option>	Taxila    	</option>
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
                                </datalist>
                                </div>             
                            <div className='search-fields'>
                            Date:<br/>
                                <input className='home-input'
                                type="date"
                                ref="constructionDate"
                                />
                            </div>
                            </div>
                            {screen.width>600? 
                            <div className='search-button'><br/>
                                <p className="pt-4 animated fadeInUpBig" id='home-plots'>
                                    <button className="btn uppercase btn-outline-light d-sm-inline d-block py-3 " id='find-button' type='submit'>Find</button>
                                </p>
                            </div>
                            :""}
                            <div className='sliders'>
                            <div className='slider-container'>
                                <div className='search-fields'>
                                    <section className="range-slider">
                                        <span className="rangeValues" id='size-range'></span>
                                        <input defaultValue="00" min="0" max="500" ref="sizeMin" type="range"/>
                                        <input defaultValue="500" min="0" max="500" ref="sizeMax" type="range"/>
                                    </section>
                                </div>
                            </div>
                            <div className='slider-container'>
                                <div className="slidecontainer search-fields">
                                Rs. <span id="demo"></span>
                                    <input className='home-input' type="range" min="100000" max="1000000000" defaultValue='1000000000' ref='priceRange' className="slider" id="myRange"/>
                                </div>
                            </div>
                        </div>
                        {screen.width<600? 
                            <div className='search-button'><br/>
                                <p className="pt-4 animated fadeInUpBig" id='home-plots'>
                                    <button className="btn uppercase btn-outline-light d-sm-inline d-block py-3 " id='find-button' type='submit'>Find</button>
                                </p>
                            </div>
                            :""}
                        </center>
                    </form>
                    
                    </div>
                    </center>
                    </div> 
                    </header>
                    <div className='clear-end'></div>
                        </div>
                    </div>
                    </div>
                </section>
                
                <div id='home'>

                <section className="section visit-section bg-light-2">
 
                    <div className="container">
                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-md-8 ">
                            <h2 className="heading" data-aos="fade-up">Platinum Agencies</h2>
                            <p className="lead" data-aos="fade-up">Find the best Real Estate agencies here</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 visit mb-3" data-aos="fade-right">
                            <a href="/"><img src="/images/img_8.jpg" alt="Image placeholder" className="img-fluid"/> </a>
                            <h3><a href="/">Emaraat</a></h3>
                            </div>
                            <div className="col-lg-3 col-md-6 visit mb-3" data-aos="fade-right" data-aos-delay="100">
                            <a href="/"><img src="/images/img_7.jpg" alt="Image placeholder" className="img-fluid"/> </a>
                            <h3><a href="/">E-Build Pakistan</a></h3>
                            </div>
                            <div className="col-lg-3 col-md-6 visit mb-3" data-aos="fade-right" data-aos-delay="200">
                            <a href="/"><img src="/images/img_4.jpg" alt="Image placeholder" className="img-fluid"/> </a>
                            <h3><a href="/">Agency 21</a></h3>
                            </div>
                            <div className="col-lg-3 col-md-6 visit mb-3" data-aos="fade-right" data-aos-delay="300">
                            <a href="/"><img src="/images/img_5.jpg" alt="Image placeholder" className="img-fluid"/> </a>
                            <h3><a href="/">Irfan Real Estate</a></h3>
                            </div>
                        </div>
                            <hr></hr>

                        <div className="row justify-content-center text-center mb-5">
                            <div className="col-md-8 ">
                            <h2 className="heading" data-aos="fade-up">Featured Properties</h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 col-lg-4">
                            <div className="card border-0"><a href="#"><img class="card-img-top scale-on-hover" src="https://aanganpull.b-cdn.net/featured/featured%20(3).jpg" alt="Card Image"/></a>
                            <div className="card-body">
                                <h4><a href="https://www.aangan.pk"><b>Florence Galleria</b></a></h4>
                                <h6 className="text-muted card-text">Islamabad</h6>
                                <hr/>
                                <div style={{width: "100%", textAlign: "center"}}>
                                <div style={{width: "60%", float: "left", borderRight: "1px solid black"}}>
                                <h5><b> Starting from</b></h5>
                                <h6 className="text-muted card-text">25 Crores</h6>
                                </div>
                                <div style={{width: "40%", float: "left"}}>
                                <h5>Contact</h5>
                                </div>
                                </div>
                            </div>
                            </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                            <div className="card border-0"><a href="#"><img class="card-img-top scale-on-hover" src="https://aanganpull.b-cdn.net/featured/featured%20(2).jpg" alt="Card Image"/></a>
                            <div className="card-body">
                                <h4><a href="https://www.aangan.pk"><b>Florence Galleria</b></a></h4>
                                <h6 className="text-muted card-text">Islamabad</h6>
                                <hr/>
                                <div style={{width: "100%", textAlign: "center"}}>
                                <div style={{width: "60%", float: "left", borderRight: "1px solid black"}}>
                                <h5><b> Starting from</b></h5>
                                <h6 className="text-muted card-text">25 Crores</h6>
                                </div>
                                <div style={{width: "40%", float: "left"}}>
                                <h5>Contact</h5>
                                </div>
                                </div>
                            </div>
                            </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                            <div className="card border-0"><a href="#"><img class="card-img-top scale-on-hover" src="https://aanganpull.b-cdn.net/featured/featured%20(3).jpg" alt="Card Image"/></a>
                            <div className="card-body">
                                <h4><a href="https://www.aangan.pk"><b>Florence Galleria</b></a></h4>
                                <h6 className="text-muted card-text">Islamabad</h6>
                                <hr/>
                                <div style={{width: "100%", textAlign: "center"}}>
                                <div style={{width: "60%", float: "left", borderRight: "1px solid black"}}>
                                <h5><b> Starting from</b></h5>
                                <h6 className="text-muted card-text">25 Crores</h6>
                                </div>
                                <div style={{width: "40%", float: "left"}}>
                                <h5>Contact</h5>
                                </div>
                                </div>
                            </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                </div>
                <div className='clear-end'></div>
                <div className="container">
                <ul className='plots' id='render-plots'>    
                </ul>
                <div className='clear-end'></div>          
                <div className='clear-end'></div>
                </div>
                <div className='ending'>
            </div>
        </div> 
        )
    };
};
export default withTracker(() => {
    Meteor.subscribe('homeLinks');
    Meteor.subscribe('plots');
    return {
        homeLink: HomeLinks.findOne({}),
        plots: Plots.find({}, { sort: { createdAt: -1 } }).fetch(),
    };
  })(Home);

