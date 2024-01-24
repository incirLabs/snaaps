import {HTTPStatus, ErrorCodes} from 'common';
import express from 'express';
import {z} from 'zod';
import {FirestoreCollections, serverTimestamp} from '../Services';
import {EmailValidator} from '../Utils/EmailValidator';

const Router = express.Router();

const EmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .refine((email) => EmailValidator(email)),
});

Router.get('/:email', async (req, res) => {
  const result = EmailSchema.safeParse(req.params);

  if (!result.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: result.error});
    return;
  }

  const snapshot = await FirestoreCollections.emails.where('email', '==', result.data.email).get();

  const firstDoc = snapshot.docs[0];
  if (!firstDoc) {
    res.status(HTTPStatus.NotFound).send({code: ErrorCodes.NotFound});
    return;
  }

  res.status(HTTPStatus.OK).send(firstDoc.data());
});

Router.post('/', async (req, res) => {
  const result = EmailSchema.safeParse(req.body);

  if (!result.success) {
    res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.FillAllFields, error: result.error});
    return;
  }

  const {email} = result.data;

  try {
    const snapshot = await FirestoreCollections.emails.where('email', '==', email).get();

    if (snapshot.docs.length > 0) {
      res.status(HTTPStatus.BadRequest).send({code: ErrorCodes.AlreadyExists});
      return;
    }
  } catch (err) {
    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  try {
    await FirestoreCollections.emails.add({
      email,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    res.status(HTTPStatus.InternalServerError).send();
    return;
  }

  res.status(HTTPStatus.OK).send({email});
});

export default Router;
