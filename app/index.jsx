import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { getCategories } from "./db/database";

export default function Index() {

  const [categories, setCategories] = useState([])


  useEffect(() => {

    const getCats = async () => {
      const cats = await getCategories()
      setCategories(cats)
    }
    getCats()
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>


      <FlatList
        data={categories}
        renderItem={({ item }) => <Text>{item.name}</Text>}
        keyExtracto={item => item.id}
      />

    </View>
  );
}
