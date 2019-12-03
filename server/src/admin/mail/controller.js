import service from './service';

const list = async (req, res, next) => {
  let mails;

  try {
    mails = await service.getReservationMails();
  } catch (error) {
    return next(error);
  }

  return res.json(mails);
};

export default {
  list,
};
