import userDocsRoutes from "../routes/user.doc.js";
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
      url:`http://localhost:8080/api/v1/`,
      description:"local server"
    },
    {
      url:"http://localhost:8080",
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