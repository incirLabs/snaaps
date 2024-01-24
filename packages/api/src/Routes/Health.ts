import express from 'express';
import {HTTPStatus} from 'common';

const Router = express.Router();

Router.get('/', async (req, res) => {
  try {
    res.status(HTTPStatus.OK).send();
  } catch (_err) {
    res.status(HTTPStatus.InternalServerError).send();
  }
});

export default Router;
