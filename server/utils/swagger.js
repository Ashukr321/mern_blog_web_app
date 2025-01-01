
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import envConfig from "../config/envConfig.js";
// create the swagger option 
const swaggerOptions = {
  definition :{
    openapi :'3.0.0',
    info :{
      title :'Blog API',
      version :'1.0.0',
      description:"This is a simple Blog CRUD API application made with Express and documented with Swagger ",
    },
    servers:[
      {
        url:envConfig.client_url
      }
    ],
   },
  apis :['./routes/*.js']
  
}

const swaggerDoc = swaggerJSDoc(swaggerOptions);

const setupSwagger  = (app)=>{
  app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDoc));
}

export default setupSwagger;