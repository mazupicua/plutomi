import SignedInNav from "../components/Navbar/SignedInNav";
import useSelf from "../SWR/useSelf";
import UserProfileHeader from "../components/UserProfile/UserProfileHeader";
import { mutate } from "swr";
import UserProfileModal from "../components/UserProfile/UserProfileModal";
import Loader from "../components/Loader";
import Login from "../components/Login";
import useStore from "../utils/store";
import UsersService from "../Adapters/UsersService";
export default function Team() {
  const { user, isUserLoading, isUserError } = useSelf();

  const userProfileModal = useStore((state) => state.userProfileModal);

  const setUserProfileModal = useStore((state) => state.setUserProfileModal);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && isUserLoading) {
    return <Loader text="Loading..." />;
  }

  if (isUserError) {
    return <Login loggedOutPageText={"Log in to view your profile"} />;
  }

  if (isUserLoading) {
    return <Loader text="Loading user..." />;
  }

  // TODO fix types
  const updateUser = async () => {
    try {
      setUserProfileModal({
        ...userProfileModal,
        isModalOpen: false,
      });

      const { message } = await UsersService.updateUser(user?.userId, {
        firstName: userProfileModal.firstName,
        lastName: userProfileModal.lastName,
        GSI1SK: `${userProfileModal.firstName} ${userProfileModal.lastName}`,
      });
      alert(message);
    } catch (error) {
      alert(error.response.data.message);
    }

    mutate(UsersService.getSelfURL());
  };

  return (
    <>
      <UserProfileModal updateUser={updateUser} />
      <SignedInNav current="PLACEHOLDER" />
      <div className="max-w-7xl mx-auto p-4 my-12 rounded-lg min-h-screen ">
        <header>
          <UserProfileHeader />
        </header>

        <main className="mt-5">
          <h1 className="text-2xl font-bold text-dark">
            There&apos;s not much here... yet!
          </h1>
        </main>
      </div>
    </>
  );
}
