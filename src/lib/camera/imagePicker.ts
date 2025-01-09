import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CameraResult, CameraOptions } from './types';

const DEFAULT_OPTIONS = {
  mediaType: 'photo',
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.8,
  includeBase64: true,
  saveToPhotos: false,
};

export async function takePhoto(options?: CameraOptions): Promise<CameraResult> {
  try {
    const response = await launchCamera({
      ...DEFAULT_OPTIONS,
      ...options,
    });

    if (response.didCancel) {
      throw new Error('User cancelled camera');
    }

    if (response.errorCode) {
      throw new Error(response.errorMessage || 'Camera error');
    }

    const asset = response.assets?.[0];
    if (!asset?.base64) {
      throw new Error('No image data received');
    }

    return {
      imageData: `data:${asset.type};base64,${asset.base64}`,
    };
  } catch (error) {
    return {
      imageData: '',
      error: error instanceof Error ? error.message : 'Failed to capture photo'
    };
  }
}

export async function pickImage(options?: CameraOptions): Promise<CameraResult> {
  try {
    const response = await launchImageLibrary({
      ...DEFAULT_OPTIONS,
      ...options,
    });

    if (response.didCancel) {
      throw new Error('User cancelled selection');
    }

    if (response.errorCode) {
      throw new Error(response.errorMessage || 'Selection error');
    }

    const asset = response.assets?.[0];
    if (!asset?.base64) {
      throw new Error('No image data received');
    }

    return {
      imageData: `data:${asset.type};base64,${asset.base64}`,
    };
  } catch (error) {
    return {
      imageData: '',
      error: error instanceof Error ? error.message : 'Failed to select photo'
    };
  }
}
