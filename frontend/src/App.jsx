import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "react-auth-kit";
import { Welcome, Error, SignIn, SignUp } from "./pages";

const App = () => {
  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.location.hostname}
      cookieSecure={true}
    >
      <BrowserRouter basename="/v2">
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<SignIn />} />
          <Route path="" element={<Welcome />} />
          <Route path="*" element={<Error />} />
          <Route path="/reservation" element={<RequireAuth loginPath={'/login'}><Welcome/></RequireAuth>} />
          <Route path="/equipment" element={<RequireAuth loginPath={'/login'}><Welcome/></RequireAuth>} />
          <Route path="/connection" element={<RequireAuth loginPath={'/login'}><Welcome/></RequireAuth>} />
          <Route path="/administration" element={<RequireAuth loginPath={'/login'}><Welcome/></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
