import { createConnection } from 'typeorm';
import app from './app';
import { errorMessage, successMessage } from './helpers/consoleSyle';

const port = process.env.PORT || 6969;
createConnection()
  .then(() => {
    successMessage('Server Connected to the Database');

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  })
  .catch((error) => {
    console.error(error);
    errorMessage('DB Connection Refused');
  });
