export default function Header({ username }) {
  return (
    <header>
      <div>Your Logo Here</div>
      <div>Welcome, {username}</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
  
  function handleLogout() {
    // Your logout logic here
  }
}
