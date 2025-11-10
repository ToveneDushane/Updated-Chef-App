import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();

// Default Menu Items (Drinks added)
const initialMenuItems = [
  { id: '1', dishName: 'Bruschetta', description: 'Grilled bread with tomato and basil', course: 'Starters', price: '45' },
  { id: '2', dishName: 'Caesar Salad', description: 'Classic Caesar with anchovy dressing', course: 'Starters', price: '55' },
  { id: '3', dishName: 'Grilled Steak', description: 'Served with garlic butter and fries', course: 'Mains', price: '150' },
  { id: '4', dishName: 'Pasta Alfredo', description: 'Creamy pasta with parmesan', course: 'Mains', price: '120' },
  { id: '5', dishName: 'Chocolate Cake', description: 'Rich dark chocolate dessert', course: 'Dessert', price: '65' },
  { id: '6', dishName: 'Tiramisu', description: 'Coffee-flavored Italian dessert', course: 'Dessert', price: '75' },
  { id: '7', dishName: 'Iced Coffee', description: 'Chilled espresso with milk and ice', course: 'Drinks', price: '40' },
  { id: '8', dishName: 'Fresh Lemonade', description: 'Refreshing homemade lemon drink', course: 'Drinks', price: '35' },
];

// Function to calculate the average price of menu items by course
const calculateAveragePrice = (menuItems, course) => {
  const itemsByCourse = menuItems.filter(item => item.course === course);
  const total = itemsByCourse.reduce((sum, item) => sum + parseFloat(item.price), 0);
  return itemsByCourse.length ? (total / itemsByCourse.length).toFixed(2) : 0;
};

// Custom Button Component
const CustomButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Home Screen
function HomeScreen({ navigation, route }) {
  const menuItems = route.params?.menuItems || initialMenuItems;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://img.freepik.com/premium-vector/spoon-fork-cartoon-vector-illustration_290315-7544.jpg' }}
        style={styles.logo}
      />
      <Text style={styles.header}>Chef for show by Christoffe</Text>
      <Text>Total Menu Items: {menuItems.length}</Text>

      {/* Average prices for each course */}
      <Text>Average Price for Starters: R{calculateAveragePrice(menuItems, 'Starters')}</Text>
      <Text>Average Price for Mains: R{calculateAveragePrice(menuItems, 'Mains')}</Text>
      <Text>Average Price for Dessert: R{calculateAveragePrice(menuItems, 'Dessert')}</Text>
      <Text>Average Price for Drinks: R{calculateAveragePrice(menuItems, 'Drinks')}</Text>

      {/* Menu list */}
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />

      <CustomButton title="Add/Remove Menu Items" onPress={() => navigation.navigate('ManageMenu', { menuItems })} />
      <CustomButton title="Filter Menu by Course" onPress={() => navigation.navigate('FilterMenu', { menuItems })} />
    </View>
  );
}

// Manage Menu Screen
function ManageMenuScreen({ navigation, route }) {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState('Starters');
  const [price, setPrice] = useState('');
  const [menuItems, setMenuItems] = useState(route.params?.menuItems || initialMenuItems);

  const courses = ['Starters', 'Mains', 'Dessert', 'Drinks'];

  const addMenuItem = () => {
    if (dishName && description && price) {
      const newItem = {
        id: Math.random().toString(),
        dishName,
        description,
        course,
        price,
      };
      setMenuItems([...menuItems, newItem]);
      setDishName('');
      setDescription('');
      setPrice('');
    } else {
      alert('Please fill all fields.');
    }
  };

  const removeMenuItem = (id) => {
    const updatedMenuItems = menuItems.filter(item => item.id !== id);
    setMenuItems(updatedMenuItems);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://cdn0.iconfinder.com/data/icons/food-6-7/128/299-512.png' }}
        style={styles.logo}
      />
      <Text style={styles.header}>Add Menu Items</Text>

      <TextInput style={styles.input} placeholder="Dish Name" value={dishName} onChangeText={setDishName} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
      <Text style={styles.label}>Select Course</Text>
      <Picker selectedValue={course} style={styles.picker} onValueChange={setCourse}>
        {courses.map(item => <Picker.Item key={item} label={item} value={item} />)}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Price (in ZAR)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <CustomButton title="Add Menu Item" onPress={addMenuItem} />

      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - {item.course} - R{item.price}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity onPress={() => removeMenuItem(item.id)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <CustomButton title="Go Back" onPress={() => navigation.navigate('Home', { menuItems })} />
    </View>
  );
}

// Filter Menu Screen
function FilterMenuScreen({ route }) {
  const menuItems = route.params?.menuItems || initialMenuItems;
  const [selectedCourse, setSelectedCourse] = useState('Starters');

  const filteredItems = menuItems.filter(item => item.course === selectedCourse);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Filter Menu by Course</Text>

      <Picker selectedValue={selectedCourse} style={styles.picker} onValueChange={setSelectedCourse}>
        <Picker.Item label="Starters" value="Starters" />
        <Picker.Item label="Mains" value="Mains" />
        <Picker.Item label="Dessert" value="Dessert" />
        <Picker.Item label="Drinks" value="Drinks" />
      </Picker>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text>{item.dishName} - R{item.price}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

// App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ManageMenu" component={ManageMenuScreen} />
        <Stack.Screen name="FilterMenu" component={FilterMenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F6C27A',
  },
  logo: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 25,
    marginTop: 10,
    color: '#666',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  menuItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  menuText: {
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});



