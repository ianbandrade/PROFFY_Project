import { Request, Response } from 'express';
import db from '../database/connection';

interface HTTPParams {
  request: Request;
  response: Response;
}

export default class ConnectionController {
  async index({ request, response }: HTTPParams) {
    try {
      const totalConnections = await db('connections').count('* as total');

      const { total } = totalConnections[0];

      return response.status(200).json(total);
    } catch (err) {
      console.log(err);

      return response
        .status(400)
        .json({ error: 'Unexpected error while showing the connections!' });
    }
  }

  async create({ request, response }: HTTPParams) {
    const { user_id } = request.body;

    const trx = await db.transaction();

    try {
      await trx('connections').insert({
        user_id,
      });

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      console.log(err);

      return response
        .status(400)
        .json({ error: 'Unexpected error while creating a new connection!' });
    }
  }
}
