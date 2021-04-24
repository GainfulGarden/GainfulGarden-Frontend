import React, { Component } from 'react';
import { getPlantDetails, getWishlist, getGarden, addToGarden, addToWishlist, deleteWishlistPlant, deleteGardenPlant } from '../Utils/ApiUtils';
import Spinner from '../Components/Spinner';
import Notes from './Notes';
import './details.css';

export default class Detail extends Component {
  state = {
    userWishlist: [],
    userGarden: [],
    userNotes: [],
    plantId: '',
    name: '',
    familyName: '',
    scientificName: '',
    image: '',
    vegetable: false,
    height: '',
    light: '',
    ediblePart: '',
    soilTexture: '',
    minPrecipitation: '',
    maxPrecipitation: '',
    leafImage: '',
    flowerImage: '',
    fruitImage: '',
    loading: false,
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    const wishlist = await getWishlist(this.props.user.token);

    const garden = await getGarden(this.props.user.token);
    this.setState({

      userGarden: garden,
      userWishlist: wishlist,
    });

    const plantDetails = await getPlantDetails(
      this.props.user.token,
      this.props.match.params.id
    );
    await this.setState({
      // might be nice to match the keys in your getPlantDetails function (or some separate munge util) to keep your components a bit cleaner
      loading: false,
      plantId: plantDetails.main_species_id,
      name: plantDetails.common_name,
      familyName: plantDetails.family_common_name,
      scientificName: plantDetails.scientific_name,
      image: plantDetails.image_url,
      vegetable: plantDetails.vegetable,
      height: plantDetails.main_species.specifications.average_height.cm,
      light: plantDetails.main_species.growth.light,
      ediblePart: plantDetails.main_species.edible_part,
      soilTexture: plantDetails.main_species.growth.soil_texture,
      minPrecipitation:
        plantDetails.main_species.growth.minimum_precipitation.mm,
      maxPrecipitation:
        plantDetails.main_species.growth.maximum_precipitation.mm,
      leafImage: plantDetails.main_species.images.leaf
        ? plantDetails.main_species.images.leaf[0].image_url
        : 'null',
      flowerImage: plantDetails.main_species.images.flower
        ? plantDetails.main_species.images.flower[0].image_url
        : 'null',
      fruitImage: plantDetails.main_species.images.fruit
        ? plantDetails.main_species.images.fruit[0].image_url
        : 'null',
    });
  };

  findLightLevel = (light) => {
    if (light <= 7) {
      return 'Partial Shade';
    } else if (light === 8) {
      return 'Partial Sun';
    } else if (light === 9) {
      return 'Moderate to Full Sun';
    } else return 'Full Sun';
  };

  findSoilTexture = (soil) => {
    if (soil >= 1 && soil <= 3) {
      return 'coarse mixture with pumice and loamy sand';
    } else if (soil >= 4 && soil <= 5) {
      return 'gritty mixture of sandy loam';
    } else if (soil >= 6 && soil <= 7) {
      return 'smooth like flour mixed loam and silt';
    } else return 'gritty mixture of clay and loam';
  };

  isInWishlist = (plant) => {
    const inWishlist = this.state.userWishlist.find(
      (wish) => wish.main_species_id === plant
    );
    return inWishlist;
  };

  isInGarden = (plant) => {
    const inGarden = this.state.userGarden.find(
      (myPlant) => myPlant.main_species_id === plant
    );
    return inGarden;
  };

  handleAddToGarden = async () => {
    await addToGarden(this.props.user.token, this.state.plantId, this.state.name);

    const garden = await getGarden(this.props.user.token);
    this.setState({ userGarden: garden });
  };

  handleDeleteFromGarden = async (id) => {
    await deleteGardenPlant(this.props.user.token, id);
    const garden = await getGarden(this.props.user.token);
    this.setState({ userGarden: garden });
  };

  handleAddToWishlist = async () => {
    await addToWishlist(this.props.user.token, this.state.plantId);

    const wishlist = await getWishlist(this.props.user.token);
    this.setState({ userWishlist: wishlist });
  };

  handleDeleteFromWishlist = async (id) => {
    await deleteWishlistPlant(this.props.user.token, id);
    const wishlist = await getWishlist(this.props.user.token);
    this.setState({ userWishlist: wishlist });
  };

  // this render method should probably be broken into a few separate components for readability and maintainability

  render() {
    return (
      <div >
        <h1 className='detailHeader'>Plant Details</h1>
        <div>
          {this.state.loading ? (
            <Spinner />
          ) : (
            <div className='main'>
              <div className='mainDetails'>
                <h2>{this.state.name}</h2>
                <p>{this.state.familyName}</p>
                <p>{this.state.scientificName}</p>
                <img className='mainImage' src={this.state.image} alt='plant' />
                {this.state.vegetable ? <p>This is a Vegetable</p> : ''}
                {this.state.height ? (
                  <p>Average Height: {this.state.height} centimeters</p>
                ) : ('')}
                {this.state.light ? (
                  <p>Light Level: {this.findLightLevel(this.state.light)}</p>
                ) : ('')}
                {this.state.ediblePart ? (
                  <p>You can eat the {this.state.ediblePart}</p>
                ) : ('')}
                <p>
                  Soil Texture: {this.findSoilTexture(this.state.soilTexture)}
                </p>
                {this.state.minPrecipitation ? (
                  <p>
                    Minimum Precipitation: {Math.round(this.state.minPrecipitation / 52)} mm per week
                  </p>) : ('')}
                {this.state.maxPrecipitation ? (
                  <p>
                    Maximum Precipitation: {Math.round(this.state.maxPrecipitation / 52)} mm per
                    week
                  </p>) : ('')}
                <h4>Additional Images: </h4>
                <div className='detailImages'>
                  {this.state.leafImage === 'null' ? (
                    <img
                      className='plantImage'
                      src={'/noImage.png'}
                      alt='leaf'
                    />) : (<img
                      className='plantImage'
                      src={this.state.leafImage}
                      alt='leaf'
                    />)}
                  {this.state.flowerImage === 'null' ? (
                    <img
                      className='plantImage'
                      src={'/noImage.png'}
                      alt='flower'
                    />) : (<img
                      className='plantImage'
                      src={this.state.flowerImage}
                      alt='flower'
                    />)}
                  {this.state.fruitImage === 'null' ? (
                    <img
                      className='plantImage'
                      src={'/noImage.png'}
                      alt='fruit'
                    />) : (<img
                      className='plantImage'
                      src={this.state.fruitImage}
                      alt='fruit'
                    />)}
                </div>
              </div>
              <div className='notesSection'>
                {this.isInWishlist(this.state.plantId) ? (
                  <div><h4>You have this plant in your Wishlist!</h4>
                    Click the icon to remove it<br />
                    <img
                      className='btn'
                      onClick={() => this.handleDeleteFromWishlist(this.isInWishlist(this.state.plantId).id)}
                      src='/wishlist_icon_Y.png'
                      alt='wishlist'
                    /><br />
                  </div>
                ) : (
                  <div>Want to add this plant to your wishlist? <br />Just click the icon!
                    <br />
                    <img
                      className='btn'
                      onClick={this.handleAddToWishlist}
                      src='/wishlist_icon_N.png'
                      alt='wishlist'
                    /><br />
                  </div>
                )}
                {this.isInGarden(this.state.plantId) ? (
                  <div> <h4>This plant is in your garden!</h4>
                  Click the icon to remove it<br />
                    <img
                      className='btn'
                      onClick={() => this.handleDeleteFromGarden(this.isInGarden(this.state.plantId).id)}
                      src='/garden_icon_Y.png'
                      alt='garden'
                    /><br />
                    {this.state.plantId && (
                      <Notes token={this.props.user.token} plantId={this.state.plantId} />
                    )}
                  </div>
                ) : (
                  <div>
                    Want to add this plant to your garden? <br />Just click the icon!
                    <br />
                    <img
                      className='btn'
                      onClick={this.handleAddToGarden}
                      src='/garden_icon_N.png'
                      alt='garden'
                    /><br />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

// {plant.image_url ? <img src={plant.image_url} className='plantImage' alt='plant' /> : <img src='/noImage.png' className='plantImage' alt='plant' />}