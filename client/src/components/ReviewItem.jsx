/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable class-methods-use-this */
// This component is responsible for displaying each individual review including the body,
// the user's name, the user's photo, the date they stayed, and the "flag" option.
import React from 'react';
import Styles from '../styles/ReviewItem.css';

class ReviewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      extended: false
    };
    this.expand = this.expand.bind(this);
  }

  expand(event) {
    event.preventDefault();
    this.setState({
      extended: true
    });
  }

  render() {
    const { review } = this.props;
    const { id } = this.props;
    const { extended } = this.state;

    return (
      <div className="reviewContainer" id={id}>
        <div id="flag">&#9872;</div>
        <div className="userInfo">
          <img src={review.useravatar} alt="user avatar" className="avatar" />
          <div className="userText">
            <span id="username">{review.name}</span>
            <span id="dateStayed">{review.dateStayed}</span>
          </div>
        </div>
        <div>
            {extended === false
            ? <p>{review.body.substring(0, 250)}... <a href="#" onClick={this.expand}>Read more</a></p>
            : <p>{review.body}</p>}
        </div>
      </div>
    );
  }
}

export default ReviewItem;
