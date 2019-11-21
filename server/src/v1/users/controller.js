import status from 'http-status';
import validation from '../../libraries/validation/user';
import service from './service';
import DB from '../../database';
import mailUtil from '../../libraries/mail-util';

const registerUser = async (req, res, next) => {
  let newUser;

  try {
    await validation.join(req.body);
    newUser = await service.register(req.body);
  } catch (error) {
    return next(error);
  }

  return res.status(status.CREATED).json({ newUser });
};

const search = async (req, res, next) => {
  try {
    validation.checkQueryForSearch(req.query);

    switch (req.query.type) {
      case 'id': {
        const user = await DB.User.findOneByEmail(req.body.email);
        if (user) {
          mailUtil.sendFindIdMail({ id: user.user_id, email: user.sub_email });
        }
        break;
      }
      case 'pw':
        break;

      default:
        break;
    }
  } catch (err) {
    return next(err);
  }

  return res.status(status.NO_CONTENT).end();
};

export default { registerUser, search };
