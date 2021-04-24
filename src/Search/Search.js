import React, { Component } from 'react';
import Spinner from '../Components/Spinner';
import {
  getEdibles,
  getFilteredSearches,
  getNameSearch,
  getWishlist,
  getGarden,
  addToGarden,
  addToWishlist,
} from '../Utils/ApiUtils.js';
import '../plantList.css';

export default class Search extends Component {
  state = {
    userWishlist: [],
    userGarden: [],
    searchResults: [],
    searchPlantByName: '',
    lightFilter: '',
    ediblePartFilter: '',
    veggieFilter: '',
    loading: false,
  };

  componentDidMount = async () => {
    this.setState({ loading: true });
    const edibleArray = await getEdibles(this.props.user.token);

    const wishlist = await getWishlist(this.props.user.token);

    const garden = await getGarden(this.props.user.token);
    this.setState({
      userGarden: garden,
      userWishlist: wishlist,
      searchResults: edibleArray,
      loading: false,
    });
  };

  handleSearchNameChange = (e) => {
    this.setState({ searchPlantByName: e.target.value });
  };
  handleLightChange = (e) => {
    this.setState({ lightFilter: e.target.value, searchPlantByName: '' });
  };
  handleEdiblePartChange = (e) => {
    this.setState({ ediblePartFilter: e.target.value, searchPlantByName: '' });
  };
  handleVeggieChange = (e) => {
    this.setState({ veggieFilter: e.target.value, searchPlantByName: '' });
  };

  handleSubmitNameChange = async (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const searchNameResults = await getNameSearch(
      this.props.user.token,
      this.state.searchPlantByName
    );

    this.setState({ searchResults: searchNameResults, loading: false });
  };

  handleFilterSubmit = async (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const filteredPlantsResults = await getFilteredSearches(
      this.props.user.token,
      this.state.ediblePartFilter,
      this.state.veggieFilter,
      this.state.lightFilter
    );

    this.setState({ searchResults: filteredPlantsResults, loading: false });
  };

  handleAddToGarden = async (plant) => {
    await addToGarden(this.props.user.token, plant.id, plant.common_name);

    const garden = await getGarden(this.props.user.token);
    this.setState({ userGarden: garden });
  };

  handleAddToWishlist = async (plant) => {
    await addToWishlist(this.props.user.token, plant.id);

    const wishlist = await getWishlist(this.props.user.token);
    this.setState({ userWishlist: wishlist });
  };

  handleDetails = (plant) => {
    this.props.history.push(`/detail/${plant.id}`);
  };

    // might be nice to abstract this into a third place, since you have a very similar function in Details.js
  isInWishlist = (plant) => {
    const inWishlist = this.state.userWishlist.find(
      (wish) => wish.main_species_id === plant.id
    );

    return inWishlist;
  };

  // same here--might be nice to abstract this into a third place, since you have a very similar function in Details.js
  isInGarden = (plant) => {
    const inGarden = this.state.userGarden.find(
      (myPlant) => myPlant.main_species_id === plant.id
    );

    return inGarden;
  };

  render() {
    return (
      <div className='searchPage'>
        <div className='searchSide'>
          <label>
            Search By Name
            <input className='nameSearch'
              value={this.state.searchPlantByName}
              onChange={this.handleSearchNameChange}
            />{' '}
            <br />
            <button onClick={this.handleSubmitNameChange}>Search!</button>{' '}
            <br />
            <br />
          </label>
          <label>
            Check To See Only Vegetables
            <input
              type='checkbox'
              value='true'
              id='vegBox'
              onChange={this.handleVeggieChange}
            />
          </label>
          <br />
          <br />
          <label>
            Search by Edible Part<br />
            <select
              value={this.state.ediblePartFilter}
              onChange={this.handleEdiblePartChange}
            >
              <option value=''>Select</option>
              <option value='roots'>Roots</option>
              <option value='leaves'>Leaves</option>
              <option value='flowers'>Flowers/Fruit</option>
            </select>
          </label>
          <br />
          <br />
          <label>
            Search by Light Level<br />
            <select
              value={this.state.lightFilter}
              onChange={this.handleLightChange}
            >
              <option value=''>Select</option>
              <option value='0,7'>Partial Shade</option>
              <option value='7,8'>Partial Sun</option>
              <option value='8,9'>Moderate to Full Sun</option>
              <option value='9,10'>Full Sun</option>
            </select>
          </label>
          <br />
          <button onClick={this.handleFilterSubmit}>Search Results</button>
        </div>
        <div className='plantList'>
          {this.state.loading ? (
            <Spinner />
          ) : (
              this.state.searchResults.map((plant, i) => (
                <div key={`${plant.common_name}-${i}`} className='plantCard'>
                  {plant.image_url ? <img src={plant.image_url} className='plantImage' alt='plant' /> : <img src='/noImage.png' className='plantImage' alt='plant' />}
                  <p className='plantName'>{plant.common_name}</p>
                  <p className='cardText'>{plant.family_common_name}</p>
                  <p className='cardText'>{plant.scientific_name}</p>
                  <div className='card-buttons'>
                    {this.isInGarden(plant) ? (
                      <img
                        className='btn-no'
                        src='/garden_icon_Y.png'
                        alt='garden'
                      />
                    ) : (
                        <img
                          className='btn'
                          onClick={() => this.handleAddToGarden(plant)}
                          src='/garden_icon_N.png'
                          alt='garden'
                        />
                      )}
                    {this.isInWishlist(plant) ? (
                      <img
                        className='btn-no'
                        disabled
                        src='/wishlist_icon_Y.png'
                        alt='wishlist'
                      />
                    ) : (
                        <img
                          className='btn'
                          onClick={() => this.handleAddToWishlist(plant)}
                          src='/wishlist_icon_N.png'
                          alt='wishlist'
                        />
                      )}
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
