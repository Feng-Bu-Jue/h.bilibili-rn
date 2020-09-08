import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';

const resolveFileName = (targetUrl: string): string => {
  var regexResult = /[\w]+\.((webp)|(jpg)|(png))/.exec(targetUrl);
  if (!regexResult) {
    throw new Error('fail to extract file name');
  }
  return regexResult[0];
};

export const downloadFile = (url: string) => {
  const dir = Platform.select({
    android: RNFS.DocumentDirectoryPath,
    ios: RNFS.MainBundlePath,
  });

  const filename = resolveFileName(url);
  // 图片
  const downloadDest = `${dir}/${filename}`;

  const options: RNFS.DownloadFileOptions = {
    fromUrl: url,
    toFile: downloadDest,
    background: true,
    begin: (res) => {
      console.log('begin', res);
      console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
    },
  };
  try {
    const ret = RNFS.downloadFile(options);
    ret.promise
      .then((res) => {
        console.log(res);
        CameraRoll.save(downloadDest)
          .then(() => {
            console.log('r-h-s');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((err) => {
        console.log('err', err);
      });
  } catch (e) {
    console.log(e);
  }
};
