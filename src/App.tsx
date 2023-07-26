import React from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Auth } from './pages/auth';
import { Chat } from './pages/chat';
import { Home } from './pages/home';
import { Split } from './pages/split';
import { Todo } from './pages/todo';
import { Navbar } from './components/navbar';
import background from "./background.jpg"
import { HomeFull } from './pages/homeFull';

//



function App() {
  return (
    <div className="App img" >
        <BrowserRouter>
          <Navbar/>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/todo" element={<Todo/>}/>
              <Route path="/chat" element={<Chat/>}/>
              <Route path="/split" element={<Split/>}/>
              <Route path="/auth" element={<Auth/>}/>
              <Route path="/home" element={<HomeFull/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
