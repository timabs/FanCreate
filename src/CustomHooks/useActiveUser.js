import { useSelector } from "react-redux";

const useActiveUser = () => {
  const activeUser = useSelector((state) => state.messages.activeUser);
  return activeUser;
};
export default useActiveUser;
