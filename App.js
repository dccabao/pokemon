import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import styles from './styles';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [seed, setSeed] = useState(25);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState('default');

  useEffect(() => {
    fetchMyAPI();
    console.log('offset', offset);
    return () => {
      //cleanup
    };
  }, []);

  const fetchMyAPI = async () => {
    try {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${seed}`,
      );
      response = await response.json();
      setOffset(offset + 25);
      setPokemonList([...pokemonList, ...response.results]);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    fetchMyAPI();
  };

  const handleRefresh = async () => {
    try {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${seed}`,
      );
      response = await response.json();
      setOffset(offset + 25);
      setPokemonList([...pokemonList, ...response.results]);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const DropDown = () => {
    return (
      <DropDownPicker
        items={[
          {
            label: 'Default',
            value: 'default',
            hidden: true,
          },
          {
            label: 'Upgrade',
            value: 'upgrade',
          },
          {
            label: 'Imposter',
            value: 'imposter',
          },
          {
            label: 'Ultimate',
            value: 'ultimate',
          },
        ]}
        defaultValue={status}
        containerStyle={{height: 40}}
        style={{backgroundColor: '#fafafa'}}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => setStatus(item.value)}
      />
    );
  };
  const renderItem = data => (
    <TouchableOpacity style={{backgroundColor: 'skyblue'}}>
      <View style={styles.listItemContainer}>
        <Text style={styles.pokeItemHeader}>{data.item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>List of pokemons by national dex:</Text>
      <DropDown />
      {refreshing ? (
        <Text>Fetching pokemon list</Text>
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            item.name;
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndThreshold={0}
        />
      )}
    </View>
  );
};

export default App;
