
// import { useNavigate } from "react-router-dom";

function Header() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(true);
  };
  
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className="header">
      <div className="logo">
        <h2>Mywoods</h2>
      </div>

      <nav>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/woods">Woods</a></li>
          <li><a href="/contact">Contact</a></li>
          {isLoggedIn ? (
            <>
              <li><a href="/cms">CMS</a></li>
            </>
          ) : (
            <>
              <li><a href="/login">Login</a></li>
              <li><a href="/signup">Sign Up</a></li>
            </>
          )}
        </ul>
      </nav>
      
      {isLoggedIn && (
        <button className="btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </header>
  );
}

export default Header;