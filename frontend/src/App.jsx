import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-auth-kit";
import { Welcome, Error, SignIn } from "./pages";

const App = () => {
  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="" element={<Welcome />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
