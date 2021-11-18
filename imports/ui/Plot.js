import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import classnames from 'classnames';

// Plot component - represents a single plot item
export default class Plot extends Component {


  handleRemove() {
    var remove = confirm("Sure you want to delete this?");
    if( remove == true ) {
      Meteor.call('plots.remove', this.props.plot._id);
    }
  }

  getPhone(id){
    Meteor.call('plot.companyPhone', id,
      (err, result) => {
        if (result){
          // console.log("Phone result:", result)
          this.refs.phone.replaceWith(result);
          return(result)
        }
      })
  }
     
  render() {
    const plotClassName = classnames({
      checked: this.props.plot.checked,
      private: this.props.plot.private,
    });

    console.log("plot", this.props.plot);
    if (!this.props.plot.phone){
      const phone = this.getPhone(this.props.plot.company)
    }
    return (
        <li className={plotClassName}>
        <div className='plot-box'>
          <hr></hr>
          <span className="text">
          {Meteor.userId()==this.props.plot.owner ?
          <div className='delete'>
            <button onClick={this.handleRemove.bind(this)} >x</button></div>  :""}
            <strong>
              <h2 className='plot-name'>
                <center>
                  <a href={"../IndividualPlot/"+this.props.plot._id}>{this.props.plot.city + " " + (this.props.plot.size | 0)} </a>
                </center>
              </h2>
            </strong> <br/>
            <div className='plot-basic-info' data-aos="fade-right">
              <b>Company:</b> <a className='plot-name' href={'../Company/'+this.props.plot.owner}>{this.props.plot.company}</a> <br/>
              {/* <div className='seats-sold'> <b>Seats booked:</b> <span className='plot-data'>{this.props.plot.seats}</span></div> <br/> */}
              <b>Size:</b> <span className='plot-data'> {this.props.plot.size}</span> Marlas <br/>
              <b>Cost:</b><span className='plot-data'>  Rs. {this.props.plot.price} </span> <br/>
              <b>City:</b><span className='plot-data'> {this.props.plot.city} </span> <br/>
              <b>Location:</b><span className='plot-data'> {this.props.plot.location} </span> <br/>
              {this.props.plot.phone? 
                <div>
                  <b>Phone:</b> <span className='plot-data'>{this.props.plot.phone} </span><br/>
                </div>
                :
                <div>
                  <b>Phone:</b> <span className='plot-data'><span ref='phone'></span> </span><br/>
                  {this.getPhone(this.props.plot.owner)}
                </div>
              }
              {this.props.plot.type=="House"? 
                <div>
                  <b>Construction Date:</b> <span className='plot-data'>{this.props.plot.constructionDate} </span><br/>
                </div>
                :
                ""
              }
              <div className='plot-destination'>
              <b>Type:</b> {this.props.plot.type} <br/>
              </div>
            </div>
            <div className='plot-img' data-aos="fade-left">
            <img className="img-fluid" src={this.props.plot.image} alt="image" width='100%' height='100%'></img></div><br/>
            {this.props.plot.multipleImages ? <img className="img-fluid" src={this.props.plot.multipleImages} alt="images" width='100%' height='100%'></img> : "" }<br/>
          </span>
        </div>
        
       </li>
    );
  }
} 