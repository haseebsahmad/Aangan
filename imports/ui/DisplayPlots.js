import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Plots } from '../api/plots.js';
import Plot from './Plot.js';
import { render } from 'react-dom';
import Account from './Account';
// import {HomeLinks} from '../api/home.js'



class App extends Component {

  city(){
    const locations = {
      'Punjab':{ $in:["Abdul Hakīm", "Ahmadabad", "Ahmadpur East", "Ahmadpur Siāl", "Ahmedpur Lumma", "Alīpur", "Alīpur Chatha", "Allahabad", "Arifwāla", "Attock", "Bahāwalnagar", "Bahāwalpur", "Basīrpur", "Bhakkar", "Bhalwāl", "Bhawana", "Bhera", "Bhopalwala", "Būrewāla", "Chak Jhumra", "Chakwāl", "Chaubara", "Chawinda", "Chenāb Nagar (Rabwāh)", "Chīchāwatni", "Chinīot", "Chishtiān", "Choa Saidanshah", "Chowk Āzam", "Chowk Sarwar Shahid", "Chūniān", "Dajal", "Daryā Khān", "Daska", "Dāūd Khel", "Daultala", "Dera Din Panah", "Dera Ghāzi Khān", "Khanpur", "Dhanote", "Dijkot", "Dīna", "Dinga", "Dīpālpur", "Dullewala", "Dūnga Būnga", "Dunyāpur", "Eminabad", "Faisalābād", "Faqīrwāli", "Farooqa", "Fārūqābād", "Fatehjang", "Fatehpur", "Fāzilpur", "Fīrozwāla", "Fort Abbās", "Garh Mahārāja", "Ghakhar", "Gogera", "Gojra", "Gūjar Khān", "Gujrānwāla", "Gujrānwāla Cantonment", "Gujrāt", "Hadāli", "Hāfizābād", "Hārūnābād", "Hasan Abdāl", "Hāsilpur", "Haveli Lakha", "Hazro", "Hujra Shāh Muqīm", "Isa Khel", "Jalālpur Bhattiān", "Jalālpur Jattan", "Jalālpur Pīrwāla", "Jāmke Chīma", "Jāmpur", "Jand", "Jandanwala", "Jarānwāla", "Jatoi", "Jauharābād", "Jehānian", "Jhang", "Jhawāriān", "Jhelum", "Kabīrwāla", "Kahror Pakka", "Kahuta", "Kalabagh", "Kallar Kahar", "Kallar Sayaddan", "Kalūr Kot", "Kamālia", "Kamar Mashani", "Kamīr", "Kāmoki", "Kāmra Cantonment", "Kanganpur", "Karampur", "Karor Lal Esan", "Kasūr", "Khairpur Tamewāli", "Khānewāl", "Khangarh", "Khānpur", "Khānqāh Dogrān", "Khāriān", "Khewra", "Khudiān", "Khuriānwāla", "Khushāb", "Kot Abdul Malik", "Kot Addu", "Kot Chutta", "Kotli Loharan", "Kotli Sattian", "Kot Mithan", "Kot Mūmin", "Kot Rādha Kishan", "Kot Samāba", "Kundiān", "Kunjāh", "Lāhore", "Lāla Mūsa", "Lāliān", "Layyah", "Liāquatābād", "Liāquatpur", "Lodhrān", "Ludhewāla Warrāich", "Mailsi", "Makhdoom Pur Pahuran", "Malakwāl", "Māmu Kānjan", "Mānānwāla Jodh Singh", "Mandi Bahāuddīn", "Miān Channū", "Miani", "Miānwāli", "Minchinābād", "Mitha Tiwāna", "Multān", "Murīdke", "Murree", "Mustafābād", "Muzaffargarh", "Nankāna Sahib", "Nārang", "Nārowāl", "Noorpur Thal", "Nowshera Virkān", "Okāra", "Okāra Cantonment", "Pākpattan", "Pasrūr", "Pattoki", "Phālia", "Phularwan", "Phūlnagar", "Pind Dadan Khan", "Pindi Bhattiān", "Pindi Gheb", "Pīr Mahal", "Qadirpur Ran", "Qila Dīdār Singh", "Quaidabad", "Rahīmyār Khān", "Rāja Jang", "Rājanpur", "Rāwalpindi", "Renāla Khurd", "Sādiqābād", "Safdarābād", "Sāhīwal", "Samasata", "Sambriāl", "Samundri", "Sanawan", "Sāngla Hill", "Sarāi Ālamgīr", "Sargodha", "Shadiwal", "Shāhkot", "Shahpur Sadar", "Shakargarh", "Sharqpur", "Shehr Sultan", "Sheikhūpura", "Shorkot", "Shorkot Cantonment", "Shujāābād", "Siālkot", "Sillānwāli", "Sohawa", "Sukheke", "Talagang", "Tāndliānwāla", "Taunsa", "Taxila", "Toba Tek Singh", "Trinda Sawai Khan", "Tulamba", "Uch", "Vehāri", "Wāh Cantonment", "Warburton", "Wazīrābād", "Yazmān", "Zafarwal", "Zāhir Pīr"]},
      'Sindh': { $in:["Ahmedpur", "Arija", "Bādāh", "Badīn", "Bandhi", "Behram", "Bhan", "Bhiria Road", "Bhitshah", "Chachro", "Choondiko", "Chore Old", "Dādu", "Daharki", "Daur", "Dhoronaro", "Digri", "Dokri", "Faqirabad", "Gambat", "Gharo", "Ghauspur", "Ghotki", "Golarchi", "Guddu", "Hāla", "Halani", "Hingorja", "Husri", "Hyderābād", "Jacobābād", "Jam Nawaz Ali", "Jamshoro", "Jatia", "Jhol", "Jhudo", "Johi", "Kambar Ali Khān", "Kandhkot", "Kandiāro", "Karāchi", "Kario Ghanwer", "Kashmor", "Kazi Ahmed", "Khaīrpur", "Khairpur Nathan Shāh", "Khangarh", "Khipro", "Khoski", "Khuhra", "Kot Diji", "Kot Ghulam Muhammad", "Kotri", "Kunri", "Lakhi", "Lārkāna", "Madeji", "Makli", "Matiari", "Mātli", "Mehar", "Mehrābpur", "Mirokhan", "Mīrpur Khās", "Mīrpur Māthelo", "Mithi", "Mithiani", "Moro", "Nasīrābād", "Nasirpur", "Naudero", "Naukot", "Naushahro Feroze", "Nawābshāh", "New Saeedabad", "Pacca Chang", "Padidan", "Pano Āqil", "Pāno Āqil Cantonment", "Pīrjo Goth", "Piryaloi", "Qubo Saeed Khan", "Radhan", "Rajo Khanani", "Ranipur", "Ratodero", "Rohri", "Sakrand", "Salehpat", "Sānghar", "Sehwān", "Sethārja", "Shāhdādkot", "Shāhdādpur", "Shahpur Chakar", "Shikārpur", "Sinjhoro", "Sīta Road", "Sobhodero", "Sujāwal", "Sukkur", "Talhar", "Tando Ādam", "Tando Allāhyār", "Tando Ghulam Ali", "Tando Ghulam Hyder", "Tando Jām", "Tando Jan Muhammad", "Tando Mir Ali", "Tando Muhammad Khān", "Thari Mirwah", "Tharushah", "Thatta", "Therhi", "Thul", "Ubāuro", "Umerkot", "Warah"]},
      'KPK': { $in:["Abbottābad", "Akora Khattak", "Amāngarh", "Bannu", "Barikot", "Bat Khela", "Behrain", "Chārsadda", "Chitrāl", "Dera Ismāil Khān", "Dīr", "Doaba", "Hangu", "Harīpur", "Havelian Cantonment", "Jehāngīra", "Kabal", "Karak", "Khalābat", "Khwazakhela", "Kohāt", "Kulachi", "Lachi", "Lakki Marwat", "Mānsehra", "Mardān", "Matta", "Mingawara", "Nawan Killi", "Nawanshehr", "Nowshera", "Pabbi", "Paharpur", "Paroa", "Peshāwar", "Risālpur Cantonment", "Serai Naurang", "Shabqadar", "Swābi", "Swat", "Takht Bhāi", "Tangi", "Tānk", "Thall", "Timargara", "Topi", "Tordher", "Utmānzai", "Zaida" ]},
      'Balochistan':{ $in: ["Awaran", "Bela", "Buleda", "Chaman", "Chitkān", "Dera Allāh Yār", "Dera Bugti", "Dera Murād Jamāli", "Gwādar", "Hub", "Huramzai", "Kalāt", "Khanozai", "Khārān", "Khuzdār", "Killa Abdullah", "Killa Saifullah", "Lorālāi", "Mastung", "Muslim Bagh", "Nal", "Nūshki", "Pasni", "Pishīn", "Quetta", "Saranan", "Sibi", "Sui", "Surab", "Tasp", "Tump", "Turbat", "Usta Muhammad", "Uthal", "Wadh", "Washuk", "Winder", "Zehri", "Zhob"]},
      'FATA':{ $in: ["Jamrūd", "Landi Kotal", "Mīran Shāh", "Pārāchinār", "Sadda"]}
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


  render() {

    var slider = document.getElementById("myRange");
    var output = document.getElementById("demo");
    if (slider){
      output.innerHTML = slider.value;
      slider.oninput = function() {
        output.innerHTML = this.value;
      }
    }

    
    render(<div>
      <Account /><br/>
      </div>,
      document.getElementById('signin')
      );
    return (
      <div className="container">
          
        <header>
        <center>
          <div className=' translate'>
          <h1>Plots</h1>
          <div className='search-form-div'>
          <form className='search-form' onSubmit={this.handleSubmit.bind(this)}>
          <div className="slidecontainer search-fields">
          Price Range:
            <input type="range" min="100000" max="100000000" defaultValue='100000' ref='priceRange' className="slider" id="myRange"/>
            <p>Rs. <span id="demo"></span></p>
          </div>
          <div className="form-group search-fields">
            City: <br/>
            <input type='text' placeholder='Location or Province' ref='search' list="cities"/>
             <datalist id="cities">
                <option>  Punjab  	</option>
                <option>	KPK 	</option>
                <option>	Sindh 	</option>
                <option>	Balochistan	</option>
                <option>	FATA	</option>
                <option>  Abbottābād  	</option>
                <option>	Alīābad 	</option>
                <option>	Alpūrai 	</option>
                <option>	Altit	</option>
                <option>	Askole	</option>
                <option>	Astore	</option>
                <option>	Athmuqam	    </option>
                <option>	Attock City </option>
                <option>	Awārān  	</option>
                <option>	Ayubia  	</option>
                <option>	Babusar 	</option>
                <option>	Badīn   	</option>
                <option>	Bāgh    	</option>
                <option>	Bahāwalnagar    </option>
                <option>	Bahāwalpur  </option>
                <option>	Balghar	</option>
                <option>	Bannu   	</option>
                <option>	Barah Valley	</option>
                <option>	Bardār  	</option>
                <option>	Bārkhān 	</option>
                <option>	Batgrām 	</option>
                <option>	Bhakkar 	</option>
                <option>	Bunji	</option>
                <option>	Chakwāl 	</option>
                <option>	Chalunka	</option>
                <option>	Chaman  	</option>
                <option>	Chārsadda   </option>
                <option>	Chilas	</option>
                <option>	Chilās  	</option>
                <option>	Chiniot 	</option>
                <option>	Chitrāl 	</option>
                <option>	Chitral.	</option>
                <option>	Dādu    	</option>
                <option>	Daggar  	</option>
                <option>	Dālbandīn   </option>
                <option>	Danyor	</option>
                <option>	Dasu    	</option>
                <option>	Dera All	āhyār   </option>
                <option>	Dera Bugti  </option>
                <option>	Dera Ghāzi Khān </option>
                <option>	Dera Ismāīl Khān    </option>
                <option>	Dera Murād Jamāli   </option>
                <option>	Eidgāh  	</option>
                <option>	Fairy Meadows	</option>
                <option>	Faisalābād  </option>
                <option>	Gākuch  	</option>
                <option>	Gandāvā 	</option>
                <option>	Ghotki  	</option>
                <option>	Gilgit  	</option>
                <option>	Gorikot	</option>
                <option>	Gujrānwāla  </option>
                <option>	Gujrāt  	</option>
                <option>	Gulmit	</option>
                <option>	Gwādar  	</option>
                <option>	Hāfizābād   </option>
                <option>	Haji Gham	</option>
                <option>	Haldi	</option>
                <option>	Hangu   	</option>
                <option>	Harīpur 	</option>
                <option>	Hassanabad Chorbat	</option>
                <option>	Hunza	</option>
                <option>	Hushe	</option>
                <option>	Hussainabad	</option>
                <option>	Hyderābād City  </option>
                <option>	Islamabad   </option>
                <option>	Jacobābād   </option>
                <option>	Jaglot	</option>
                <option>	Jalal Abad	</option>
                <option>	Jāmshoro	    </option>
                <option>	Jhang City  </option>
                <option>	Jhang Sadr  </option>
                <option>	Jhelum  	</option>
                <option>	Jutal	</option>
                <option>	Kalam	</option>
                <option>	Kalāt   	</option>
                <option>	Kandhkot	    </option>
                <option>	Karachi 	</option>
                <option>	Karak   	</option>
                <option>	Karimabad	</option>
                <option>	Kashmir 	</option>
                <option>	Kasūr   	</option>
                <option>	Keris Valley	</option>
                <option>	Khairpur	    </option>
                <option>	Khānewāl	    </option>
                <option>	Khaplu	</option>
                <option>	Khārān  	</option>
                <option>	Kharfaq	</option>
                <option>	Khushāb 	</option>
                <option>	Khuzdār 	</option>
                <option>	Kohāt   	</option>
                <option>	Kohlu   	</option>
                <option>	Kotli   	</option>
                <option>	Kumrat	</option>
                <option>	Kumrat  	</option>
                <option>	Kundiān 	</option>
                <option>	Lahore  	</option>
                <option>	Lakki Marwat    </option>
                <option>	Lārkāna 	</option>
                <option>	Leiah   	</option>
                <option>	Lodhrān 	</option>
                <option>	Loralai 	</option>
                <option>	Maiun	</option>
                <option>	Malakand	    </option>
                <option>	Mandi Bahāuddīn </option>
                <option>	Mānsehra	    </option>
                <option>	Mardan  	</option>
                <option>	Masīwāla	    </option>
                <option>	Mastung 	</option>
                <option>	Matiāri 	</option>
                <option>	Mehra   	</option>
                <option>	Miānwāli	    </option>
                <option>	Minimarg	</option>
                <option>	Mīrpur Khās </option>
                <option>	Misgar	</option>
                <option>	Multān  	</option>
                <option>	Murree  	</option>
                <option>	Mūsa Khel Bāzār </option>
                <option>	Muzaffar	garh    </option>
                <option>	Nagar Khas	</option>
                <option>	Naltar Valley	</option>
                <option>	Nankāna 	Sāhib   </option>
                <option>	Naran Kaghan.	</option>
                <option>	Nārowāl 	</option>
                <option>	Nasirabad	</option>
                <option>	Nathia Gali </option>
                <option>	Naushahro Fīroz </option>
                <option>	Nawābshāh   </option>
                <option>	Neelam	</option>
                <option>	Neelam  	</option>
                <option>	New Mīrpur  </option>
                <option>	Nowshera	    </option>
                <option>	Okāra   	</option>
                <option>	Oshikhandass	</option>
                <option>	Pākpattan   </option>
                <option>	Palas	</option>
                <option>	Panjgūr 	</option>
                <option>	Parachinār  </option>
                <option>	Pasu	</option>
                <option>	Peshāwar	    </option>
                <option>	Pishin  	</option>
                <option>	Qila Abdullāh   </option>
                <option>	Qila Saifullāh  </option>
                <option>	Quetta  	</option>
                <option>	Rahīmyār	 Khān   </option>
                <option>	Rājanpur	    </option>
                <option>	Rāwala Kot  </option>
                <option>	Rāwalpindi  </option>
                <option>	Rawlakot	    </option>
                <option>	Sādiqābād   </option>
                <option>	Sāhīwāl 	</option>
                <option>	Saidu Sharif    </option>
                <option>	Sānghar 	</option>
                <option>	Sargodha	    </option>
                <option>	Serai   	</option>
                <option>	Shahdād Kot </option>
                <option>	Sheikhupura </option>
                <option>	Shigar	</option>
                <option>	Shikārpur   </option>
                <option>	Shimshal	</option>
                <option>	Siālkot City    </option>
                <option>	Sibi    </option>
                <option>	Skardu	</option>
                <option>	Sost	</option>
                <option>	Sukkur  	</option>
                <option>	Sultan Abad	</option>
                <option>	Swābi   	</option>
                <option>  Swat    </option>
                <option>	Taghafari	</option>
                <option>	Tando Allāhyār  </option>
                <option>	Tando Muhammad Khān </option>
                <option>	Tānk    	</option>
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
                <option>	Vihāri  	</option>
                <option>	Yugo	</option>
                <option>	Zhob    	</option>
                <option>	Ziārat  	</option>
              </datalist>
            </div>             
            <div className='search-fields'>
            Size: <br/>
              <input type="number" min="0" ref="sizeMin" placeholder='Minimum size'/>
              <input type="number" min="0" ref="sizeMax" placeholder='Maximum size'/>
              <br/><br/>
              <select className="form-control" ref='unit' id="sel1"> <br/> <br/> <br/>
                <option value='0.003673'>  Square Feet  	</option>
                <option value='0.033057'>  Square Yard  	</option>
                <option value='1'>	Marla 	</option>
                <option value='20'>	Kanal 	</option>
                <option value='160'>	Acre 	</option>
                <option value='4000'>	Marabba 	</option>
              </select>
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            

          <div className='search-fields'>
            Type: <br/>
              <select className="form-control" ref='type' id="sel1">
                <option>  House  	</option>
                <option>	Plot 	</option>
              </select>
          </div>
          <div className='search-fields'>
            Purpose: <br/>
              <select className="form-control" ref='purpose' id="sel1">
                <option value='Sell'>  Purchase  	</option>
                <option value='Rent'>	Rent 	</option>
              </select>
          </div>
          <div className='search-fields'>
          Construction Date: <br/>
            <input
              type="date"
              ref="constructionDate"
            />
          </div>
          <div className='search-fields'><br/>
            <button type='submit'>Search</button>
          </div>
      </form>
      </div>
      </div>
      <div className='clear-end'></div>
    </center>
    </header>
    <ul className='plots' id='render-plots'>
      {this.renderPlots(this.props.plots)}
    </ul>
    <br></br>
    <div className='clear-end'></div>
  </div>
    );
    }
  }

  export default withTracker(() => {
    Meteor.subscribe('plots');
    // Meteor.subscribe('userPlotBookings');
    // Meteor.subscribe('homeLinks');
    return {
        // homeLink: HomeLinks.findOne({}),
        plots: Plots.find({}, { sort: { createdAt: -1 } }).fetch(),
        currentUser: Meteor.user(),   
        // userBookings: UserPlotBookings.find({}).fetch()
    };
  })(App);