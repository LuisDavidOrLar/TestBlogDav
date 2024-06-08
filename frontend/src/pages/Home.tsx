import LoginForm from '../components/LoginForm';


const Home = () => {
  return (
    <div className="home-container">
      <div className="login-container">
        <img src="/src/assets/logo.png" alt="Logo" className="logo mx-auto mb-4" />
        <LoginForm centered />
      </div>
    </div>
  );
};

export default Home;

