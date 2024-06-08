import React, { useEffect, useState } from 'react';
import axios from '../api';
import Modal from '../components/modal';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('/posts');
        setPosts(data);
        console.log('Fetched post IDs:', data.map((post: Post) => post._id));
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
      <div className="font-bold text-2xl mb-4">Dashboard</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map(post => (
          <Card key={post._id} post={post} />
        ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} post={selectedPost} />
    </div>
  );
};

export default Dashboard;