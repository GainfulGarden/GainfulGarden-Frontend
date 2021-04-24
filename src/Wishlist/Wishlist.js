import React, { Component } from 'react';
import Spinner from '../Components/Spinner';
import {
  getWishlist,
  getGarden,
  getAllPlantInfo,
} from '../Utils/ApiUtils.js';
import '../plantList.css';

// Had to make changes from search page to populate plant info on the page since the API offered different information from different endpoints
export default class Wishlist extends Component {
  state = {
    userWishlist: [],
    userGarden: [],
    loading: false,
    detailsWishlist: []
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    const userWishlist = await getWishlist(this.props.user.token);
    const userGarden = await getGarden(this.props.user.token);
    // Wrote a new function in ApiUtils to get the data needed to display the plants on the page
    const detailsWishlist = await getAllPlantInfo(wishlist, this.props.user.token);

    this.setState({
      userGarden,
      userWishlist,
      detailsWishlist,
      loading: false,
    });
  };

  handleDetails = (plant) => {
    this.props.history.push(`/detail/${plant.main_species_id}`);
  };

  render() {
    return (
      <div className='wishlistPage'>
        <h1 className='center-title'>{this.props.user.name}'s Wishlist</h1>
        <div className='plantList'>
          {this.state.loading ? (
            <Spinner />
          ) : (
              // pull from the wishlist-specific info to display data on page
              this.state.detailsWishlist.map((plant, i) => (
                <div key={`${plant.common_name}-${i}`} className='plantCard'>
                  <img src={plant.image_url} className='plantImage' alt='plant' />
                  <p className='plantName'>{plant.common_name}</p>
                  <p className='cardText'>{plant.family_common_name}</p>
                  <p className='cardText'>{plant.scientific_name}</p>
                  <div className='card-buttons-detail-only'>
                    <button
                      className='detailBtn'
                      onClick={() => this.handleDetails(plant)}
                    >
                      Details
                  </button>
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    );
  }
}
