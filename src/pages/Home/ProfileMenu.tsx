import { useLogout } from "../../hooks/useLogout";
import { alert } from "../../coremodules/AlertContainer";


export default function ProfileMenu() {
  const logout = useLogout();

  const onLogout = () => {
    alert({
      title: "Logout",
      content: "Are you sure you want to logout?",
      buttons: [
        { text: "Back" },
        { text: "Logout", onClick: () => logout.mutate() },
      ],
    });
  };

  return (
    <div className="text-white font-semibold mr-3" onClick={onLogout}>
      Logout
    </div>
  );
}
