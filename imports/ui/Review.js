import React, { Component } from 'react';
import classnames from 'classnames';

export default class Plot extends Component {

  render() {
    const reviewClassName = classnames({
        review: this.props.review
    });
    return (
        <div>
          {this.props.review.remarks ?
          <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
            <div className="testimonial">
                <div className='reviews'>
              {/* <div className="reviewer-dp"> */}
                <img src={this.props.review.reviewer_dp} alt="Image placeholder" width='70px' height='70px' className="rounded-circle reviewer-dp"/>
                {/* </div> */}
                {this.props.review.rating == '1' ? <img width='5%' height='5%' id='star'src='/img/star.png' ></img> : ""}
                {this.props.review.rating == '2' ? <div>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    </div> : ""}
                {this.props.review.rating == '3' ? <div>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    </div> : ""}
                {this.props.review.rating == '4' ? <div>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    </div> : ""}
                {this.props.review.rating == '5' ? <div>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    <img width='5%' height='5%' id='star'src='/img/star.png' ></img>
                    </div> : ""}
                <div className='review-remarks'>
                    <p>&ldquo;{this.props.review.remarks}&rdquo;</p>
                </div>
              <p><em>&mdash; {this.props.review.username}</em></p>
              </div>
            </div>
          </div>
          :""}
       </div>
    );
  }
}
