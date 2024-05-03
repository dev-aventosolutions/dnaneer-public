import Greeting from "pages/Dashboard/DasboardComponents/Greeting/Greeting";
import HeaderCards from "./HeaderCards";
import DashboardBody from "./DashboardBody/DashboardBody";
import { useRecoilState } from "recoil";
import { borrowerProfileAtom, userProfileAtom } from "store/user";
import { useEffect } from "react";
import { getDecryptedUser } from "utils/Helper";
const DashboardContent = () => {
  const [userProfile, setUserProfile] = useRecoilState(borrowerProfileAtom);
  useEffect(() => {
    const user = getDecryptedUser();
    if (user)
      (async () => {
        setUserProfile({
          ...user,
          wathq: await JSON.parse(user?.wathq),
          nafath: await JSON.parse(user?.nafath),
        });
      })();
  }, []);
  return (
    <>
      <Greeting
        role={"Company"}
        className={"borrower-greeting"}
        name={userProfile.name}
        src={userProfile?.profile_image_url}
      />
      <HeaderCards userProfile={userProfile} />
      <DashboardBody />
    </>
  );
};

export default DashboardContent;
