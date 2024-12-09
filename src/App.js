import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import CreateBlog from "./pages/CreateBlog";
import BlogList from "./pages/BlogList";
import EditBlog from "./pages/EditBlog";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
     
        {/* Main content section */}
        <div className="flex flex-grow">

          {/* Main content area */}
          <div className="flex-grow p-6">
         
            <Routes>
            <Route path="*" element={<NotFound />} />
            <Route exact path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blog"
                element={
                  <PrivateRoute>
                    <BlogList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blog/create"
                element={
                  <PrivateRoute>
                    <CreateBlog />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blog/edit/:id"
                element={
                  <PrivateRoute>
                    <EditBlog />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
