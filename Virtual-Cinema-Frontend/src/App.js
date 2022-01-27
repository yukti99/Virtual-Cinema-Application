import * as React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.scss';
import CreateStream from './components/CreateStream/CreateStream';
import EndParty from './components/EndParty/EndParty';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Registration from './components/Registration/Registration';
import UserDashboard from './components/UserDashboard/UserDashboard';
import Watch from './components/Watch/Watch';
import WatchLog from "./components/UserDashboard/WatchLog";

export default function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='registration' element={<Registration />} />
        <Route path='login' element={<Login />} />
        <Route path='user-dashboard' element={<UserDashboard />} />
        <Route path='create-stream' element={<CreateStream />} />
        <Route path='watch-log' element={<WatchLog />} />
        <Route path='watch-video-on' element={<Watch />} />
        <Route path='end-party' element={<EndParty />} />
      </Routes>
    </div>
  );
}
