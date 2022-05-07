import { createContext, ReactNode, useContext, useMemo } from "react";
import useLocalStorage from "renderer/utils/useLocalStorage";

export interface IUsersContext {
  users: string[];
  selectedUser: string | null;
  addUser: (user: string) => void;
  removeUser: (user: string) => void;
  setSelectedUser: (user: string | null) => void;
}

const UsersContext = createContext<IUsersContext>({
  users: [],
  selectedUser: null,
  addUser: () => { },
  removeUser: () => { },
  setSelectedUser: () => { }
});

export default function useUserStore() {
  return useContext(UsersContext);
}

export function UsersContextProvider({ children }: { children: ReactNode }) {
  const [userStore, setValue] = useLocalStorage<{ users: string[], selectedUser: string | null }>("USER_STORAGE", { users: [], selectedUser: null });

  const addUser = (user: string) => {
    setValue({ ...userStore, users: [...userStore.users, user] });
  };

  const removeUser = (user: string) => {
    setValue({
      ...userStore,
      users: userStore.users.filter(u => u !== user),
      selectedUser: userStore.selectedUser === user ? null : userStore.selectedUser });
  };

  const setSelectedUser = (user: string | null) => {
    setValue({
      ...userStore,
      selectedUser: user,
      users: (user && !userStore.users.includes(user)) ? [...userStore.users, user] : userStore.users
    });
  };

  const value = useMemo(() => ({ ...userStore, addUser, removeUser, setSelectedUser }), [userStore, addUser, removeUser, setSelectedUser]);

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
