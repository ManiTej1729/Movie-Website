import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Search from './Search';
import Title from './Title';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WatchList from './WatchLists';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={ <Login /> } />
          <Route path='/home' element={ <Home /> } />
          <Route path='/signup' element={ <Signup /> } />
          <Route path='/title' element={ <Title /> }/>
          <Route path='/search' element={ <Search /> }/>
          <Route path='/playlists' element={ <WatchList /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
