import './App.css';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import routes from "./Routes/routes"

function App() {
  return (
    // <BrowserRouter>
    <RouterProvider router={routes} />
    // </BrowserRouter>
  );
}

export default App;
