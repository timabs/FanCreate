import { useSelector } from "react-redux";

const useActiveConvo = () => {
  return useSelector((state) => state.messages.activeConversation);
};

export default useActiveConvo;
