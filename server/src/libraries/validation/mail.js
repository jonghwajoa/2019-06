import { isInt } from 'validator';
import ERROR_CODE from '../exception/error-code';
import ErrorField from '../exception/error-field';
import ErrorResponse from '../exception/error-response';

const { MAX_SAFE_INTEGER } = Number;
const PAGE_NUMBER_RANGE = { min: 1, max: MAX_SAFE_INTEGER };
const CATEGORY_NUMBER_RANGE = { min: 0, max: MAX_SAFE_INTEGER };
const NO_NUMBER_RANGE = { min: 1, max: MAX_SAFE_INTEGER };

const SORTING_CRITERIA = {
  datedesc: true,
  dateasc: true,
  subjectdesc: true,
  subjectasc: true,
  fromdesc: true,
  fromasc: true,
};

const validateNo = no => {
  if (!no) {
    const errorField = new ErrorField('no', no, 'no는 반드시 있어야 하는 값입니다.');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }

  if (!isInt(no, NO_NUMBER_RANGE)) {
    const errorField = new ErrorField('no', no, '올바르지 않는 값입니다.');
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorField);
  }
};

const validateProps = ({ category_no, is_important, is_read }) => {
  const errorFields = [];

  if (category_no && typeof category_no !== 'number') {
    const errorField = new ErrorField('category_no', category_no, '유효하지 않은 값입니다.');
    errorFields.push(errorField);
  }

  if (is_important && typeof is_important !== 'boolean') {
    const errorField = new ErrorField('is_important', is_important, '유효하지 않은 값입니다.');
    errorFields.push(errorField);
  }

  if (is_read && typeof is_read !== 'boolean') {
    const errorField = new ErrorField('is_read', is_read, '유효하지 않은 값입니다.');
    errorFields.push(errorField);
  }

  if (errorFields.length > 0) {
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorFields);
  }

  return true;
};

const checkQuery = ({ category, page, sort }) => {
  const errorFields = [];

  if (category && !isInt(category, CATEGORY_NUMBER_RANGE)) {
    const errorField = new ErrorField('category', category, '유효하지 않은 값입니다.');
    errorFields.push(errorField);
  }

  if (page && !isInt(page, PAGE_NUMBER_RANGE)) {
    const errorField = new ErrorField('page', page, '유효하지 않은 값입니다.');
    errorFields.push(errorField);
  }

  if (sort && !SORTING_CRITERIA[sort]) {
    const errorField = new ErrorField('sort', sort, '유효하지 않은 정렬기준 입니다.');
    errorFields.push(errorField);
  }

  if (errorFields.length > 0) {
    throw new ErrorResponse(ERROR_CODE.INVALID_INPUT_VALUE, errorFields);
  }

  return true;
};

export { validateNo, validateProps, checkQuery };