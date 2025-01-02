import userDocsRoutes from "../routes/user.doc.js";
import envConfig from "../config/envConfig.js";
//  create the object
const swaggerDocumentation = {
  openapi: '3.0.0',
  info:{
    title:"blog api documentation",
    description:"This is blog api documentation",
    version:"1.0.0"
  },
  servers:[
    {
      url:`${envConfig.client_url}/api/v1`,
      description:"local server"
    },
    {
      url:`${envConfig.production_url}/api/v1`,
      description:"production server"
    },
  ],
  // create the tags
  tags:[
    {
      name:"User",
      description:"User related api"
    },
    {
      name:"Blog",
      description:"Blog related api"
    },
    {
      name:"Comment",
      description:"Comment related api"
    }
  ],
  //create the paths 
  paths: {
    ...userDocsRoutes,
  }
}


export default swaggerDocumentation;