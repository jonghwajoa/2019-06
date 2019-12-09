import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Grid,
} from '@material-ui/core';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DeleteIcon from '@material-ui/icons/Delete';
import * as WM_S from '../styled';
import * as S from './styled';
import { useDispatchForWM, useStateForWM } from '../ContextProvider';
import { UPDATE_FILES } from '../ContextProvider/reducer/action-type';
import AVAILABLE_EXTENSION from '../../../utils/available-extension';

const MB = 1000 ** 2;
const FILE_MAX_SIZE = 10 * MB;

const checkOverSize = files => {
  const sum = files.reduce((a, b) => a + b.size, 0);
  return sum <= FILE_MAX_SIZE;
};

const checkExtension = files => files.every(file => AVAILABLE_EXTENSION[file.type]);

const DropZone = ({ visible }) => {
  const { files } = useStateForWM();
  const dispatch = useDispatchForWM();

  const onDrop = useCallback(
    acceptedFiles => {
      if (!checkOverSize(acceptedFiles)) {
        return;
      }
      if (!checkExtension(acceptedFiles)) {
        return;
      }

      dispatch({ type: UPDATE_FILES, payload: { files: acceptedFiles } });
    },
    [dispatch],
  );

  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    minSize: 0,
    maxSize: FILE_MAX_SIZE,
    multiple: true,
  });

  const delBtnHandler = file => {
    dispatch({
      type: UPDATE_FILES,
      payload: { files: files.filter(f => f.lastModified !== file.lastModified) },
    });
  };

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <WM_S.RowWrapper>
        <div></div>
        <div>
          <S.UploadArea {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive
              ? '마우스 버튼을 놓으세요!'
              : '여기를 클릭하시거나 파일을 드래그해서 업로드 하세요!'}
          </S.UploadArea>
        </div>
      </WM_S.RowWrapper>
      {files.length > 0 ? (
        <WM_S.RowWrapper>
          <div></div>
          <div>
            <Grid item xs={12} md={12}>
              <div>
                <List>
                  {files.map((file, idx) => (
                    <ListItem key={idx}>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachmentIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={file.name} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => delBtnHandler(file)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </div>
            </Grid>
          </div>
        </WM_S.RowWrapper>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DropZone;
