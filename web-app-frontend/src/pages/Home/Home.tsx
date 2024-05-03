import { Link } from "react-router-dom";
import InstitutionalDrawer from "../../components/InstitutionalDrawer/InstitutionalDrawer";
import IndividualDrawer from "../../components/IndividualDrawer/IndividualDrawer";
const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Home</h1>
      <br />
      <a href="/">Login</a>
      <br />
      <br />
      <a href="/signup">Sign up</a>
      <br />
      <br />
      <br />
      <InstitutionalDrawer KYCOpen={false} setKYCOpen={() => {}} />
      <br />
      <br />
      <IndividualDrawer KYCOpen={false} setKYCOpen={() => {}} />
      <br />
      <br />
      {/* <br />
      <Link to="/user-information">Personal Info</Link>
      <br /> */}

      <br />
      <br />
      <Link to="/dashboard">Dashboard</Link>
      <br />
      <br />
      <Link to="/borrower/dashboard">borrower Dashboard</Link>
      <br />
      <br />
      <Link to="/borrower/login">borrower Login</Link>
      <br />
      <br />
      <Link to="/borrower/register">borrower Register</Link>
      <br />
      <br />
      <Link to="/borrower-request">Borrower Kyc</Link>
    </div>
  );
};

export default Home;
