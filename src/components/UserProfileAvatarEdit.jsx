import React, { useState, useCallback } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { updatedAvatar } from '../store/userSlice';
import { IoClose } from "react-icons/io5";
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImageHelper'; // (You’ll create this utility function)


const UserProfileAvatarEdit = ({ close }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result);
  };

  const uploadCroppedImage = async () => {
    try {
      setLoading(true);
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append('avatar', croppedImageBlob, 'avatar.jpg');

      const response = await Axios({
        ...SummaryApi.uploadAvatar,
        data: formData
      });

      const { data: responseData } = response;
      dispatch(updatedAvatar(responseData.data.avatar));
      close();

    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 relative">
        <button onClick={close} className="absolute top-3 right-3 text-gray-600 hover:text-black">
          <IoClose size={24} />
        </button>

        <h2 className="text-center text-lg font-semibold mb-4">Edit Profile Picture</h2>

        <div className="w-full aspect-square bg-neutral-100 relative overflow-hidden rounded">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="rounded-full w-28 h-28" />
              ) : (
                <FaRegUserCircle size={64} className="text-gray-400" />
              )}
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          id="avatar-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="avatar-upload" className="block text-center mt-4">
          <span className="cursor-pointer inline-block px-4 py-2 text-sm rounded bg-primary-100 hover:bg-primary-200 text-primary-900 border border-primary-200">
            Choose Image
          </span>
        </label>

        {imageSrc && (
          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={uploadCroppedImage}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Save'}
            </button>
            <button
              onClick={() => setImageSrc(null)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserProfileAvatarEdit;
