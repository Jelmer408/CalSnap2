import { ImagePickerResponse } from 'react-native-image-picker';

export interface CameraResult {
  imageData: string;
  error?: string;
}

export interface CameraOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}
