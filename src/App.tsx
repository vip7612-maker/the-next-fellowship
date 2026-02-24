import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Episode from './components/Episode';
import Consulting from './components/Consulting';
import Application from './components/Application';
import Vote from './components/Vote';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  return (
    <div className="app-loader">
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Episode />
        <Consulting />
        <Application />
        <Vote />
        <Gallery />
      </main>
      <footer>
        <div className="container footer-content">
          <div className="footer-logo">
            THE <span className="neon-text">NEXT</span> FELLOWSHIP
          </div>
          <p>© 2026 인순이와 좋은 사람들. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
