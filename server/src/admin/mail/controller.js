import service from './service';

const sendReservationMails = async (req, res, next) => {
  let mails;

  try {
    mails = await service.sendReservationMails();
  } catch (error) {
    return next(error);
  }

  return res.json(mails);
};

export default {
  sendReservationMails,
};
