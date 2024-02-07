import CoreProvider from "../CoreProvider";
import Router from "./router";
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <CoreProvider>
      <Router />
    </CoreProvider>
  );
}

export default App;
