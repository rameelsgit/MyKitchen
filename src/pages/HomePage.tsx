import React from "react";

const Home: React.FC = () => {
  return (
    <div>
      <section className="hero">
        <div className="container text-center">
          <h1 className="hero-title">MyKitchen</h1>
          <button className="btn btn-primary hero-btn">hmmmm</button>
        </div>
      </section>
      <div className="container mt-5">
        <p>Your personal recipe assistant.</p>
      </div>
    </div>
  );
};

export default Home;
