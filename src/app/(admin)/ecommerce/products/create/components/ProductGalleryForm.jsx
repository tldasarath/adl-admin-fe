import { useRef } from "react";
import { Icon } from "@iconify/react";

const ImageUpload = ({ blogData, updateBlogData }) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;
    updateBlogData({ image: file });
  };

  const removeImage = () => {
    updateBlogData({ image: null });
    fileInputRef.current.value = ""; // reset input
  };

  return (
    <div>
      <label className="fs-14 mb-1">Blog Image</label>

      {/* Dropzone Styled Box */}
      {!blogData.image && (
        <div
          onClick={() => fileInputRef.current.click()}
          className="upload-box"
        >
          <Icon icon="bx:cloud-upload" width="48" height="48" className="upload-icon" />

          <p className="upload-text">Drop file here or click to browse</p>

          <p className="upload-help">(Only one image allowed)</p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />
        </div>
      )}

      {/* Preview */}
      {blogData.image && (
        <div className="preview-wrapper">
          <button className="remove-btn" onClick={removeImage}>
            <Icon icon="mdi:close" width="20" height="20" />
          </button>

          <img
            src={URL.createObjectURL(blogData.image)}
            alt="Preview"
            className="uploaded-image"
          />
        </div>
      )}

      <style jsx>{`
        .upload-box {
          width: 100%;
          padding: 35px;
          border: 2px dashed #b9b9b9;
          border-radius: 10px;
          text-align: center;
          cursor: pointer;
          transition: 0.3s ease;
          
        }

        .upload-box:hover {
          border-color: #5a5ad1;
        }

        .upload-icon {
          color: #5a5ad1;
          margin-bottom: 10px;
        }

        .upload-text {
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          color: #8d8f8e;
        }

        .upload-help {
          font-size: 13px;
          color: #888;
          margin-top: 4px;
        }

        .preview-wrapper {
          position: relative;
          width: 140px;
        }

        .uploaded-image {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #ddd;
        }

        .remove-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          background: #ff4d4d;
          border: none;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
          color: white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: 0.2s ease;
        }

        .remove-btn:hover {
          background: #e60000;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
