export default function Header({ username }) {
  return (
    <header>
      <div className="container">
        <img src="/assets/kds-logo-short.svg" alt="logo" height="45px"/>
        <div className="flexed">
          <div>Welcome, {username}</div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </header>
  );
  
  function handleLogout() {
    // Your logout logic here
  }
}
