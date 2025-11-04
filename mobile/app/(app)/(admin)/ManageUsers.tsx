import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import CreateCustomerForm from "@/app/components/CreateCustomer";
import useUsers, { User } from "@/app/hooks/useUsers";
import { EditUserModal } from "@/app/components/EditUserModal";
import { UserList } from "@/app/components/UsersList";

export default function ManageCustomersScreen() {
  const { users, isLoading, addUser, removeUser, editUser } = useUsers();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEditPress = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleModalSave = async (userId: number, data: any) => {
    const result = await editUser(userId, data);
    return result;
  };

  return (
    <ScrollView style={styles.container}>
      <CreateCustomerForm onCreateUser={addUser} />

      <UserList
        users={users}
        isLoading={isLoading}
        onDeleteUser={removeUser}
        onEditUser={handleEditPress}
      />

      <EditUserModal
        visible={isModalVisible}
        user={selectedUser}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f7f6",
  },
});
