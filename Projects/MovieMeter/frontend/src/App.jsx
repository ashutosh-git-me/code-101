import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Browse from './pages/Browse';
import About from './pages/About';
import Navbar from './components/Navbar';
import { WatchlistProvider } from './context/WatchlistContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <WatchlistProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white pb-20">
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:mediaType/:id" element={<MovieDetail />} />
              <Route path="/category/:id" element={<Browse />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </WatchlistProvider>
  );
}

export default App;
