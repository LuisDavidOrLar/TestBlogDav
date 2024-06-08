import React, { useEffect, useState } from 'react';
import axios from '../api';
import Modal from '../components/modal';
import { useAuth } from '../context/AuthContext';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const { data } = await axios.get('/user-posts');
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch user posts:', error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const Card = ({ post }: { post: Post }) => (
    <div className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer" onClick={() => handlePostClick(post)}>
      <div className="relative w-full h-48">
        <img className="w-full h-full object-cover" src={`https://testblogdav.onrender.com${post.imageUrl}`} alt={post.title} />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{post.title}</div>
        <p className="text-gray-700 text-base">{post.author}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8 flex-grow">
      <div className="font-bold text-2xl mb-4">My Posts</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map(post => (
          <Card key={post._id} post={post} />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} post={selectedPost} />
    </div>
  );
};

export default MyPosts;
