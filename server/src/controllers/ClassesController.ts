import { Request, Response } from 'express';

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface HTTPParams {
  request: Request;
  response: Response;
}

interface ScheduleItem {
  week_day: number;
  from: String;
  to: String;
}

export default class ClassesController {
  async index({ request, response }: HTTPParams) {
    const filters = request.query;

    const week_day = filters.week_day as string;
    const subject = filters.subject as string;
    const time = filters.time as string;

    try {
      if (!filters.week_day || !filters.subject || !filters.time) {
        return response.status(400).json({
          error: 'Missing filters to search available classes!',
        });
      }

      const timeInMinutes = convertHourToMinutes(time);

      const classes = await db('classes')
        .whereExists(function () {
          this.select('class_schedule*')
            .from('class_schedule')
            .whereRaw('`class_schedule`.`classes_id` = `classes`.`id`')
            .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
            .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
            .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);

      return response.status(200).json(classes);
    } catch (err) {
      console.log(err);

      return response
        .status(400)
        .json({ error: 'Unexpected error while showing a new class!' });
    }
  }

  async create({ request, response }: HTTPParams) {
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule,
    } = request.body;

    const trx = await db.transaction();

    try {
      const insertedUsersIds = await trx('users').insert({
        name,
        avatar,
        whatsapp,
        bio,
      });

      const user_id = insertedUsersIds[0];

      const insertedClassesIds = await trx('users').insert({
        subject,
        cost,
        user_id,
      });

      const class_id = insertedClassesIds[0];

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          week_day: scheduleItem.week_day,
          from: convertHourToMinutes(scheduleItem.from),
          to: convertHourToMinutes(scheduleItem.to),
          class_id,
        };
      });

      await trx('schedule').insert(classSchedule);

      await trx.commit();

      return response.status(201).send();
    } catch (err) {
      await trx.rollback();

      console.log(err);

      return response
        .status(400)
        .json({ error: 'Unexpected error while creating a new class!' });
    }
  }
}
