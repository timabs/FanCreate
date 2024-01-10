import { setLoggedIn } from "./auth";
import { clearActiveConversation } from "./messages";

export const logoutUser = () => (dispatch) => {
  dispatch(setLoggedIn(false));
  dispatch(clearActiveConversation());
};
