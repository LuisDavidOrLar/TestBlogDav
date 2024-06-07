import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    title: string;
    content: string;
    imageUrl: string;
    author: string;
  } | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        <button className="absolute top-4 right-4" onClick={onClose}>
          <XCircleIcon className="w-6 h-6 text-gray-700" />
        </button>
        <div className="relative w-full h-48 mb-4">
          <img className="w-full h-full object-contain rounded" src={`http://127.0.0.1:8000${post.imageUrl}`} alt={post.title} />
        </div>
        <h2 className="text-xl font-bold mt-4">{post.title}</h2>
        <p className="text-gray-700 mt-2">{post.content}</p>
        <p className="text-gray-500 mt-4">By {post.author}</p>
      </div>
    </div>
  );
};

export default Modal;
