/* eslint-disable no-undef */
import should from 'should';
import DB from '../../src/database';
import service from '../../src/v1/users/service';
import mock from '../../mock/create-dummy-data';
import ErrorResponse from '../../src/libraries/exception/error-response';
import ERROR_CODE from '../../src/libraries/exception/error-code';

const user = {
  id: 'userid',
  name: '이름이뭐니',
  password: 'pasword12',
  sub_email: 'daitnu@daitnu.com',
};

const user2 = {
  id: 'userid2',
  name: '이름이뭐니',
  password: 'pasword12',
  sub_email: 'daitnu2@daitnu.com',
};

const rooot = {
  no: 1,
  id: 'rooot',
  name: '다잇누',
  password: '12345678',
  sub_email: 'root@asd.bcd',
};

const names = ['받은메일함', '보낸메일함', '내게쓴메일함', '휴지통'];

describe('user service는...', () => {
  before(async () => {
    await DB.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await DB.sequelize.sync({ force: true });
    await DB.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await mock();
  });

  describe('register 함수는...', () => {
    it('# 성공시 newUser를 반환한다.', async () => {
      const newUser = await service.register(user);
      newUser.should.be.properties(
        'domain_no',
        'no',
        'id',
        'name',
        'sub_email',
        'email',
        'password',
        'imap_password',
      );
    });

    it('# 중복된 아이디인 경우 ErrorResponse instance를 반환한다. ', async () => {
      try {
        newUser = await service.register(user);
      } catch (error) {
        error.should.be.instanceOf(ErrorResponse);
      }
    });

    it('# 중복된 아이디인 경우 ERROR_CODE는 ID_DUPLICATION 이다', async () => {
      try {
        newUser = await service.register(user);
      } catch (error) {
        const { errorCode } = error;
        errorCode.should.be.eql(ERROR_CODE.ID_DUPLICATION);
      }
    });

    it('# 중복된 아이디인 경우 ErrorFields의 length는 0이다.', async () => {
      try {
        newUser = await service.register(user);
      } catch (error) {
        const { fieldErrors } = error;
        fieldErrors.should.have.length(0);
      }
    });
  });

  describe('createDefaultCategories 함수는...', () => {
    before(async () => {
      await service.createDefaultCategories(rooot.no);
    });

    for (let i = 0; i < names.length; i++) {
      it(`# rooot에 "${names[i]}" 카테고리가 존재합니다.`, async () => {
        const category = await DB.Category.findOneByUserNoAndName(rooot.no, names[i]);
        category.should.be.have
          .properties({ user_no: rooot.no })
          .and.have.properties({ is_default: 1 });
      });
    }
  });

  describe('sendUserIdToEmail 함수는...', () => {
    it('# 가입에 사용되지 않은 이메일일 경우 ErrorResponse instance를 반환한다.', async () => {
      try {
        await service.sendUserIdToEmail('abcabc@zzz.zzz');
      } catch (error) {
        error.should.be.instanceOf(ErrorResponse);
      }
    });
  });

  describe('sendUserPasswordToEmail 함수는...', () => {
    it('# 가입에 사용되지 않은 이메일일 경우 ErrorResponse instance를 반환한다.', async () => {
      try {
        await service.sendUserPasswordToEmail(user.id, 'abcabc@zzz.zzz');
      } catch (error) {
        error.should.be.instanceOf(ErrorResponse);
      }
    });

    it('# 가입에 사용되지 않은 이메일일 경우 ERROR_CODE는 LOGIN_ID_OR_EMAIL_NOT_FOUND이다.', async () => {
      try {
        await service.sendUserPasswordToEmail(user.id, 'abcabc@zzz.zzz');
      } catch (error) {
        const { errorCode } = error;
        errorCode.should.be.eql(ERROR_CODE.LOGIN_ID_OR_EMAIL_NOT_FOUND);
      }
    });

    it('# 가입하지 않은 아이디일 경우 ErrorResponse instance를 반환한다.', async () => {
      try {
        await service.sendUserPasswordToEmail('kkzzzk', user.sub_email);
      } catch (error) {
        error.should.be.instanceOf(ErrorResponse);
      }
    });

    it('# 가입하지 않은 아이디일 경우 ERROR_CODE는 LOGIN_ID_OR_EMAIL_NOT_FOUND이다.', async () => {
      try {
        await service.sendUserPasswordToEmail('kkzzzk', user.sub_email);
      } catch (error) {
        const { errorCode } = error;
        errorCode.should.be.eql(ERROR_CODE.LOGIN_ID_OR_EMAIL_NOT_FOUND);
      }
    });
  });

  describe('updatePassword 함수는...', () => {
    let userInstance;

    before(async () => {
      await DB.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await DB.sequelize.sync({ force: true });
      await DB.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      await DB.Domain.create({
        name: 'daitnu.com',
      });
      userInstance = await DB.User.create(user, { returning: true });
    });

    it('# 비밀번호를 바꾸고 true를 반환한다.', async () => {
      const { no, salt } = userInstance;
      const newPassword = '12345678';

      await service.updatePassword(no, salt, newPassword).should.be.true;
    });
  });
});