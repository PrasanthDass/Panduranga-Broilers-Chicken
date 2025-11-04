import React from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { User } from "../hooks/useUsers";

type Props = {
  users: User[];
  isLoading: boolean;
  onDeleteUser: (userId: number) => void;
  onEditUser: (user: User) => void;
};

const UserItem = ({
  item,
  onEditUser,
  onDeleteUser,
}: {
  item: User;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
}) => {
  const isAdmin = item.role === "admin";
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View
          style={[
            styles.roleTag,
            isAdmin ? styles.adminTag : styles.customerTag,
          ]}
        >
          <Text style={styles.roleTagText}>{item.role}</Text>
        </View>
      </View>

      <Text style={styles.mobileText}>{item.mobile_number}</Text>

      <View style={styles.cardFooter}>
        <Pressable style={styles.editButton} onPress={() => onEditUser(item)}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
        <Pressable
          style={styles.deleteButton}
          onPress={() => onDeleteUser(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

export const UserList = ({
  users,
  isLoading,
  onDeleteUser,
  onEditUser,
}: Props) => {
  if (isLoading) {
    return <ActivityIndicator size="small" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={styles.listContainer}>
      <Text style={styles.title}>All Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem
            item={item}
            onEditUser={onEditUser}
            onDeleteUser={onDeleteUser}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: { marginTop: 24 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  mobileText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  adminTag: {
    backgroundColor: "#FFF5E6",
  },
  customerTag: {
    backgroundColor: "#E7F5FF",
  },
  roleTagText: {
    fontSize: 15,
    textTransform: "capitalize",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 8,
  },
  editButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  editText: {
    color: "#007AFF",
    fontWeight: "500",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF474C",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
