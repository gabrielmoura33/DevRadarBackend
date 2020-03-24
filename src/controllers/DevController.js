const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require("../utils/parseStringAsArray")

//index, show, store, update, destroy
module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs)
  },
  async store (request, response) {

    const {github_username, techs, latitude, longitude } = request.body;    
    const api_response = await axios.get(`https://api.github.com/users/${github_username}`)
    .catch(error => {
        return response.status(404).json(error);
    });
    if(api_response.data){
      let dev = await Dev.findOne({ github_username })
      if(!dev){
        const api_response = await axios.get(`https://api.github.com/users/${github_username}`);
      
        const { name = login, avatar_url, bio} = api_response.data;
      
        const techsArray = parseStringAsArray(techs);
      
        const location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        }
      
        dev = await Dev.create({
          github_username,
          name,
          avatar_url,
          bio,
          techs: techsArray,
          location,
        })
      }
      return response.json(dev);
    }
  }
}