import STATUS from 'http-status';
import service from './service';

const getMailBox = async (req, res, next) => {
  const { no } = req.user;
  let boxes;
  try {
    boxes = await service.findAllBoxes(no);
  } catch (err) {
    next(err);
  }
  res.status(STATUS.OK).json({ boxes });
};

const makeMailBox = async (req, res, next) => {
  const { no } = req.user;
  const { name } = req.body;
  let createdBox;
  try {
    createdBox = await service.createBox(no, name);
  } catch (err) {
    next(err);
  }
  res.status(STATUS.CREATED).json({ createdBox });
};

const alterMailBox = async (req, res, next) => {
  const { no } = req.user;
  const { name } = req.body;
  let updatedBox;
  try {
    updatedBox = await service.updateBox(no, name);
  } catch (err) {
    next(err);
  }
  res.status(STATUS.OK).json({ updatedBox });
};

export default {
  getMailBox,
  makeMailBox,
  alterMailBox,
};
