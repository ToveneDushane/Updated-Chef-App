import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("Mains");
  const [price, setPrice] = useState("");

  const [menu, setMenu] = useState([]);
  const [menuPage, setMenuPage] = useState("main"); // main → drinks

  // Add dish
  const addDish = () => {
    if (!dishName || !price) {
      alert("Please enter Dish Name and Price");
      return;
    }
    const newDish = {
      id: Date.now().toString(),
      dish: dishName,
      desc: description,
      price: "R" + price,
      course,
    };
    setMenu([...menu, newDish]);
    setDishName("");
    setDescription("");
    setPrice("");
    setCourse("Mains");
  };

  // Split menus
  const mainMenu = menu.filter((item) => item.course !== "Drinks");
  const drinksMenu = menu.filter((item) => item.course === "Drinks");

  const dataToShow = menuPage === "main" ? mainMenu : drinksMenu;

  // Render each menu item
  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuText}>
        {item.dish}
        {item.desc ? `\n${item.desc}` : ""}
        {"\n" + item.price}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.menuTitle}>
        {menuPage === "main" ? "MAIN MENU" : "Drinks MENU"}
      </Text>

      <Text style={styles.countText}>
        Total Menu Items: {menu.length}
      </Text>

      {dataToShow.length > 0 ? (
        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id}
          renderItem={renderMenuItem}
          style={{ marginBottom: 20 }}
        />
      ) : (
        <Text style={{ color: "white", marginVertical: 20 }}>No items yet</Text>
      )}

      {/* Add Dish Form */}
      <TextInput
        style={styles.input}
        placeholder="Dish Name"
        value={dishName}
        onChangeText={setDishName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={{ color: "white", marginBottom: 5 }}>Select Course</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={course} onValueChange={(value) => setCourse(value)}>
          <Picker.Item label="Starters" value="Starters" />
          <Picker.Item label="Mains" value="Mains" />
          <Picker.Item label="Desserts" value="Desserts" />
          <Picker.Item label="Drinks" value="Drinks" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price (e.g. 160)"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={addDish}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={() => setMenuPage(menuPage === "main" ? "drinks" : "main")}
        >
          <Text style={styles.navText}>
            {menuPage === "main" ? "Next" : "Back"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5E3C",
    padding: 20,
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "green",
    marginBottom: 5,
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    padding: 15,
    marginBottom: 15,
    width: "100%",
  },
  menuText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 20,
    marginBottom: 15,
    justifyContent: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "green",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  navText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },
});
