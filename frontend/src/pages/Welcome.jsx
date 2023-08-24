import { Header, Footer, Hero } from "../components";
import { RequireAuth } from "react-auth-kit";

export default function Welcome() {
  return (
    <>
      <RequireAuth loginPath="/login">
        <Header />
        <Hero />
        <Footer />
      </RequireAuth>
    </>
  );
}
