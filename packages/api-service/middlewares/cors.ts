import * as cors from 'kcors';

export default cors({
  allowMethods: 'GET, PUT, PATCH, POST, DELETE',
  credentials: true,
});
