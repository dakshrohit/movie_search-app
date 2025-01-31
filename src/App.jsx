import { useState, useEffect } from "react";
import axios from "axios";
import Movieapp from "./components/Movie_app";
import "./App.css";
import { AiOutlineSearch } from "react-icons/ai";


const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchquery, setsearchquery] = useState("");
  const [sortby, setsortby] = useState("popularity.desc");
  const [genres, setgenre] = useState([]);
  const [selectedgenre, setselectedgenre] = useState("");
  const [expandedmovieid, setexpandedmovieid] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // console.log("API Key:", import.meta.env.VITE_TMDB_API_KEY);

  useEffect(() => {
    const fetchgenres = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/genre/movie/list",
        {
          params: {
            api_key: API_KEY,
          },
        }
      );
      setgenre(response.data.genres);
    };
    fetchgenres();
  }, []);

  useEffect(() => {
    const fetchmovies = async () => {
      const response = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            api_key: API_KEY,
            sort_by: sortby,
            page: 1,
            with_genres: selectedgenre,
            // query:searchquery,
          },
        }
      );
      setMovies(response.data.results);
    };
    fetchmovies();
  }, [sortby, selectedgenre]);

  const handlesearchchange = (event) => {
    setsearchquery(event.target.value);
  };

  const handlesearchsubmit = async (event) => {
    const response = await axios.get(
      "https://api.themoviedb.org/3/search/movie",
      {
        params: {
          api_key: API_KEY,
          query: searchquery,
        },
      }
    );
    setMovies(response.data.results);
  };
  const toggledesc = (movieid) => {
    setexpandedmovieid(expandedmovieid === movieid ? null : movieid);
  };

  const handlesortchange = (event) => {
    setsortby(event.target.value);
  };

  const handlegenrechange = (event) => {
    setselectedgenre(event.target.value);
  };
  return (
    <div>
      <Movieapp></Movieapp>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Movies..."
          value={searchquery}
          onChange={handlesearchchange}
          className="search-input"
        />
        <button onClick={handlesearchsubmit} className="search-button">
          <AiOutlineSearch />
        </button>
      </div>
      <div className="filters">
        <label htmlFor="sort-by">Sort By:</label>
        <select id="sort-by" value={sortby} onChange={handlesortchange}>
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="release_date.desc">Release Date Descending</option>
          <option value="release_date.asc">Release Date Ascending</option>
        </select>
        <label htmlFor="genre">Genre:</label>
        <select id="genre" value={selectedgenre} onChange={handlegenrechange}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>
      <div className="movie-wrapper">
        {movies.map((movie) => (
          <div key={movie.id} className="movie">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p className="rating">Rating: {movie.vote_average}</p>
            {expandedmovieid === movie.id ? (
              <p>{movie.overview}</p>
            ) : (
              <p>{movie.overview.substring(0, 150)}...</p>
            )}
            <button onClick={() => toggledesc(movie.id)} className="read-more">
              {expandedmovieid === movie.id ? "show less" : "read more"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


