import { useSelector } from "react-redux";

const useLoggedIn = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return isLoggedIn;
};

export default useLoggedIn;
