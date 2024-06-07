import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import { useAuth } from '../context/AuthContext';
import { useDropzone } from 'react-dropzone';

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImage(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      console.error('Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', user?.email || 'Anonymous');
    formData.append('image', image);

    try {
      await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl mb-4">Create New Post</h1>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
              required
            />
          </div>
          <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag and drop an image here, or click to select one</p>
            )}
          </div>
          {image && (
            <div className="mt-4">
              <p>Selected file: {image.name}</p>
            </div>
          )}
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded shadow">
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
