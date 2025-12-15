import { useAuthControllerLogout } from '@Procareful/common/api';
import { useAuthStore, LocalStorageKey } from '@Procareful/common/lib';
import { Button } from 'antd';

// This component is only for development purposes.
// Normally, the logout functionality is not available to users.
// This component will be deleted later.

const Logout = () => {
  const { mutate: handleLogout, isPending } = useAuthControllerLogout();
  const { setAuthState } = useAuthStore(state => ({ setAuthState: state.setAuthState }));

  const handleLogoutButtonClick = () => {
    handleLogout();
    localStorage.removeItem(LocalStorageKey.IsAuthenticated);
    localStorage.removeItem(LocalStorageKey.HasUserOnboarding);
    localStorage.removeItem(LocalStorageKey.GeneratedCodeStartDate);
    localStorage.removeItem(LocalStorageKey.UserBlockStartDate);
    localStorage.removeItem(LocalStorageKey.SecurityAlertData);
    setAuthState({ isAuth: false, isLoading: false });
  };

  return (
    <div>
      <Button loading={isPending} onClick={handleLogoutButtonClick}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
