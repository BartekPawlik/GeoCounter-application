import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Welcome to GeoCounter!</h1>
      <button onClick={() => setCount(count + 1)}>Count is {count}</button>
    </div>
  );
}

export default App;

