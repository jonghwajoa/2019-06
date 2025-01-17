import DB from '../../database';
import ErrorResponse from '../../libraries/exception/error-response';
import ERROR_CODE from '../../libraries/exception/error-code';

const DEFAULT_CATEGORIES = ['전체메일함', '받은메일함', '보낸메일함', '내게쓴메일함', '휴지통'];

// eslint-disable-next-line camelcase
const register = async ({ id, password, name, sub_email }) => {
  const userData = { id, password, name, sub_email };
  let newUser;

  try {
    await DB.sequelize.transaction(async transaction => {
      const [response, created] = await DB.User.findOrCreateById(userData, { transaction });
      if (!created) {
        throw new ErrorResponse(ERROR_CODE.ID_DUPLICATION);
      }
      newUser = response.get({ plain: true });
      await createDefaultCategories(newUser.no, transaction);
    });
  } catch (error) {
    throw error;
  }

  delete newUser.password;
  return newUser;
};

const createDefaultCategories = async (no, transaction) => {
  const categories = DEFAULT_CATEGORIES.map(name => ({
    user_no: no,
    is_default: true,
    name,
  }));
  await DB.Category.bulkCreate(categories, { transaction });
};

export default { register, createDefaultCategories };
