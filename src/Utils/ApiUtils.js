import request from 'superagent';

const URL = 'https://gainfulgarden.herokuapp.com';

// a lot of these functions could be made leaner by calling this function, which would reduce duplication
// async function makeRequest(url, param, token) {
//     const response = await request
//         .get(`${URL}${url}${param}`)
//         .set('Authorization', token);
//     return response.body;
// }

// export async function deleteThing(thingId, token) {
//     return await makeRequest('/api/thing/', thingId, token);
// }

export async function signUpUser(name, email, password) {
  const response = await request
    .post(`${URL}/auth/signup`)
    .send({ name, email, password });
  return response.body;
}

export async function loginUser(email, password) {
  const response = await request
    .post(`${URL}/auth/signin`)
    .send({ email, password });

  return response.body;
}

export async function getEdibles(token) {
  const response = await request
    .get(`${URL}/api/edible_search`)
    .set('Authorization', token);

  return response.body.data;
}

export async function getNameSearch(token, search_name) {
  const response = await request
    .get(`${URL}/api/name_search?name=${search_name}`)
    .set('Authorization', token);

  return response.body.data;
}

export async function getFilteredSearches(token, part, vegetable, light) {
  const response = await request
    .get(`${URL}/api/filtered_search?part=${part}&vegetable=${vegetable}&light=${light}`)
    .set('Authorization', token)

  return response.body.data;
}

export async function addToWishlist(token, main_species_id) {
  const response = await request
    .post(`${URL}/api/wishlist`)
    .send({ main_species_id })
    .set('Authorization', token);

  return response.body;
}

export async function getWishlist(token) {
  const response = await request
    .get(`${URL}/api/wishlist`)
    .set('Authorization', token)

  return response.body;
}

export async function deleteWishlistPlant(token, plantId) {
  const response = await request
    .delete(`${URL}/api/wishlist/${plantId}`)
    .set('Authorization', token);

  return response.body;
}

export async function addToGarden(token, main_species_id, plant_name) {
  const response = await request
    .post(`${URL}/api/my_garden`)
    .send({ main_species_id, plant_name })
    .set('Authorization', token)

  return response.body;
}

export async function getGarden(token) {
  const response = await request
    .get(`${URL}/api/my_garden`)
    .set('Authorization', token);

  return response.body;
}

export async function deleteGardenPlant(token, plantId) {
  const response = await request
    .delete(`${URL}/api/my_garden/${plantId}`)
    .set('Authorization', token);

  return response.body;
}

// Map through the every plant in the wishlist or garden and call the endpoint to get the needed info for each plant on the page
export async function getAllPlantInfo(plantArray, token) {
  const response = await Promise.all(plantArray.map(plant => getPlantDetails(token, plant.main_species_id)));

  return response;
};

export async function getPlantDetails(token, main_species_id) {
  const response = await request
    .get(`${URL}/api/plant_detail/${main_species_id}`)
    .set('Authorization', token);

  return response.body.data;
}

export async function addNotes(token, main_species_id, date, note) {
  const response = await request
    .post(`${URL}/api/notes`)
    .send({ main_species_id, date, note })
    .set('Authorization', token);

  return response.body;
}

export async function getNotes(token, id) {
  const response = await request
    .get(`${URL}/api/notes/${id}`)
    .set('Authorization', token);

  return response.body;
}
