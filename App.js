// App.js
import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5E3C",
    padding: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFD700",
    borderRadius: 50,
    paddingVertical: 10,
    marginBottom: 20,
  },
  navText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  selectedNav: {
    textDecorationLine: "underline",
    color: "#006400",
  },
  menuItem: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuText: {
    fontWeight: "bold",
    color: "black",
    flexShrink: 1,
  },
  priceTag: {
    backgroundColor: "green",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#FFD700",
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: "#FFD700",
    borderRadius: 20,
    marginBottom: 15,
  },
  button: {
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
  avgBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  avgText: {
    color: "white",
    fontSize: 15,
  },
});

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [items, setItems] = useState([
    { id: "1", name: "Tomato Soup", course: "Starters", price: 25 },
    { id: "2", name: "Grilled Chicken", course: "Mains", price: 85 },
    { id: "3", name: "Chocolate Cake", course: "Dessert", price: 40 },
  ]);

  const [name, setName] = useState("");
  const [course, setCourse] = useState("Starters");
  const [price, setPrice] = useState("");
  const [filterCourse, setFilterCourse] = useState("All");

  const averages = useMemo(() => {
    const groups = {};
    for (const it of items) {
      if (!groups[it.course]) groups[it.course] = { sum: 0, count: 0 };
      groups[it.course].sum += Number(it.price);
      groups[it.course].count += 1;
    }
    const result = {};
    for (const c of Object.keys(groups)) {
      result[c] = groups[c].sum / groups[c].count;
    }
    return result;
  }, [items]);

  const addItem = () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    const num = Number(price);
    if (isNaN(num) || num <= 0) {
      Alert.alert("Invalid price", "Enter a valid number greater than 0.");
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      course,
      price: num,
    };
    setItems((prev) => [newItem, ...prev]);
    setName("");
    setPrice("");
    Alert.alert("Success", `${name} added to ${course}`);
    setScreen("Home");
  };

  const removeItem = (id) => {
    const item = items.find((i) => i.id === id);
    Alert.alert(
      "Remove item?",
      `Delete "${item.name}" from the menu?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () =>
            setItems((prev) => prev.filter((it) => it.id !== id)),
        },
      ]
    );
  };

  const displayedItems =
    filterCourse === "All"
      ? items
      : items.filter((it) => it.course === filterCourse);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.navRow}>
          {["Home", "Add", "Filter"].map((s) => (
            <TouchableOpacity key={s} onPress={() => setScreen(s)}>
              <Text
                style={[
                  styles.navText,
                  screen === s && styles.selectedNav,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {screen === "Home" && (
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Menu Overview</Text>

            <View style={styles.avgBox}>
              <Text style={styles.avgText}>⭐ Average Prices by Course:</Text>
              {["Starters", "Mains", "Dessert"].map((c) => (
                <Text key={c} style={styles.avgText}>
                  {c}: {averages[c] ? `R ${averages[c].toFixed(2)}` : "No items"}
                </Text>
              ))}
            </View>

            <FlatList
              data={displayedItems}
              keyExtractor={(i) => i.id}
              ListEmptyComponent={
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No menu items yet. Tap "Add" to begin.
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <Text style={styles.menuText}>
                    {item.name} ({item.course})
                  </Text>
                  <TouchableOpacity
                    style={styles.priceTag}
                    onPress={() => removeItem(item.id)}
                  >
                    <Text style={styles.priceText}>R {item.price}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}

        {screen === "Add" && (
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Add New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Item name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#333"
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={course}
                onValueChange={setCourse}
                style={{ width: "100%" }}
              >
                <Picker.Item label="Starters" value="Starters" />
                <Picker.Item label="Mains" value="Mains" />
                <Picker.Item label="Dessert" value="Dessert" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Price (e.g. 35)"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholderTextColor="#333"
            />
            <TouchableOpacity style={styles.button} onPress={addItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === "Filter" && (
          <View style={{ flex: 1 }}>
            <Text style={styles.menuTitle}>Filter by Course</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={filterCourse}
                onValueChange={setFilterCourse}
                style={{ width: "100%" }}
              >
                <Picker.Item label="All" value="All" />
                <Picker.Item label="Starters" value="Starters" />
                <Picker.Item label="Mains" value="Mains" />
                <Picker.Item label="Dessert" value="Dessert" />
              </Picker>
            </View>

            <Text
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: 10,
                fontWeight: "bold",
              }}
            >
              Showing {displayedItems.length} items
            </Text>

            <FlatList
              data={displayedItems}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View style={styles.menuItem}>
                  <Text style={styles.menuText}>
                    {item.name} ({item.course})
                  </Text>
                  <TouchableOpacity
                    style={styles.priceTag}
                    onPress={() => removeItem(item.id)}
                  >
                    <Text style={styles.priceText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


