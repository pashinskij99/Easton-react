import { Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import Layout from "./components/Layout";

import Home from "./pages/home";
import FAQ from "./pages/faq";
import Privacy from "./pages/privacy";
import Contact from "./pages/contact";
import WIP from "./pages/wip";
import JForm from "./pages/jform";
import Jdocup from "./pages/jdocup";
import CreditApp from "./pages/creditApp";
import achForm from "./pages/achform";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Details from "./pages/details";
import { AuthProvider } from "./contexts/AuthContext";
// import DemoSignin from "./pages/demoSignin";
// import DealerDashboard from "./pages/dealerDashboard";
// import CustomerDashboard from "./pages/customerDashboard";
// import { Link, animateScroll as scroll } from "react-scroll";

import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Routes>
          <Route index element={<Navigate to="/home" />} />
          <Route element={<Unauthorized />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route element={<Layout />}>
            <Route element={<RequireAuth />}>
              <Route path="dealer-details" element={<Details />} />
              <Route path="easton-details" element={<Details />} />
            </Route>
            <Route exact path="home" element={<Home />} />
            <Route path="creditApplication" element={<CreditApp />} />
            <Route path="application" element={<JForm />} />
            <Route path="achform" element={<achForm />} />
            <Route path="documentupload" element={<Jdocup />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="contact" element={<Contact />} />
            <Route path="wip" element={<WIP />} />
          </Route>
          {/* <Route path="/demo_signin" component={DemoSignin} />
          <Route path="/dashboard-d" component={DealerDashboard} />
          <Route path="/dashboard-c" component={CustomerDashboard} /> */}
        </Routes>
      </AuthProvider>
    </Provider>
  );
}

export default App;
